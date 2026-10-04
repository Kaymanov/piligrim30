from django.urls import path
from . import views

urlpatterns = [
    path('configuration/', views.configuration),
    path('page/', views.page),
    path('sitemap/', views.sitemap),
]
