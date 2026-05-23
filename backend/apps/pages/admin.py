from django.contrib import admin
from .models import Page

@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'status', 'is_indexable', 'created_at')
    list_filter = ('status', 'is_indexable')
    search_fields = ('title', 'slug')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Основное', {'fields': ('title', 'slug', 'h1', 'content')}),
        ('SEO', {'fields': (
            'seo_title', 'seo_description', 'canonical_url', 
            'og_title', 'og_description', 'og_image',
            'is_indexable', 'is_followable', 'schema_type', 'sitemap_priority'
        )}),
        ('Публикация', {'fields': ('status', 'published_at', 'created_at', 'updated_at')}),
    )
