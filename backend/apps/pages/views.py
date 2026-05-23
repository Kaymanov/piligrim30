from rest_framework import viewsets
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from .models import Page
from .serializers import PageSerializer

class PageViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PageSerializer
    lookup_field = 'slug'

    @method_decorator(cache_page(60 * 15))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def get_queryset(self):
        return Page.objects.filter(status='published')
