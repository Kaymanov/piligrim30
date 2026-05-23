import re
import time
import logging

from django.core.cache import cache
from rest_framework import serializers

from .models import Lead
from .services import normalize_phone

logger = logging.getLogger(__name__)

# Minimum time (ms) between form load and submission
MIN_SUBMISSION_TIME_MS = 3000

# Deduplication window in seconds
DEDUP_WINDOW_SECONDS = 300  # 5 minutes

# Phone regex: international format, 7-20 digits with optional +, spaces, dashes, parens
PHONE_REGEX = re.compile(r'^\+?[\d\s\-\(\)]{7,20}$')


class LeadSerializer(serializers.ModelSerializer):
    # Honeypot field — bots fill this, humans don't see it
    website = serializers.CharField(
        write_only=True, required=False, allow_blank=True, default=''
    )
    # Timestamp trap — form load time in unix ms
    _ts = serializers.IntegerField(
        write_only=True, required=False, allow_null=True, default=None
    )
    # Behavioral trap — hashed interaction digest (any non-empty = human)
    _hid = serializers.CharField(
        write_only=True, required=False, allow_blank=True, default=''
    )

    class Meta:
        model = Lead
        fields = '__all__'
        read_only_fields = ('ip_address', 'user_agent', 'status', 'created_at')

    def validate_website(self, value):
        """Honeypot: if filled, it's a bot."""
        if value:
            raise serializers.ValidationError("Ошибка отправки формы.")
        return value

    def validate_phone(self, value):
        """Phone is required and must match format."""
        if not value or not value.strip():
            raise serializers.ValidationError("Телефон обязателен для заполнения.")
        if not PHONE_REGEX.match(value.strip()):
            raise serializers.ValidationError(
                "Введите корректный номер телефона (7-20 цифр)."
            )
        return value.strip()

    def validate_consent_accepted(self, value):
        """Consent must be True."""
        if not value:
            raise serializers.ValidationError(
                "Необходимо согласие на обработку персональных данных."
            )
        return value

    def validate_name(self, value):
        """Name must be at least 2 chars if provided."""
        if value and len(value.strip()) < 2:
            raise serializers.ValidationError("Имя должно содержать минимум 2 символа.")
        return value.strip() if value else value

    def validate(self, attrs):
        """
        Cross-field validation:
        - Timestamp trap
        - Behavioral trap
        - Deduplication
        """
        ts = attrs.pop('_ts', None)
        hid = attrs.pop('_hid', '')
        attrs.pop('website', None)  # Remove honeypot from data

        # Only apply timestamp/behavioral checks if frontend sends _ts
        # (graceful degradation for direct API usage)
        if ts is not None:
            # Timestamp trap: form submitted too fast
            now_ms = int(time.time() * 1000)
            elapsed = now_ms - ts
            if elapsed < MIN_SUBMISSION_TIME_MS:
                raise serializers.ValidationError(
                    {"_ts": "Ошибка отправки формы. Попробуйте ещё раз."}
                )

            # Behavioral trap: no JS interaction detected
            if not hid:
                raise serializers.ValidationError(
                    {"_hid": "Ошибка отправки формы. Попробуйте ещё раз."}
                )

        # Deduplication by phone (Redis-based, 5 min window)
        phone = attrs.get('phone', '')
        if phone:
            normalized = normalize_phone(phone)
            dedup_key = f"lead_dedup:{normalized}"
            try:
                if cache.get(dedup_key):
                    raise serializers.ValidationError(
                        {"phone": "Заявка уже отправлена. Попробуйте позже."}
                    )
            except Exception as e:
                # Redis unavailable — skip dedup gracefully
                logger.warning(f"Redis dedup check failed: {e}")

        return attrs

    def create(self, validated_data):
        """Create lead, set dedup key, capture IP/UA from request."""
        request = self.context.get('request')
        if request:
            validated_data['ip_address'] = self._get_client_ip(request)
            validated_data['user_agent'] = request.META.get('HTTP_USER_AGENT', '')

        lead = super().create(validated_data)

        # Set dedup key after successful creation
        phone = validated_data.get('phone', '')
        if phone:
            normalized = normalize_phone(phone)
            dedup_key = f"lead_dedup:{normalized}"
            try:
                cache.set(dedup_key, True, timeout=DEDUP_WINDOW_SECONDS)
            except Exception as e:
                logger.warning(f"Redis dedup set failed: {e}")

        return lead

    def _get_client_ip(self, request):
        """Extract real client IP considering proxies."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR')
