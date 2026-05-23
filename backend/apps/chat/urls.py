from django.urls import path
from .views import ChatView, ChatResetView

urlpatterns = [
    path('chat/', ChatView.as_view(), name='chat'),
    path('chat/reset/', ChatResetView.as_view(), name='chat-reset'),
]
