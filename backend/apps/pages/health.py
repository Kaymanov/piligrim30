"""
Health check endpoint for monitoring (Uptime Robot, etc.)

GET /api/v1/health/
Returns 200 JSON with component statuses if all healthy,
or 503 if any critical component is down.
"""
import time

from django.db import connection, OperationalError as DBError
from django.core.cache import cache
from django.core.cache import CacheKeyWarning
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(["GET", "HEAD"])
@permission_classes([AllowAny])
def health_check(request):
    """
    Lightweight health check.
    - DB: simple SELECT 1
    - Cache/Redis: ping via cache.set/get
    """
    checks = {}
    all_ok = True

    # ── Database ──────────────────────────────────────────────────────────────
    try:
        t0 = time.monotonic()
        with connection.cursor() as cur:
            cur.execute("SELECT 1")
        checks["db"] = {"status": "ok", "latency_ms": round((time.monotonic() - t0) * 1000)}
    except DBError as e:
        checks["db"] = {"status": "error", "detail": str(e)}
        all_ok = False

    # ── Cache / Redis ─────────────────────────────────────────────────────────
    try:
        t0 = time.monotonic()
        _key = "_health_ping"
        cache.set(_key, "pong", timeout=5)
        val = cache.get(_key)
        if val != "pong":
            raise ValueError("Cache round-trip failed")
        checks["cache"] = {"status": "ok", "latency_ms": round((time.monotonic() - t0) * 1000)}
    except Exception as e:
        checks["cache"] = {"status": "error", "detail": str(e)}
        all_ok = False

    status_code = 200 if all_ok else 503
    return Response(
        {
            "status": "ok" if all_ok else "degraded",
            "checks": checks,
        },
        status=status_code,
    )
