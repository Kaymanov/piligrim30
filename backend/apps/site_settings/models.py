from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError

class SiteSettings(models.Model):
    site_name = models.CharField(max_length=150, default="Правовой Пилигрим", verbose_name=_("Название сайта"))
    phone = models.CharField(max_length=50, blank=True, verbose_name=_("Телефон"))
    email = models.EmailField(blank=True, verbose_name=_("Email"))
    address = models.TextField(blank=True, verbose_name=_("Адрес"))
    working_hours = models.TextField(blank=True, verbose_name=_("Режим работы"))
    company_details = models.TextField(blank=True, verbose_name=_("Реквизиты компании"))
    
    telegram = models.URLField(blank=True, verbose_name=_("Telegram"))
    whatsapp = models.URLField(blank=True, verbose_name=_("WhatsApp"))
    
    yandex_metrika_id = models.CharField(max_length=50, blank=True, verbose_name=_("ID Яндекс Метрики"))
    google_analytics_id = models.CharField(max_length=50, blank=True, verbose_name=_("ID Google Analytics"))

    class Meta:
        verbose_name = _("Настройки сайта")
        verbose_name_plural = _("Настройки сайта")

    def save(self, *args, **kwargs):
        if not self.pk and SiteSettings.objects.exists():
            raise ValidationError('Может быть только одна запись с настройками сайта')
        return super().save(*args, **kwargs)

    def __str__(self):
        return self.site_name
