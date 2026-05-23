import logging
from django.contrib import admin
from .models import Lead

logger = logging.getLogger('django.security')

@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'lead_type', 'status', 'created_at')
    list_filter = ('status', 'lead_type', 'created_at')
    search_fields = ('name', 'phone', 'email')
    list_editable = ('status',)
    readonly_fields = ('created_at', 'ip_address', 'user_agent', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term')
    fieldsets = (
        ('Контактная информация', {'fields': ('name', 'phone', 'email')}),
        ('Детали заявки', {'fields': ('message', 'debt_amount', 'lead_type', 'status')}),
        ('Аналитика', {'fields': ('source_page', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term')}),
        ('Системная информация', {'fields': ('user_agent', 'ip_address', 'consent_accepted', 'created_at')}),
    )

    def has_module_permission(self, request):
        return request.user.is_superuser

    def has_view_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_add_permission(self, request):
        return request.user.is_superuser

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser

    def change_view(self, request, object_id, form_url='', extra_context=None):
        logger.info(f"AUDIT: User {request.user.username} viewed Lead ID: {object_id}")
        return super().change_view(request, object_id, form_url, extra_context)

    def save_model(self, request, obj, form, change):
        logger.info(f"AUDIT: User {request.user.username} {'modified' if change else 'created'} Lead ID: {obj.pk}")
        super().save_model(request, obj, form, change)
