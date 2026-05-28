from django.db import models
from django.utils.translation import gettext_lazy as _


class ChatLog(models.Model):
    """Логирование диалогов ИИ-Юриста для анализа качества."""

    session_key = models.CharField(max_length=100, db_index=True, verbose_name=_("Session Key"))
    user_message = models.TextField(verbose_name=_("Сообщение пользователя"))
    ai_response = models.TextField(verbose_name=_("Ответ ИИ"))
    is_fallback = models.BooleanField(default=False, verbose_name=_("Fallback ответ"))
    quiz_context = models.JSONField(null=True, blank=True, verbose_name=_("Контекст квиза"))
    ip_address = models.GenericIPAddressField(null=True, blank=True, verbose_name="IP")
    response_time_ms = models.PositiveIntegerField(null=True, blank=True, verbose_name=_("Время ответа (мс)"))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Дата"))

    class Meta:
        verbose_name = _("Лог чата")
        verbose_name_plural = _("Логи чата")
        ordering = ["-created_at"]

    def __str__(self):
        return f"[{self.created_at:%d.%m %H:%M}] {self.user_message[:50]}"
