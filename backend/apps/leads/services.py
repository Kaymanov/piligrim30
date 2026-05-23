import logging
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils import timezone

logger = logging.getLogger(__name__)


def send_lead_notification(lead):
    """
    Отправляет email-уведомление о новой заявке владельцу сайта.
    Не блокирует создание заявки при ошибке отправки.
    """
    recipient = getattr(settings, 'LEAD_NOTIFICATION_EMAIL', '')
    if not recipient:
        logger.warning("LEAD_NOTIFICATION_EMAIL not configured, skipping notification")
        return

    subject = f"Новая заявка с сайта Правовой Пилигрим ({lead.get_lead_type_display()})"

    # Build UTM info
    utm_parts = []
    if lead.utm_source:
        utm_parts.append(f"Source: {lead.utm_source}")
    if lead.utm_medium:
        utm_parts.append(f"Medium: {lead.utm_medium}")
    if lead.utm_campaign:
        utm_parts.append(f"Campaign: {lead.utm_campaign}")
    if lead.utm_content:
        utm_parts.append(f"Content: {lead.utm_content}")
    if lead.utm_term:
        utm_parts.append(f"Term: {lead.utm_term}")
    utm_info = "\n".join(utm_parts) if utm_parts else "—"

    body = f"""Новая заявка с сайта Правовой Пилигрим

Тип заявки: {lead.get_lead_type_display()}
Дата: {lead.created_at.strftime('%d.%m.%Y %H:%M') if lead.created_at else timezone.now().strftime('%d.%m.%Y %H:%M')}

--- Контактная информация ---
Имя: {lead.name or '—'}
Телефон: {lead.phone or '—'}
Email: {lead.email or '—'}

--- Детали ---
Сообщение: {lead.message or '—'}
Сумма долга: {lead.debt_amount or '—'}

--- Аналитика ---
Страница: {lead.source_page or '—'}
UTM-метки:
{utm_info}

--- Системная информация ---
IP: {lead.ip_address or '—'}
User-Agent: {lead.user_agent[:100] if lead.user_agent else '—'}
"""

    try:
        send_mail(
            subject=subject,
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient],
            fail_silently=False,
        )
        logger.info(f"Lead notification sent for Lead ID: {lead.pk}")
    except Exception as e:
        logger.error(f"Failed to send lead notification for Lead ID: {lead.pk}: {e}")


def normalize_phone(phone: str) -> str:
    """Нормализует телефон для дедупликации: убирает всё кроме цифр и +."""
    import re
    return re.sub(r'[^\d+]', '', phone)
