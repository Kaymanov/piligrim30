from django.contrib import admin
from .models import SEOConfiguration, SEOPage


@admin.register(SEOPage)
class SEOPageAdmin(admin.ModelAdmin):
    list_display = ('path', 'seo_title', 'is_indexable', 'updated_at')
    list_filter = ('is_indexable',)
    search_fields = ('path', 'seo_title', 'seo_description')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {'fields': ('path', 'seo_title', 'seo_description')}),
        ('Индексация', {'fields': ('canonical_url', 'is_indexable', 'is_followable')}),
        ('Социальные сети', {'fields': ('og_title', 'og_description', 'og_image')}),
        ('Микроразметка', {'fields': ('schema_type',), 'description':
            'Поддерживаются WebPage, CollectionPage, ContactPage, Service. Тип должен соответствовать содержимому страницы.'}),
        ('Даты', {'fields': ('created_at', 'updated_at')}),
    )


@admin.register(SEOConfiguration)
class SEOConfigurationAdmin(admin.ModelAdmin):
    readonly_fields = ('created_at', 'updated_at')

    def has_add_permission(self, request):
        return not SEOConfiguration.objects.exists() and super().has_add_permission(request)

    def has_delete_permission(self, request, obj=None):
        return False
