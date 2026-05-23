from django.urls import path
from .views import SiteSettingsViewSet

urlpatterns = [
    path('site-settings/', SiteSettingsViewSet.as_view({'get': 'list'})),
]
