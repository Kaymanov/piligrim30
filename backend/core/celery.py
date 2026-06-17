"""
Celery application instance for Правовой Пилигрим backend.

Workers are started via:
    celery -A core worker -l info

In Docker this is a separate container defined in docker-compose.yml.
"""
import os
from celery import Celery

# Tell Django which settings module to use
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

app = Celery('piligrim')

# Load config from Django settings (CELERY_* keys)
app.config_from_object('django.conf:settings', namespace='CELERY')

# Autodiscover tasks from installed apps (apps/*/tasks.py)
app.autodiscover_tasks()
