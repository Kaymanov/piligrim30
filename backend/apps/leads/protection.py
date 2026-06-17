"""
Bot protection utilities for lead form submissions.

Uses a score-based system: each suspicious signal adds points.
Low score  (0-2) → accept, send notification.
Mid score  (3-4) → accept, mark as potential spam, no notification.
High score (5+)  → reject immediately with generic error.

Additionally tracks IP-based rate violations and applies progressive bans.
"""
import logging
import time

from django.core.cache import cache

logger = logging.getLogger(__name__)

# ── Score thresholds ───────────────────────────────────────────────────────────
SCORE_REJECT = 5        # Immediate rejection
SCORE_SPAM_MARK = 3     # Accept but mark as spam, skip notification

# ── Progressive IP ban ─────────────────────────────────────────────────────────
IP_BAN_VIOLATIONS_KEY = "bot_violations:{ip}"  # How many rate violations
IP_BAN_KEY = "bot_ban:{ip}"                     # Is this IP banned?
IP_BAN_SHORT_SECONDS = 60 * 60       # 1 hour after first offence
IP_BAN_LONG_SECONDS = 60 * 60 * 24  # 24 hours after repeated offences


def calculate_bot_score(
    ts: int | None,
    hid: str,
    website: str,
    phone: str,
    name: str | None,
    user_agent: str,
    ip: str,
) -> dict:
    """
    Calculate a bot-suspicion score for a form submission.

    Returns a dict with:
      - score: int
      - flags: list of triggered checks (for logging)
      - is_banned: bool (IP is banned outright)
    """
    score = 0
    flags = []

    # ── IP ban check ──────────────────────────────────────────────────────────
    try:
        ban_ttl = cache.ttl(IP_BAN_KEY.format(ip=ip))
        if ban_ttl and ban_ttl > 0:
            return {"score": 99, "flags": ["ip_banned"], "is_banned": True}
    except Exception:
        pass

    # ── Honeypot filled ───────────────────────────────────────────────────────
    if website:
        score += 10  # Definitive bot signal
        flags.append("honeypot_filled")

    # ── Timestamp missing / too fast ──────────────────────────────────────────
    if ts is None:
        # No timestamp at all — direct API call, not via browser
        score += 2
        flags.append("no_timestamp")
    else:
        elapsed_ms = int(time.time() * 1000) - ts
        if elapsed_ms < 1500:
            # Submitted in under 1.5 seconds — impossible for a human
            score += 3
            flags.append(f"too_fast:{elapsed_ms}ms")
        elif elapsed_ms < 3000:
            score += 1
            flags.append(f"fast:{elapsed_ms}ms")
        elif elapsed_ms > 60 * 60 * 1000:
            # Timestamp older than 1 hour — replayed or stale request
            score += 2
            flags.append("stale_timestamp")

    # ── No behavioral signal ──────────────────────────────────────────────────
    if not hid:
        score += 2
        flags.append("no_interaction")

    # ── Suspicious user agent ─────────────────────────────────────────────────
    ua = (user_agent or "").lower()
    bot_ua_keywords = [
        "python-requests", "urllib", "curl", "scrapy", "httpx",
        "aiohttp", "go-http", "java/", "okhttp", "libwww",
        "bot", "crawler", "spider", "scraper",
    ]
    for kw in bot_ua_keywords:
        if kw in ua:
            score += 3
            flags.append(f"bot_ua:{kw}")
            break

    if not ua:
        score += 2
        flags.append("no_ua")

    # ── Phone number quality ──────────────────────────────────────────────────
    digits = "".join(c for c in (phone or "") if c.isdigit())
    if len(digits) < 7:
        score += 1
        flags.append("short_phone")
    # All same digit (e.g. 9999999999)
    if len(digits) >= 7 and len(set(digits)) == 1:
        score += 3
        flags.append("repeated_digits_phone")
    # Sequential digits (e.g. 1234567890)
    if len(digits) >= 7 and digits in "01234567890123456789":
        score += 2
        flags.append("sequential_phone")

    # ── Name suspicious ───────────────────────────────────────────────────────
    if name:
        name_stripped = name.strip()
        # All same character
        if len(name_stripped) > 2 and len(set(name_stripped.lower())) == 1:
            score += 2
            flags.append("repeated_chars_name")
        # Looks like random keyboard mashing
        if len(name_stripped) > 10 and not any(c in name_stripped for c in "аеёиоуыэюяАЕЁИОУЫЭЮЯaeiouyAEIOUY"):
            score += 1
            flags.append("no_vowels_name")

    logger.debug(f"Bot score for {ip}: {score} ({flags})")
    return {"score": score, "flags": flags, "is_banned": False}


def register_violation(ip: str) -> None:
    """
    Track a rate-limit violation for an IP and apply progressive banning.
    First offence → 1h ban.  Subsequent → 24h ban.
    """
    try:
        violations_key = IP_BAN_VIOLATIONS_KEY.format(ip=ip)
        violations = cache.get(violations_key, 0) + 1
        cache.set(violations_key, violations, timeout=60 * 60 * 24)

        if violations >= 3:
            ban_duration = IP_BAN_LONG_SECONDS
        else:
            ban_duration = IP_BAN_SHORT_SECONDS

        cache.set(IP_BAN_KEY.format(ip=ip), True, timeout=ban_duration)
        logger.warning(
            f"IP {ip} banned for {ban_duration}s (violation #{violations})"
        )
    except Exception as e:
        logger.warning(f"Failed to register violation for {ip}: {e}")


def is_ip_banned(ip: str) -> bool:
    """Quick check — used by middleware or throttle before deserialization."""
    try:
        return bool(cache.get(IP_BAN_KEY.format(ip=ip)))
    except Exception:
        return False
