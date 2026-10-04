"""Resolve the admin settings used by metadata and sitemap together."""
from urllib.parse import urlsplit

from apps.blog.models import BlogPost
from apps.cases.models import Case
from apps.pages.models import Page
from apps.services.models import Service
from .models import SEOConfiguration, SEOPage
from .routes import STATIC_ROUTES, SERVICE_ROUTES

SEO_FIELDS = ('seo_title', 'seo_description', 'canonical_url', 'og_title',
              'og_description', 'is_indexable', 'is_followable', 'schema_type')


def public_seo(instance):
    data = {field: getattr(instance, field) for field in SEO_FIELDS}
    data['og_image'] = instance.og_image.url if instance.og_image else None
    data['updated_at'] = instance.updated_at.isoformat()
    return data


def static_page_seo(path):
    override = SEOPage.objects.filter(path=path).first()
    if override:
        return public_seo(override)
    slug = path.strip('/')
    source = None
    if path in SERVICE_ROUTES:
        source = Service.objects.filter(slug=slug, status='published').first()
    if source is None:
        source = Page.objects.filter(slug=slug, status='published').first()
    return public_seo(source) if source else {}


def sitemap_entries():
    config = SEOConfiguration.objects.first()
    if config and not config.indexing_enabled:
        return []
    entries = []
    candidates = [(path, static_page_seo(path)) for path in STATIC_ROUTES]
    for model, prefix in ((BlogPost, '/blog/'), (Case, '/cases/')):
        candidates.extend((prefix + item.slug, public_seo(item))
                          for item in model.objects.filter(status='published'))
    for path, seo in candidates:
        if not seo.get('is_indexable', True):
            continue
        canonical = seo.get('canonical_url')
        if canonical:
            parsed = urlsplit(canonical)
            if (parsed.scheme != 'https' or parsed.netloc != 'piligrim30.ru'
                    or parsed.path.rstrip('/') != path.rstrip('/') or parsed.query or parsed.fragment):
                continue
        entries.append({'path': path, 'last_modified': seo.get('updated_at')})
    return entries
