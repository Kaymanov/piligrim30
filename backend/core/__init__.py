# Make Celery app available as `from core import celery_app`
# This ensures tasks are registered when Django starts.
from .celery import app as celery_app

__all__ = ('celery_app',)
