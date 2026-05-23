from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LeadViewSet, get_csrf_token

router = DefaultRouter()
router.register(r'leads', LeadViewSet, basename='lead')

urlpatterns = [
    path('csrf/', get_csrf_token, name='csrf-token'),
    path('', include(router.urls)),
]
