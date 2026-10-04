import logging
from django.conf import settings
from django.db import transaction
from django.db.models.signals import pre_save, post_save, post_delete
from django.dispatch import receiver
from apps.blog.models import BlogPost
from apps.cases.models import Case
from apps.pages.models import Page
from apps.services.models import Service
from .models import SEOPage, SEOConfiguration
from .routes import STATIC_ROUTES
from .tasks import notify_indexnow, PRODUCTION_ORIGIN

logger = logging.getLogger(__name__)
CONTENT_MODELS = (BlogPost, Case, Page, Service, SEOPage)


def public_path(instance):
    if isinstance(instance, SEOPage):
        return instance.path
    if instance.status != 'published':
        return None
    if isinstance(instance, BlogPost):
        return '/blog/' + instance.slug
    if isinstance(instance, Case):
        return '/cases/' + instance.slug
    path = '/' + instance.slug
    return path if path in STATIC_ROUTES else None


def enqueue(paths):
    paths = sorted({path for path in paths if path})
    if not paths or not SEOConfiguration.objects.filter(indexnow_enabled=True, indexing_enabled=True).exists():
        return

    def send():
        try:
            notify_indexnow.delay(paths)
        except Exception:
            # Publishing content must not fail when the queue is unavailable.
            logger.exception('IndexNow queue unavailable for %s', paths)
    transaction.on_commit(send)


@receiver(pre_save)
def capture_previous_path(sender, instance, raw=False, **kwargs):
    if raw or sender not in CONTENT_MODELS or settings.SITE_URL != PRODUCTION_ORIGIN:
        return
    previous = sender.objects.filter(pk=instance.pk).first() if instance.pk else None
    instance._previous_seo_path = public_path(previous) if previous else None


@receiver(post_save)
def notify_changed_page(sender, instance, raw=False, **kwargs):
    if raw or sender not in CONTENT_MODELS or settings.SITE_URL != PRODUCTION_ORIGIN:
        return
    enqueue([getattr(instance, '_previous_seo_path', None), public_path(instance)])


@receiver(post_delete)
def notify_deleted_page(sender, instance, **kwargs):
    if sender not in CONTENT_MODELS or settings.SITE_URL != PRODUCTION_ORIGIN:
        return
    enqueue([public_path(instance)])
