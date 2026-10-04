from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import SEOConfiguration
from .routes import STATIC_ROUTES
from .services import static_page_seo, sitemap_entries


@api_view(['GET'])
@permission_classes([AllowAny])
def configuration(request):
    config = SEOConfiguration.objects.first() or SEOConfiguration()
    fields = ('indexing_enabled', 'site_name', 'default_description',
              'google_verification', 'yandex_verification', 'organization_name',
              'address', 'phone', 'area_served')
    data = {field: getattr(config, field) for field in fields}
    data['default_og_image'] = config.default_og_image.url if config.default_og_image else None
    return Response(data)


@api_view(['GET'])
@permission_classes([AllowAny])
def page(request):
    path = request.query_params.get('path', '/')
    if path not in STATIC_ROUTES:
        return Response({'detail': 'Unknown page'}, status=404)
    return Response(static_page_seo(path))


@api_view(['GET'])
@permission_classes([AllowAny])
def sitemap(request):
    return Response(sitemap_entries())
