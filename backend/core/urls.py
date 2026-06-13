"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve as static_serve
from core.common.ckeditor_views import upload_file_webp

urlpatterns = [
    path('admin/', admin.site.urls),
    # Custom CKEditor upload: converts to WebP + resizes. Replaces the package's
    # default upload view (django_ckeditor_5.urls only defines this one path).
    path("ckeditor5/image_upload/", upload_file_webp, name="ck_editor_5_upload_file"),
    
    path('api/v1/', include([
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

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    # Serve uploaded media in production (gunicorn behind nginx).
    # Keeps deployment simple without requiring extra nginx location blocks.
    urlpatterns += [
        re_path(
            r'^media/(?P<path>.*)$',
            static_serve,
            {'document_root': settings.MEDIA_ROOT},
        ),
    ]
