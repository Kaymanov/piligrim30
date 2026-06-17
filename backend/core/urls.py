from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from core.common.ckeditor_views import upload_file_webp
from apps.pages.health import health_check

urlpatterns = [
    path('admin/', admin.site.urls),
    # Custom CKEditor upload: converts to WebP + resizes. Replaces the package's
    # default upload view (django_ckeditor_5.urls only defines this one path).
    path("ckeditor5/image_upload/", upload_file_webp, name="ck_editor_5_upload_file"),

    path('api/v1/', include([
        path('health/', health_check, name='health_check'),
        path('', include('apps.pages.urls')),
        path('', include('apps.services.urls')),
        path('blog/', include('apps.blog.urls')),
        path('', include('apps.cases.urls')),
        path('', include('apps.faq.urls')),
        path('', include('apps.reviews.urls')),
        path('', include('apps.leads.urls')),
        path('', include('apps.site_settings.urls')),
        path('', include('apps.redirects.urls')),
        path('', include('apps.chat.urls')),
    ])),
]

# Media served by Django in dev only.
# In production nginx serves /media/ directly from disk (faster, no gunicorn).
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
