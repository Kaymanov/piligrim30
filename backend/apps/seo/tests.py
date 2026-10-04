from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import TestCase
from apps.blog.models import BlogPost
from apps.cases.models import Case
from apps.services.models import Service
from .models import SEOConfiguration, SEOPage
from django.test import override_settings
from unittest.mock import patch, MagicMock
from .tasks import notify_indexnow


class SEOIntegrationTests(TestCase):
    def setUp(self):
        cache.clear()

    def test_admin_edit_reaches_api_and_removes_page_from_sitemap(self):
        user = get_user_model().objects.create_superuser('editor', 'editor@example.test', 'test-only')
        self.client.force_login(user)
        response = self.client.post('/admin/seo/seopage/add/', {
            'path': '/spisanie-dolgov', 'seo_title': 'Заголовок из админки',
            'seo_description': 'Описание из админки', 'canonical_url': '',
            'og_title': 'Заголовок для соцсетей', 'og_description': '',
            'schema_type': 'Service', 'is_followable': 'on', '_save': 'Сохранить',
        })
        self.assertEqual(response.status_code, 302)
        self.client.logout()
        data = self.client.get('/api/v1/seo/page/', {'path': '/spisanie-dolgov'}).json()
        self.assertEqual(data['seo_title'], 'Заголовок из админки')
        self.assertEqual(data['og_title'], 'Заголовок для соцсетей')
        self.assertFalse(data['is_indexable'])
        urls = self.client.get('/api/v1/seo/sitemap/').json()
        self.assertNotIn('/spisanie-dolgov', [item['path'] for item in urls])

    def test_existing_service_seo_is_used_without_override(self):
        Service.objects.create(title='Услуга', slug='spisanie-dolgov', status='published',
                               seo_title='SEO услуги', is_indexable=False)
        response = self.client.get('/api/v1/seo/page/', {'path': '/spisanie-dolgov'})
        self.assertEqual(response.json()['seo_title'], 'SEO услуги')
        self.assertFalse(response.json()['is_indexable'])

    def test_static_override_takes_precedence(self):
        Service.objects.create(title='Услуга', slug='spisanie-dolgov', status='published', seo_title='Услуга')
        SEOPage.objects.create(path='/spisanie-dolgov', seo_title='Переопределение')
        self.assertEqual(self.client.get('/api/v1/seo/page/', {'path': '/spisanie-dolgov'}).json()['seo_title'],
                         'Переопределение')

    def test_sitemap_contains_only_published_indexable_canonical_materials(self):
        post = BlogPost.objects.create(title='Статья', slug='visible', status='published')
        BlogPost.objects.create(title='Черновик', slug='draft')
        BlogPost.objects.create(title='Скрыта', slug='hidden', status='published', is_indexable=False)
        BlogPost.objects.create(title='Дубль', slug='duplicate', status='published',
                                canonical_url='https://piligrim30.ru/blog/visible')
        Case.objects.create(title='Внешний canonical', slug='external', status='published',
                            canonical_url='https://example.com/cases/external')
        entries = {entry['path']: entry for entry in self.client.get('/api/v1/seo/sitemap/').json()}
        self.assertEqual(entries['/blog/visible']['last_modified'], post.updated_at.isoformat())
        for path in ['/blog/draft', '/blog/hidden', '/blog/duplicate', '/cases/external']:
            self.assertNotIn(path, entries)

    def test_global_indexing_switch_and_verification(self):
        SEOConfiguration.objects.create(indexing_enabled=False, google_verification='google-test',
                                        yandex_verification='yandex-test')
        config = self.client.get('/api/v1/seo/configuration/').json()
        self.assertFalse(config['indexing_enabled'])
        self.assertEqual(config['google_verification'], 'google-test')
        self.assertEqual(config['yandex_verification'], 'yandex-test')
        self.assertEqual(self.client.get('/api/v1/seo/sitemap/').json(), [])

    def test_public_endpoints_cannot_change_settings(self):
        self.assertEqual(self.client.post('/api/v1/seo/configuration/', {'indexing_enabled': True}).status_code, 405)
        self.assertEqual(self.client.post('/api/v1/seo/page/', {'path': '/'}).status_code, 405)

    def test_unknown_page_is_not_a_public_seo_route(self):
        self.assertEqual(self.client.get('/api/v1/seo/page/', {'path': '/admin/'}).status_code, 404)

    def test_default_api_reads_do_not_create_database_rows(self):
        self.client.get('/api/v1/seo/configuration/')
        self.assertEqual(SEOConfiguration.objects.count(), 0)

    def test_article_and_case_indexing_changes_are_not_hidden_by_api_cache(self):
        for model, endpoint in ((BlogPost, '/api/v1/blog/posts/'), (Case, '/api/v1/cases/')):
            item = model.objects.create(title='Материал', slug='updated', status='published')
            self.assertTrue(self.client.get(endpoint + 'updated/').json()['is_indexable'])
            item.is_indexable = False
            item.save()
            self.assertFalse(self.client.get(endpoint + 'updated/').json()['is_indexable'])


class IndexNowTests(TestCase):
    @patch('apps.seo.tasks.urlopen')
    def test_test_environment_never_notifies_search_engines(self, urlopen):
        SEOConfiguration.objects.create(indexnow_enabled=True)
        self.assertEqual(notify_indexnow.run(['/']), 'disabled-environment')
        urlopen.assert_not_called()

    @override_settings(SITE_URL='https://piligrim30.ru', INDEXNOW_KEY='test-key-12345')
    @patch('apps.seo.tasks.urlopen')
    def test_explicitly_enabled_production_sends_only_own_urls(self, urlopen):
        import json
        SEOConfiguration.objects.create(indexnow_enabled=True)
        response = MagicMock()
        response.__enter__.return_value.status = 202
        urlopen.return_value = response
        self.assertEqual(notify_indexnow.run(['/blog/new', '//example.com', '/blog/new']), 202)
        payload = json.loads(urlopen.call_args.args[0].data)
        self.assertEqual(payload['urlList'], ['https://piligrim30.ru/blog/new'])
        self.assertEqual(payload['keyLocation'], 'https://piligrim30.ru/indexnow-key.txt')

    @override_settings(SITE_URL='https://piligrim30.ru', INDEXNOW_KEY='test-key-12345')
    @patch('apps.seo.signals.notify_indexnow.delay')
    def test_publish_rename_and_unpublish_notify_after_commit(self, delay):
        SEOConfiguration.objects.create(indexnow_enabled=True)
        with self.captureOnCommitCallbacks(execute=True):
            post = BlogPost.objects.create(title='Черновик', slug='old')
        delay.assert_not_called()
        with self.captureOnCommitCallbacks(execute=True):
            post.status = 'published'
            post.save()
        delay.assert_called_with(['/blog/old'])
        with self.captureOnCommitCallbacks(execute=True):
            post.slug = 'new'
            post.save()
        delay.assert_called_with(['/blog/new', '/blog/old'])
        with self.captureOnCommitCallbacks(execute=True):
            post.status = 'archived'
            post.save()
        delay.assert_called_with(['/blog/new'])
