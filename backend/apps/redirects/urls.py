from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RedirectViewSet

router = DefaultRouter()
router.register(r'redirects', RedirectViewSet, basename='redirect')

urlpatterns = [
    path('', include(router.urls)),
]
