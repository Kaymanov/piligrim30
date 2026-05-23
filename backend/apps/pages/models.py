from django.db import models
from django.utils.translation import gettext_lazy as _
from core.common.models import TimestampMixin, PublishableMixin
from apps.seo.models import SEOMixin
from django_ckeditor_5.fields import CKEditor5Field

class Page(SEOMixin, TimestampMixin, PublishableMixin):
    title = models.CharField(max_length=200, verbose_name=_("Заголовок"))
    slug = models.SlugField(max_length=200, unique=True, verbose_name=_("Slug"))
    h1 = models.CharField(max_length=200, blank=True, verbose_name=_("H1"))
    content = CKEditor5Field(blank=True, verbose_name=_("Контент"), config_name='default')

    class Meta:
        verbose_name = _("Страница")
        verbose_name_plural = _("Страницы")

    def __str__(self):
        return self.title
