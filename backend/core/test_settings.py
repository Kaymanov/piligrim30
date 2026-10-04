"""Isolated test environment: no production DB, Redis, SMTP or AI calls."""
import os

from .settings import *  # noqa: F403

DATABASES = {'default': {'ENGINE': 'django.db.backends.sqlite3', 'NAME': ':memory:'}}
CACHES = {
    'default': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'},
    'security': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache', 'LOCATION': 'security-tests'},
}
EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'
CELERY_TASK_ALWAYS_EAGER = True
PASSWORD_HASHERS = ['django.contrib.auth.hashers.MD5PasswordHasher']
ALLOWED_HOSTS = ['testserver', 'localhost', '127.0.0.1']
TRUSTED_PROXY_CIDRS = []
MEDIA_ROOT = '/tmp/piligrim-seo-test-media'
SITE_URL = 'http://localhost:3000'
INDEXNOW_KEY = ''

# Optional isolated Redis for concurrency tests; never reuse a production cache.
if os.environ.get('PILIGRIM_TEST_REDIS_URL'):
    from urllib.parse import urlparse
    test_redis_url = os.environ['PILIGRIM_TEST_REDIS_URL']
    if urlparse(test_redis_url).hostname not in ('127.0.0.1', 'localhost'):
        raise ValueError('Test Redis must be a dedicated local instance')
    CACHES['security'] = {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': test_redis_url,
        'KEY_PREFIX': 'piligrim-tests',
    }
