from django.apps import AppConfig


class SeoConfig(AppConfig):
    name = 'apps.seo'
    verbose_name = 'Поисковое продвижение (SEO)'

    def ready(self):
        from . import signals  # noqa: F401
