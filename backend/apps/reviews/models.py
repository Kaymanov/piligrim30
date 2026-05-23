from django.db import models
from django.utils.translation import gettext_lazy as _
from core.common.models import TimestampMixin

class Review(TimestampMixin):
    author_name = models.CharField(max_length=150, verbose_name=_("Имя автора"))
    rating = models.PositiveSmallIntegerField(default=5, verbose_name=_("Оценка (1-5)"))
    text = models.TextField(verbose_name=_("Текст отзыва"))
    
    source = models.CharField(max_length=100, blank=True, verbose_name=_("Источник (Яндекс, 2GIS, Zoon)"))
    source_url = models.URLField(blank=True, verbose_name=_("Ссылка на источник"))
    
    # Store service as string for lazy loading
    service = models.ForeignKey('services.Service', on_delete=models.SET_NULL, null=True, blank=True, related_name='reviews', verbose_name=_("Услуга"))
    
    is_published = models.BooleanField(default=False, verbose_name=_("Опубликовано"))

    class Meta:
        verbose_name = _("Отзыв")
        verbose_name_plural = _("Отзывы")
        ordering = ['-created_at']

    def __str__(self):
        return f"Отзыв от {self.author_name} ({self.rating}/5)"
