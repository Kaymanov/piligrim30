from django.contrib import admin
from .models import Service

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'status', 'is_featured', 'is_indexable', 'created_at')
    list_filter = ('status', 'is_featured', 'is_indexable')
    search_fields = ('title', 'slug')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('created_at', 'updated_at')
    filter_horizontal = ('faq_items', 'related_services', 'related_articles')
    fieldsets = (
        ('Основное', {'fields': ('title', 'slug', 'h1', 'short_description', 'content')}),
        ('Медиа', {'fields': ('icon', 'cover_image')}),
        ('Связи', {'fields': ('faq_items', 'related_services', 'related_articles')}),
        ('SEO', {'fields': (
            'seo_title', 'seo_description', 'canonical_url', 
            'og_title', 'og_description', 'og_image',
            'is_indexable', 'is_followable', 'schema_type', 'sitemap_priority'
        )}),
        ('Публикация', {'fields': ('is_featured', 'status', 'published_at', 'created_at', 'updated_at')}),
    )
