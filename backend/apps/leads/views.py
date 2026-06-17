from django.middleware.csrf import get_token
from rest_framework import viewsets, mixins, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle, SimpleRateThrottle

from .models import Lead
from .serializers import LeadSerializer
from .tasks import send_lead_notification_task


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

    def perform_create(self, serializer):
        """Save lead and dispatch async email notification via Celery."""
        lead = serializer.save()
        # Dispatch async — user gets 201 immediately; email goes in background.
        # Falls back to synchronous send if Celery/Redis is unavailable.
        try:
            send_lead_notification_task.delay(lead.pk)
        except Exception:
            from .services import send_lead_notification
            import logging
            logging.getLogger(__name__).warning(
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
