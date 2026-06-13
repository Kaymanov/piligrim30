from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from .models import BlogCategory, BlogPost
from .serializers import (
    BlogCategorySerializer,
    BlogPostSerializer,
    BlogPostListSerializer,
)

class BlogCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogCategory.objects.all()
    serializer_class = BlogCategorySerializer
    lookup_field = 'slug'

    @method_decorator(cache_page(60 * 15))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BlogPostSerializer
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category__slug', 'is_news', 'is_featured', 'is_expert_article']

    @method_decorator(cache_page(60 * 15))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def get_serializer_class(self):
        if self.action == 'list':
            return BlogPostListSerializer
        return BlogPostSerializer

    def get_queryset(self):
        qs = BlogPost.objects.filter(status='published').select_related('category')
        if self.action == 'list':
            # Don't load the heavy `content` field for list views
            return qs.defer('content')
        return qs
