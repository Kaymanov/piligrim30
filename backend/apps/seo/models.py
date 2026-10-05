from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from core.common.models import TimestampMixin
from .routes import STATIC_ROUTES
from django.conf import settings
import re

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


class SEOPage(SEOMixin, TimestampMixin):
    path = models.CharField('Страница', max_length=255, unique=True, choices=list(STATIC_ROUTES.items()))

    class Meta:
        verbose_name = 'SEO статической страницы'
        verbose_name_plural = 'SEO статических страниц'

    def __str__(self):
        return STATIC_ROUTES.get(self.path, self.path)


class SEOConfiguration(TimestampMixin):
    indexnow_enabled = models.BooleanField('Уведомлять Яндекс через IndexNow', default=False,
        help_text='Требуется INDEXNOW_KEY в окружении. Отправка только с SITE_URL=https://piligrim30.ru.')
    indexing_enabled = models.BooleanField('Разрешить индексацию основного сайта', default=True,
        help_text='Тестовый домен дополнительно закрыт настройками окружения.')
    site_name = models.CharField('Название сайта', max_length=100, default='Правовой Пилигрим')
    default_description = models.CharField('Описание по умолчанию', max_length=300,
        default='Банкротство физических лиц и освобождение от долгов в Астрахани и Астраханской области. Юридическая консультация и сопровождение процедуры.')
    default_og_image = models.ImageField('Изображение для соцсетей', upload_to='seo/', blank=True)
    google_verification = models.CharField('Код подтверждения Google Search Console', max_length=255, blank=True,
        help_text='Только значение content из метатега, без HTML.')
    yandex_verification = models.CharField('Код подтверждения Яндекс Вебмастера', max_length=255, blank=True)
    organization_name = models.CharField('Название организации', max_length=200, blank=True)
    address = models.CharField('Полный адрес офиса', max_length=300, blank=True)
    phone = models.CharField('Телефон организации', max_length=50, blank=True)
    area_served = models.CharField('Регион обслуживания', max_length=200,
        default='Астрахань и Астраханская область')

    class Meta:
        verbose_name = 'Общие настройки SEO'
        verbose_name_plural = 'Общие настройки SEO'

    def clean(self):
        if SEOConfiguration.objects.exclude(pk=self.pk).exists():
            raise ValidationError('Общие настройки SEO уже созданы.')
        if self.indexnow_enabled and not re.fullmatch(r'[A-Za-z0-9-]{8,128}', settings.INDEXNOW_KEY):
            raise ValidationError({'indexnow_enabled': 'Сначала задайте INDEXNOW_KEY в окружении сервера (8–128 букв, цифр или дефисов).'})

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def __str__(self):
        return 'SEO основного сайта'
