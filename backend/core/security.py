"""Shared abuse controls. Production requires Redis; storage errors deny writes."""
import ipaddress
import logging
import time

from django.conf import settings
from django.core.cache import caches
from django.utils.crypto import salted_hmac
from rest_framework.exceptions import APIException, Throttled

logger = logging.getLogger(__name__)


class ProtectionUnavailable(APIException):
    status_code = 503
    default_detail = 'Отправка временно недоступна. Попробуйте позже.'


def security_cache():
    return caches['security']


def private_key(scope, value):
    return f'{scope}:{salted_hmac("abuse-control", str(value), algorithm="sha256").hexdigest()}'


def _address(value):
    address = ipaddress.ip_address(value.strip())
    if address.version == 6 and address.ipv4_mapped:
        return address.ipv4_mapped
    return address


def client_ip(request):
    """Trust forwarded addresses only through explicitly configured proxies."""
    try:
        peer = _address(request.META.get('REMOTE_ADDR', ''))
    except ValueError:
        return '0.0.0.0'
    trusted = [ipaddress.ip_network(cidr) for cidr in settings.TRUSTED_PROXY_CIDRS]

    def is_trusted(address):
        return any(address in network for network in trusted)

    if not is_trusted(peer):
        return str(peer)
    forwarded = request.META.get('HTTP_X_FORWARDED_FOR', '')
    if not forwarded or len(forwarded) > 1024:
        return str(peer)
    try:
        chain = [_address(part) for part in forwarded.split(',')]
    except ValueError:
        return str(peer)
    for address in reversed(chain):
        if not is_trusted(peer):
            break
        peer = address
    return str(peer)


def client_bucket(request):
    address = _address(client_ip(request))
    # One IPv6 /64 is usually one subscriber; rotating suffixes must not reset limits.
    return str(ipaddress.ip_network(f'{address}/64', strict=False)) if address.version == 6 else str(address)


def enforce_limit(scope, identity, limit, seconds):
    """Atomic fixed window counter, shared across workers and endpoint variants.

    At a window boundary up to twice the allowance can arrive close together.
    Nginx supplies the complementary continuous burst limit.
    """
    now = time.time()
    key = private_key(scope, f'{identity}:{int(now // seconds)}')
    try:
        cache = security_cache()
        if cache.add(key, 1, timeout=seconds + 1):
            count = 1
        else:
            count = cache.incr(key)
    except Exception:
        logger.error('Abuse control storage unavailable (%s)', scope)
        raise ProtectionUnavailable() from None
    if count > limit:
        raise Throttled(wait=max(1, int(seconds - now % seconds)))


def reserve_phone(phone):
    try:
        reserved = security_cache().add(private_key('lead-phone', phone), True, timeout=300)
    except Exception:
        raise ProtectionUnavailable() from None
    if not reserved:
        raise Throttled(wait=300, detail='Заявка уже отправлена. Попробуйте позже.')


def acquire_chat_slot(request):
    """Bound concurrent AI work across processes, including streaming responses."""
    held = []

    def release():
        while held:
            lock = held.pop()
            try:
                lock.release()
            except Exception:
                # Leases also expire if a worker crashes or a client disconnects.
                logger.warning('Could not release chat lease')

    try:
        cache = security_cache()
        lock = cache.lock(private_key('chat-active', client_bucket(request)), timeout=90, blocking=False, thread_local=False)
        if not lock.acquire():
            raise Throttled(wait=15)
        held.append(lock)
        for slot in range(settings.CHAT_MAX_CONCURRENT):
            lock = cache.lock(f'chat-slot:{slot}', timeout=90, blocking=False, thread_local=False)
            if lock.acquire():
                held.append(lock)
                return release
        raise Throttled(wait=15)
    except Throttled:
        release()
        raise
    except Exception:
        release()
        raise ProtectionUnavailable() from None


class GuardedStream:
    """Release leases even if a response closes before the first iteration."""
    def __init__(self, stream, release):
        self.stream = iter(stream)
        self.release = release

    def __iter__(self):
        try:
            yield from self.stream
        finally:
            self.close()

    def close(self):
        try:
            close = getattr(self.stream, 'close', None)
            if close:
                close()
        finally:
            self.release()
