from django.db import models
from django.utils.translation import gettext_lazy as _
from core.common.models import TimestampMixin, PublishableMixin
from apps.seo.models import SEOMixin
from django_ckeditor_5.fields import CKEditor5Field

class Case(SEOMixin, TimestampMixin, PublishableMixin):
    title = models.CharField(max_length=200, verbose_name=_("Заголовок"))
    slug = models.SlugField(max_length=200, unique=True, verbose_name=_("Slug"))
    
    debt_amount = models.CharField(max_length=100, blank=True, verbose_name=_("Сумма долга"))
    case_duration = models.CharField(max_length=100, blank=True, verbose_name=_("Срок процедуры"))
    client_problem = CKEditor5Field(blank=True, verbose_name=_("Ситуация клиента"), config_name='default')
    what_was_done = CKEditor5Field(blank=True, verbose_name=_("Что было сделано"), config_name='default')
    result = CKEditor5Field(blank=True, verbose_name=_("Результат"), config_name='default')
    lawyer_comment = CKEditor5Field(blank=True, verbose_name=_("Комментарий юриста"), config_name='default')
    disclaimer = models.TextField(blank=True, verbose_name=_("Дисклеймер"))
    cover_image = models.ImageField(upload_to="cases/covers/", blank=True, null=True, verbose_name=_("Обложка"))

    class Meta:
        verbose_name = _("Кейс")
        verbose_name_plural = _("Кейсы")

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        from core.common.utils import optimize_image_to_webp
        if self.cover_image:
            self.cover_image = optimize_image_to_webp(self.cover_image)
        if hasattr(self, 'og_image') and self.og_image:
            self.og_image = optimize_image_to_webp(self.og_image)
        super().save(*args, **kwargs)
