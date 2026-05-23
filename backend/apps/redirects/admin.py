from django.contrib import admin
from .models import Redirect

@admin.register(Redirect)
class RedirectAdmin(admin.ModelAdmin):
    list_display = ('old_path', 'new_path', 'status_code', 'is_active', 'created_at')
    list_filter = ('is_active', 'status_code')
    search_fields = ('old_path', 'new_path')
    list_editable = ('is_active',)
    readonly_fields = ('created_at', 'updated_at')
