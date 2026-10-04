import time
from concurrent.futures import ThreadPoolExecutor
from unittest.mock import Mock, patch

from django.conf import settings
from django.core.cache import caches
from django.http import StreamingHttpResponse
from django.test import Client, RequestFactory, SimpleTestCase, TestCase, override_settings
from rest_framework.exceptions import Throttled

from apps.leads.models import Lead
from apps.leads.services import normalize_phone
from .security import (
    GuardedStream, acquire_chat_slot, client_bucket, client_ip, enforce_limit,
    reserve_phone,
)


class ClientIdentityTests(SimpleTestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_untrusted_peer_cannot_change_ip(self):
        request = self.factory.get('/', REMOTE_ADDR='198.51.100.4', HTTP_X_FORWARDED_FOR='1.2.3.4')
        self.assertEqual(client_ip(request), '198.51.100.4')

    @override_settings(TRUSTED_PROXY_CIDRS=['127.0.0.1/32', '172.20.0.1/32'])
    def test_trusted_chain_stops_at_first_untrusted_hop(self):
        request = self.factory.get('/', REMOTE_ADDR='172.20.0.1', HTTP_X_FORWARDED_FOR='1.2.3.4, 198.51.100.4, 127.0.0.1')
        self.assertEqual(client_ip(request), '198.51.100.4')
        request.META['HTTP_X_FORWARDED_FOR'] = 'invalid'
        self.assertEqual(client_ip(request), '172.20.0.1')

    def test_ipv6_suffix_rotation_shares_budget(self):
        a = self.factory.get('/', REMOTE_ADDR='2001:db8:1::a')
        b = self.factory.get('/', REMOTE_ADDR='2001:db8:1::b')
        self.assertEqual(client_bucket(a), client_bucket(b))
        self.assertEqual(client_ip(self.factory.get('/', REMOTE_ADDR='::ffff:192.0.2.1')), '192.0.2.1')


class AtomicProtectionTests(SimpleTestCase):
    def setUp(self):
        caches['security'].clear()

    def test_parallel_requests_cannot_exceed_allowance(self):
        def attempt(_):
            try:
                enforce_limit('parallel', 'same-ip', 5, 60)
                return True
            except Throttled:
                return False
        with patch('core.security.time.time', return_value=100), ThreadPoolExecutor(max_workers=12) as executor:
            self.assertEqual(sum(executor.map(attempt, range(30))), 5)

    def test_parallel_phone_reservation_accepts_only_one(self):
        def attempt(_):
            try:
                reserve_phone(normalize_phone('8 (917) 123-45-67'))
                return True
            except Throttled:
                return False
        with ThreadPoolExecutor(max_workers=10) as executor:
            self.assertEqual(sum(executor.map(attempt, range(20))), 1)
        with self.assertRaises(Throttled):
            reserve_phone(normalize_phone('+7 917 123 45 67'))

    def test_stream_releases_when_never_started_or_partially_consumed(self):
        for consume in (False, True):
            release = Mock()
            response = StreamingHttpResponse(GuardedStream(iter([b'one', b'two']), release))
            if consume:
                next(iter(response.streaming_content))
            response.close()
            self.assertTrue(release.called)

    def test_redis_concurrent_slots_and_release(self):
        if not hasattr(caches['security'], 'lock'):
            self.skipTest('Run with PILIGRIM_TEST_REDIS_URL for Redis lease integration')
        factory = RequestFactory()
        a = factory.post('/', REMOTE_ADDR='192.0.2.1')
        b = factory.post('/', REMOTE_ADDR='192.0.2.2')
        with override_settings(CHAT_MAX_CONCURRENT=1):
            release = acquire_chat_slot(a)
            try:
                with self.assertRaises(Throttled):
                    acquire_chat_slot(a)
                with self.assertRaises(Throttled):
                    acquire_chat_slot(b)
            finally:
                release()
            next_release = acquire_chat_slot(b)
            next_release()


class PublicWriteTests(TestCase):
    def setUp(self):
        caches['security'].clear()
        caches['default'].clear()
        self.client = Client(enforce_csrf_checks=True)
        response = self.client.get('/api/v1/csrf/')
        self.token = response.json()['csrfToken']
        self.assertEqual(response['Cache-Control'], 'no-store')
        self.payload = {
            'name': 'Анна', 'phone': '+7 (917) 234-56-78',
            'consent_accepted': True, '_ts': int(time.time() * 1000) - 5000,
            '_hid': 'interaction',
        }

    def post(self, path, data=None, **extra):
        return self.client.post(path, data if data is not None else self.payload,
                                content_type='application/json', HTTP_X_CSRFTOKEN=self.token,
                                HTTP_USER_AGENT='Mozilla/5.0', **extra)

    def test_anonymous_writes_require_csrf(self):
        for path in ('/api/v1/leads/', '/api/v1/leads.json/', '/api/v1/leads/quiz.json/', '/api/v1/leads/quiz/', '/api/v1/leads/callback/',
                     '/api/v1/chat/', '/api/v1/chat/stream/', '/api/v1/chat/reset/'):
            caches['security'].clear()
            response = self.client.post(path, {}, content_type='application/json')
            self.assertEqual(response.status_code, 403, path)
        self.assertEqual(Lead.objects.count(), 0)

    def test_untrusted_origin_is_rejected_even_with_token(self):
        response = self.post('/api/v1/leads/', HTTP_ORIGIN='https://evil.example')
        self.assertEqual(response.status_code, 403)

    @patch('apps.leads.views.send_lead_notification_task.delay')
    def test_valid_submission_and_canonical_phone_dedup(self, notify):
        response = self.post('/api/v1/leads', HTTP_X_FORWARDED_FOR='1.2.3.4')
        self.assertEqual(response.status_code, 201, response.content)
        self.assertEqual(Lead.objects.get().ip_address, '127.0.0.1')
        self.assertEqual(Lead.objects.get().status, Lead.Status.NEW)
        notify.assert_called_once()
        self.payload['phone'] = '8 (917) 234-56-78'
        self.assertEqual(self.post('/api/v1/leads/callback/').status_code, 429)
        self.assertEqual(Lead.objects.count(), 1)

    def test_missing_consent_or_phone_cannot_create_lead(self):
        for key in ('phone', 'consent_accepted'):
            data = dict(self.payload)
            del data[key]
            response = self.post('/api/v1/leads/', data)
            self.assertEqual(response.status_code, 400)
            self.assertIn(key, response.json())
        self.assertEqual(Lead.objects.count(), 0)

    def test_honeypot_does_not_create_lead(self):
        self.payload['website'] = 'https://spam.example'
        self.assertEqual(self.post('/api/v1/leads/').status_code, 400)
        self.assertEqual(Lead.objects.count(), 0)

    def test_endpoint_cookie_and_forwarded_ip_rotation_do_not_reset_lead_limit(self):
        with patch('core.security.time.time', return_value=100):
            for number in range(6):
                self.client.cookies['sessionid'] = f'rotated-{number}'
                path = ('/api/v1/leads/', '/api/v1/leads/quiz/', '/api/v1/leads/callback/')[number % 3]
                response = self.post(path, {}, HTTP_X_FORWARDED_FOR=f'192.0.2.{number + 1}')
                self.assertEqual(response.status_code, 400 if number < 5 else 429)
            self.assertIn('Retry-After', response)

    @patch('core.abuse_middleware.acquire_chat_slot', return_value=lambda: None)
    @override_settings(CHAT_GLOBAL_DAILY_LIMIT=1)
    def test_chat_reset_does_not_reset_shared_ai_budget(self, slot):
        self.assertEqual(self.post('/api/v1/chat/', {'message': ''}).status_code, 400)
        self.assertEqual(self.post('/api/v1/chat/reset/', {}).status_code, 200)
        self.client.cookies.pop('sessionid', None)
        self.assertEqual(self.post('/api/v1/chat/stream/', {'message': 'долг'}).status_code, 429)
        self.assertEqual(slot.call_count, 1)

    def test_storage_failure_denies_writes_but_public_reads_work(self):
        with patch('core.security.security_cache', side_effect=ConnectionError):
            self.assertEqual(self.post('/api/v1/leads/').status_code, 503)
            self.assertEqual(self.client.get('/api/v1/csrf/').status_code, 200)
        self.assertEqual(Lead.objects.count(), 0)

    def test_large_body_and_wrong_format_are_rejected(self):
        self.assertEqual(self.post('/api/v1/leads/', {'message': 'x' * 17000}).status_code, 413)
        self.assertEqual(self.client.post('/api/v1/leads/', {}).status_code, 415)

    def test_admin_login_bruteforce_is_limited(self):
        with patch('core.security.time.time', return_value=100):
            for _ in range(10):
                self.assertEqual(self.client.post('/admin/login/', {}).status_code, 403)
            self.assertEqual(self.client.post('/admin/login/', {}).status_code, 429)
