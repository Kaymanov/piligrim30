from django.middleware.csrf import get_token
from rest_framework import viewsets, mixins, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from .models import Lead
from .serializers import LeadSerializer
from .services import send_lead_notification


class LeadViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """
    ViewSet для создания заявок (leads).
    Поддерживает три типа: стандартная, квиз, обратный звонок.
    """
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    throttle_classes = [AnonRateThrottle]

    def perform_create(self, serializer):
        """Save lead and send email notification."""
        lead = serializer.save()
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
