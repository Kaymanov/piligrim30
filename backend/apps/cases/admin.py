from django.contrib import admin
from .models import Case

@admin.register(Case)
class CaseAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'status', 'created_at')
    list_filter = ('status', 'is_indexable')
    search_fields = ('title', 'slug')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Основное', {'fields': ('title', 'slug', 'debt_amount', 'case_duration', 'client_problem', 'what_was_done', 'result', 'lawyer_comment', 'disclaimer')}),
        ('Медиа', {'fields': ('cover_image',)}),
        ('SEO', {'fields': (
            'seo_title', 'seo_description', 'canonical_url', 
            'og_title', 'og_description', 'og_image',
            'is_indexable', 'is_followable', 'schema_type', 'sitemap_priority'
        )}),
        ('Публикация', {'fields': ('status', 'published_at', 'created_at', 'updated_at')}),
    )
