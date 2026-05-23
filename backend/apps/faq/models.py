from django.db import models
from django.utils.translation import gettext_lazy as _
from core.common.models import TimestampMixin
from django_ckeditor_5.fields import CKEditor5Field

class FAQ(TimestampMixin):
    question = models.CharField(max_length=255, verbose_name=_("Вопрос"))
    answer = CKEditor5Field(verbose_name=_("Ответ"), config_name='default')
    
    # Simple choice category for now, can be foreign key if needed later
    category = models.CharField(max_length=100, blank=True, verbose_name=_("Категория"))
    
    # References stored as strings to avoid circular import issues
    related_service = models.ForeignKey('services.Service', on_delete=models.SET_NULL, null=True, blank=True, related_name='faq_entries', verbose_name=_("Связанная услуга"))
    related_article = models.ForeignKey('blog.BlogPost', on_delete=models.SET_NULL, null=True, blank=True, related_name='faq_entries', verbose_name=_("Связанная статья"))
    
    sort_order = models.PositiveIntegerField(default=0, verbose_name=_("Порядок сортировки"))
    is_published = models.BooleanField(default=True, verbose_name=_("Опубликовано"))

    class Meta:
        verbose_name = _("FAQ")
        verbose_name_plural = _("FAQ")
        ordering = ['sort_order', '-created_at']

    def __str__(self):
        return self.question
