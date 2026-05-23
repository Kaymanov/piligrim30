from django.contrib import admin
from .models import BlogCategory, BlogPost

@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'category', 'status', 'is_news', 'is_featured', 'created_at')
    list_filter = ('status', 'category', 'is_news', 'is_expert_article', 'is_featured')
    search_fields = ('title', 'slug', 'excerpt')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Основное', {'fields': ('title', 'slug', 'h1', 'excerpt', 'content', 'category', 'tags', 'author')}),
        ('Флаги', {'fields': ('is_news', 'is_expert_article', 'is_featured', 'reading_time')}),
        ('Медиа', {'fields': ('cover_image',)}),
        ('SEO', {'fields': (
            'seo_title', 'seo_description', 'canonical_url', 
            'og_title', 'og_description', 'og_image',
            'is_indexable', 'is_followable', 'schema_type', 'sitemap_priority'
        )}),
        ('Публикация', {'fields': ('status', 'published_at', 'created_at', 'updated_at')}),
    )
