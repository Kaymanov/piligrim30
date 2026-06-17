"""
Celery tasks for the leads application.

Email notifications are dispatched asynchronously so form submissions
return immediately to the user rather than waiting for SMTP.
"""
import logging
from celery import shared_task

logger = logging.getLogger(__name__)


@shared_task(
    bind=True,
    max_retries=3,
    default_retry_delay=60,  # 60 seconds between retries
    acks_late=True,
)
def send_lead_notification_task(self, lead_id: int) -> None:
    """
    Send email notification for a new lead.

    Uses @shared_task so it works regardless of which Celery app is active.
    Retries up to 3 times with 60s delay on failure (e.g. SMTP timeout).
    """
    from .models import Lead
    from .services import send_lead_notification

    try:
        lead = Lead.objects.get(pk=lead_id)
        send_lead_notification(lead)
        logger.info(f"Email notification task completed for Lead ID: {lead_id}")
    except Lead.DoesNotExist:
        logger.error(f"Lead {lead_id} not found — notification skipped")
    except Exception as exc:
        logger.error(f"Email notification task failed for Lead ID: {lead_id}: {exc}")
        # Retry with exponential back-off: 60s, 120s, 240s
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))
