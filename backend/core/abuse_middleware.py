"""Protect anonymous writes without challenging public pages or search crawlers."""
from django.conf import settings
from django.http import JsonResponse
from django.middleware.csrf import CsrfViewMiddleware
from rest_framework.exceptions import Throttled

from .security import (
    GuardedStream, ProtectionUnavailable, acquire_chat_slot, client_bucket,
    enforce_limit,
)


class AbuseProtectionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.csrf = CsrfViewMiddleware(get_response)

    def __call__(self, request):
        path = request.path_info
        is_lead = path.startswith(('/api/v1/leads/', '/api/v1/leads.'))
        is_chat = path.startswith('/api/v1/chat/')
        is_login = path.rstrip('/') == '/admin/login'
        if request.method in ('GET', 'HEAD', 'OPTIONS') or not (is_lead or is_chat or is_login):
            return self.get_response(request)

        release = None
        try:
            identity = client_bucket(request)
            if is_login:
                enforce_limit('admin-login', identity, 10, 300)
                enforce_limit('admin-login-hour', identity, 30, 3600)
                # Normal Django admin still performs its own CSRF and authentication.
                return self.get_response(request)

            scope = 'lead' if is_lead else 'chat'
            enforce_limit(scope, identity, 5 if is_lead else 10, 60)
            enforce_limit(scope + '-hour', identity, 20 if is_lead else 60, 3600)
            try:
                length = int(request.META.get('CONTENT_LENGTH') or 0)
            except ValueError:
                return JsonResponse({'detail': 'Некорректный запрос.'}, status=400)
            if length > settings.PUBLIC_WRITE_MAX_BYTES or len(request.body) > settings.PUBLIC_WRITE_MAX_BYTES:
                return JsonResponse({'detail': 'Слишком большой запрос.'}, status=413)
            if request.content_type != 'application/json':
                return JsonResponse({'detail': 'Ожидается JSON.'}, status=415)

            # DRF exempts anonymous requests from Django's usual CSRF middleware.
            # Checking a non-exempt callback enforces cookie + token + origin here.
            self.csrf.process_request(request)
            rejected = self.csrf.process_view(request, lambda req: None, (), {})
            if rejected:
                return JsonResponse({'detail': 'Обновите страницу и повторите отправку.'}, status=403)

            if is_chat and path in ('/api/v1/chat/', '/api/v1/chat/stream/'):
                enforce_limit('chat-day', identity, settings.CHAT_IP_DAILY_LIMIT, 86400)
                enforce_limit('chat-global-day', 'all', settings.CHAT_GLOBAL_DAILY_LIMIT, 86400)
                release = acquire_chat_slot(request)
            response = self.get_response(request)
            response['Cache-Control'] = 'no-store'
            if release and response.streaming:
                response.streaming_content = GuardedStream(response.streaming_content, release)
                release = None  # The response owns the lease until close().
            return response
        except (Throttled, ProtectionUnavailable) as error:
            response = JsonResponse({'detail': str(error.detail)}, status=error.status_code)
            response['Retry-After'] = str(getattr(error, 'wait', None) or 30)
            response['Cache-Control'] = 'no-store'
            return response
        finally:
            if release:
                release()
