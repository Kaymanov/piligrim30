from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import FAQ
from .serializers import FAQSerializer

class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = FAQSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'related_service']

    def get_queryset(self):
        return FAQ.objects.filter(is_published=True)
