from rest_framework import viewsets
from .models import Redirect
from .serializers import RedirectSerializer

class RedirectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Redirect.objects.filter(is_active=True)
    serializer_class = RedirectSerializer
