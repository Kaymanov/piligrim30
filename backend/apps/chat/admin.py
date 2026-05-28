from django.contrib import admin
from .models import ChatLog


@admin.register(ChatLog)
class ChatLogAdmin(admin.ModelAdmin):
    list_display = ("created_at", "short_message", "is_fallback", "response_time_ms", "ip_address")
    list_filter = ("is_fallback", "created_at")
    search_fields = ("user_message", "ai_response", "session_key")
    readonly_fields = ("session_key", "user_message", "ai_response", "is_fallback", "quiz_context", "ip_address", "response_time_ms", "created_at")
    date_hierarchy = "created_at"

    def short_message(self, obj):
        return obj.user_message[:80]
    short_message.short_description = "Сообщение"

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
