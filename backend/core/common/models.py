from django.db import models
from django.utils.translation import gettext_lazy as _

class TimestampMixin(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Создано"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("Обновлено"))

    class Meta:
        abstract = True


class PublishableMixin(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'draft', _('Черновик')
        PUBLISHED = 'published', _('Опубликовано')
        ARCHIVED = 'archived', _('В архиве')

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
        verbose_name=_("Статус")
    )
    published_at = models.DateTimeField(
        null=True, 
        blank=True, 
        verbose_name=_("Дата публикации")
    )

    class Meta:
        abstract = True
