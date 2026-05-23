from django.db import models
from django.utils.translation import gettext_lazy as _
from core.common.models import TimestampMixin, PublishableMixin
from apps.seo.models import SEOMixin
from django_ckeditor_5.fields import CKEditor5Field

class Service(SEOMixin, TimestampMixin, PublishableMixin):
    title = models.CharField(max_length=200, verbose_name=_("Заголовок"))
    slug = models.SlugField(max_length=200, unique=True, verbose_name=_("Slug"))
    h1 = models.CharField(max_length=200, blank=True, verbose_name=_("H1"))
    short_description = models.TextField(blank=True, verbose_name=_("Краткое описание"))
    content = CKEditor5Field(blank=True, verbose_name=_("Контент"), config_name='default')
    
    icon = models.ImageField(upload_to="services/icons/", blank=True, null=True, verbose_name=_("Иконка"))
    cover_image = models.ImageField(upload_to="services/covers/", blank=True, null=True, verbose_name=_("Обложка"))
    
    # We will use strings for lazy loading to avoid circular imports if needed
    faq_items = models.ManyToManyField('faq.FAQ', blank=True, related_name='services', verbose_name=_("FAQ"))
    related_services = models.ManyToManyField('self', blank=True, symmetrical=False, verbose_name=_("Связанные услуги"))
    related_articles = models.ManyToManyField('blog.BlogPost', blank=True, related_name='services', verbose_name=_("Связанные статьи"))
    
    is_featured = models.BooleanField(default=False, verbose_name=_("Рекомендуемая услуга"))

    class Meta:
        verbose_name = _("Услуга")
        verbose_name_plural = _("Услуги")

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        from core.common.utils import optimize_image_to_webp
        if self.icon:
            self.icon = optimize_image_to_webp(self.icon)
        if self.cover_image:
            self.cover_image = optimize_image_to_webp(self.cover_image)
        if hasattr(self, 'og_image') and self.og_image:
            self.og_image = optimize_image_to_webp(self.og_image)
        super().save(*args, **kwargs)
