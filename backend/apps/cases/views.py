from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from .models import Case
from .serializers import CaseSerializer

class CaseViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CaseSerializer
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']

    def dispatch(self, *args, **kwargs):
        if kwargs.get('slug'):
            return super().dispatch(*args, **kwargs)
        return self.cached_list_dispatch(*args, **kwargs)

    @method_decorator(cache_page(60))
    def cached_list_dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def get_queryset(self):
        return Case.objects.filter(status='published')
