from django.contrib import admin
from .models import FAQ

@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ('question', 'category', 'is_published', 'sort_order', 'created_at')
    list_filter = ('is_published', 'category')
    search_fields = ('question', 'answer')
    list_editable = ('sort_order', 'is_published')
    readonly_fields = ('created_at', 'updated_at')

