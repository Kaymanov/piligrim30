from django.middleware.csrf import get_token
from rest_framework import viewsets, mixins, status
from rest_framework.decorators import api_view, action
from rest_framework.exceptions import Throttled
from rest_framework.response import Response
from rest_framework.throttling import SimpleRateThrottle
import logging

from .models import Lead
from .protection import register_violation
from .serializers import LeadSerializer
from .tasks import send_lead_notification_task

logger = logging.getLogger(__name__)


class LeadSubmitThrottle(SimpleRateThrottle):
    """
    Stricter rate limit for lead form submissions: 3 per minute per IP.
    Separate from the global AnonRateThrottle (5/min) to protect the
    lead creation endpoint specifically.
    """
    scope = "lead_submit"

    def get_cache_key(self, request, view):
        return self.cache_format % {
            "scope": self.scope,
            "ident": self.get_ident(request),
        }


class LeadViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """
    ViewSet для создания заявок (leads).
    Поддерживает три типа: стандартная, квиз, обратный звонок.
    """
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    throttle_classes = [LeadSubmitThrottle]

    def throttled(self, request, wait):
        """Register IP violation on throttle hit for progressive banning."""
        ip = self._get_client_ip(request)
        register_violation(ip)
        raise Throttled(wait)

    def _get_client_ip(self, request):
        xff = request.META.get('HTTP_X_FORWARDED_FOR')
        return xff.split(',')[0].strip() if xff else request.META.get('REMOTE_ADDR', '')

    def perform_create(self, serializer):
        """Save lead and dispatch async email notification via Celery.
        Spam-flagged leads are saved but notification is suppressed."""
        lead = serializer.save()

        # Skip notification for leads flagged as spam by bot protection
        if lead.status == Lead.Status.SPAM:
            logger.info(f"Skipping notification for spam Lead ID: {lead.pk}")
            return

        # Dispatch async — user gets 201 immediately; email goes in background.
        # Falls back to synchronous send if Celery/Redis is unavailable.
        try:
            send_lead_notification_task.delay(lead.pk)
        except Exception:
            from .services import send_lead_notification
            logger.warning(
                f"Celery unavailable — sending email synchronously for Lead {lead.pk}"
            )
            send_lead_notification(lead)

    @action(detail=False, methods=['post'], url_path='quiz')
    def quiz_lead(self, request):
        """Создание заявки из квиза."""
        data = request.data.copy()
        data['lead_type'] = Lead.LeadType.QUIZ
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, methods=['post'], url_path='callback')
    def callback_lead(self, request):
        """Создание заявки на обратный звонок."""
        data = request.data.copy()
        data['lead_type'] = Lead.LeadType.CALLBACK
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


@api_view(['GET'])
def get_csrf_token(request):
    """
    Endpoint для получения CSRF-токена.
    Frontend вызывает GET /api/v1/csrf/ перед отправкой форм.
    Токен устанавливается в cookie и возвращается в теле ответа.
    """
    token = get_token(request)
    return Response({'csrfToken': token})
