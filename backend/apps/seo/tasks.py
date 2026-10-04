"""IndexNow reports changed URLs; acceptance never guarantees indexing."""
import json
import re
from urllib.request import Request, urlopen

from celery import shared_task
from django.conf import settings
from .models import SEOConfiguration

PRODUCTION_ORIGIN = 'https://piligrim30.ru'


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def notify_indexnow(self, paths):
    if settings.SITE_URL != PRODUCTION_ORIGIN:
        return 'disabled-environment'
    if not SEOConfiguration.objects.filter(indexnow_enabled=True, indexing_enabled=True).exists():
        return 'disabled-settings'
    if not re.fullmatch(r'[A-Za-z0-9-]{8,128}', settings.INDEXNOW_KEY):
        return 'missing-key'
    paths = sorted({path for path in paths if path.startswith('/') and not path.startswith('//')
                    and not any(char in path for char in ('?', '#', '\\', '\n', '\r'))})
    if not paths:
        return 'empty'
    payload = {
        'host': 'piligrim30.ru', 'key': settings.INDEXNOW_KEY,
        'keyLocation': PRODUCTION_ORIGIN + '/indexnow-key.txt',
        'urlList': [PRODUCTION_ORIGIN + path for path in paths],
    }
    request = Request('https://yandex.com/indexnow', data=json.dumps(payload).encode(),
                      headers={'Content-Type': 'application/json'}, method='POST')
    try:
        with urlopen(request, timeout=10) as response:
            return response.status
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))
