from django.contrib import admin
from .models import Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('author_name', 'rating', 'service', 'is_published', 'created_at')
    list_filter = ('is_published', 'rating', 'service')
    search_fields = ('author_name', 'text')
    list_editable = ('is_published',)
    readonly_fields = ('created_at', 'updated_at')

