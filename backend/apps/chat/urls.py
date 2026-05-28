from django.urls import path
from .views import ChatView, ChatStreamView, ChatResetView

urlpatterns = [
    path('chat/', ChatView.as_view(), name='chat'),
    path('chat/stream/', ChatStreamView.as_view(), name='chat-stream'),
    path('chat/reset/', ChatResetView.as_view(), name='chat-reset'),
]
