from django.db import models
from django.utils.translation import gettext_lazy as _

class Lead(models.Model):
    class Status(models.TextChoices):
        NEW = 'new', _('Новый')
        IN_PROGRESS = 'in_progress', _('В работе')
        DONE = 'done', _('Завершен')
        SPAM = 'spam', _('Спам')

    class LeadType(models.TextChoices):
        DEFAULT = 'default', _('По умолчанию')
        QUIZ = 'quiz', _('Квиз')
        CALLBACK = 'callback', _('Обратный звонок')

    name = models.CharField(max_length=150, blank=True, verbose_name=_("Имя"))
    phone = models.CharField(max_length=50, blank=True, verbose_name=_("Телефон"))
    email = models.EmailField(blank=True, verbose_name=_("Email"))
    message = models.TextField(blank=True, verbose_name=_("Сообщение"))
    debt_amount = models.CharField(max_length=100, blank=True, verbose_name=_("Сумма долга"))
    
    source_page = models.URLField(blank=True, verbose_name=_("Страница отправки"))
    utm_source = models.CharField(max_length=200, blank=True, verbose_name="UTM Source")
    utm_medium = models.CharField(max_length=200, blank=True, verbose_name="UTM Medium")
    utm_campaign = models.CharField(max_length=200, blank=True, verbose_name="UTM Campaign")
    utm_content = models.CharField(max_length=200, blank=True, verbose_name="UTM Content")
    utm_term = models.CharField(max_length=200, blank=True, verbose_name="UTM Term")
    
    user_agent = models.TextField(blank=True, verbose_name="User Agent")
    ip_address = models.GenericIPAddressField(null=True, blank=True, verbose_name="IP Address")
    consent_accepted = models.BooleanField(default=True, verbose_name=_("Согласие на обработку ПД"))
    
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW, verbose_name=_("Статус"))
    lead_type = models.CharField(max_length=20, choices=LeadType.choices, default=LeadType.DEFAULT, verbose_name=_("Тип заявки"))
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Дата создания"))

    class Meta:
        verbose_name = _("Заявка")
        verbose_name_plural = _("Заявки")
        ordering = ['-created_at']

    def __str__(self):
        return f"Заявка от {self.name or self.phone} ({self.get_lead_type_display()})"
