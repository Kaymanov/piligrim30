from django.db import models
from django.utils.translation import gettext_lazy as _
from core.common.models import TimestampMixin

class Redirect(TimestampMixin):
    old_path = models.CharField(max_length=255, db_index=True, verbose_name=_("Старый путь"))
    new_path = models.CharField(max_length=255, verbose_name=_("Новый путь"))
    
    class StatusCode(models.IntegerChoices):
        MOVED_PERMANENTLY = 301, _('301 - Перемещено навсегда')
        FOUND = 302, _('302 - Временно перемещено')

    status_code = models.IntegerField(choices=StatusCode.choices, default=StatusCode.MOVED_PERMANENTLY, verbose_name=_("Код ответа"))
    is_active = models.BooleanField(default=True, verbose_name=_("Активен"))

    class Meta:
        verbose_name = _("Редирект")
        verbose_name_plural = _("Редиректы")
        unique_together = ('old_path', 'is_active')

    def __str__(self):
        return f"{self.old_path} -> {self.new_path} ({self.status_code})"
