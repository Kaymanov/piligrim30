from rest_framework import viewsets, mixins
from rest_framework.response import Response
from .models import SiteSettings
from .serializers import SiteSettingsSerializer

class SiteSettingsViewSet(viewsets.ViewSet):
    def list(self, request):
        settings = SiteSettings.objects.first()
        if not settings:
            settings = SiteSettings.objects.create()
        serializer = SiteSettingsSerializer(settings)
        return Response(serializer.data)
