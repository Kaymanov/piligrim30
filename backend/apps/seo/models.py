from django.db import models
from django.utils.translation import gettext_lazy as _

class SEOMixin(models.Model):
    seo_title = models.CharField(max_length=70, blank=True, verbose_name=_("SEO Title"))
    seo_description = models.CharField(max_length=160, blank=True, verbose_name=_("SEO Description"))
    canonical_url = models.URLField(blank=True, verbose_name=_("Canonical URL"))
    
    og_title = models.CharField(max_length=70, blank=True, verbose_name=_("OG Title"))
    og_description = models.CharField(max_length=160, blank=True, verbose_name=_("OG Description"))
    og_image = models.ImageField(upload_to="seo/og_images/", blank=True, null=True, verbose_name=_("OG Image"))
    
    is_indexable = models.BooleanField(default=True, verbose_name=_("Индексировать (index)"))
    is_followable = models.BooleanField(default=True, verbose_name=_("Переходить по ссылкам (follow)"))
    
    schema_type = models.CharField(
        max_length=50, 
        blank=True, 
        help_text=_("Например: WebPage, Article, Service, FAQPage, LegalService"),
        verbose_name=_("Schema.org Type")
    )
    sitemap_priority = models.DecimalField(
        max_digits=2, 
        decimal_places=1, 
        default=0.5, 
        verbose_name=_("Sitemap Priority")
    )

    class Meta:
        abstract = True
