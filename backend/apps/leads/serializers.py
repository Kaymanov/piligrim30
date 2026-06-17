import re
import logging

from rest_framework import serializers

from .models import Lead
from .protection import SCORE_REJECT, SCORE_SPAM_MARK, calculate_bot_score
from .services import normalize_phone

logger = logging.getLogger(__name__)

# Phone regex: international format, 7-20 digits with optional +, spaces, dashes, parens
PHONE_REGEX = re.compile(r'^\+?[\d\s\-\(\)]{7,20}$')

# Russian mobile: +7/8 followed by 10 digits (loose check)
RU_PHONE_REGEX = re.compile(r'^(\+?7|8)[\d\s\-\(\)]{9,15}$')


class LeadSerializer(serializers.ModelSerializer):
    # Honeypot field — bots fill this, humans don't see it
    website = serializers.CharField(
        write_only=True, required=False, allow_blank=True, default=''
    )
    # Timestamp trap — form load time in unix ms
    _ts = serializers.IntegerField(
        write_only=True, required=False, allow_null=True, default=None
    )
    # Behavioral trap — any non-empty value means JS interaction happened
    _hid = serializers.CharField(
        write_only=True, required=False, allow_blank=True, default=''
    )

    class Meta:
        model = Lead
        fields = '__all__'
        read_only_fields = ('ip_address', 'user_agent', 'status', 'created_at')

    def validate_phone(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Телефон обязателен для заполнения.")
        v = value.strip()
        if not PHONE_REGEX.match(v):
            raise serializers.ValidationError(
                "Введите корректный номер телефона (7-20 цифр)."
            )
        # Soft check: must look like a real Russian number
        digits = re.sub(r'\D', '', v)
        if len(digits) < 7:
            raise serializers.ValidationError("Слишком короткий номер телефона.")
        return v

    def validate_consent_accepted(self, value):
        if not value:
            raise serializers.ValidationError(
                "Необходимо согласие на обработку персональных данных."
            )
        return value

    def validate_name(self, value):
        if value and len(value.strip()) < 2:
            raise serializers.ValidationError("Имя должно содержать минимум 2 символа.")
        return value.strip() if value else value

    def validate(self, attrs):
        ts = attrs.pop('_ts', None)
        hid = attrs.pop('_hid', '')
        website = attrs.pop('website', '')

        request = self.context.get('request')
        ip = self._get_client_ip(request) if request else "unknown"
        ua = request.META.get('HTTP_USER_AGENT', '') if request else ''

        # ── Score-based bot detection ─────────────────────────────────────────
        result = calculate_bot_score(
            ts=ts,
            hid=hid,
            website=website,
            phone=attrs.get('phone', ''),
            name=attrs.get('name'),
            user_agent=ua,
            ip=ip,
        )
        score = result['score']
        flags = result['flags']

        if result['is_banned']:
            # Don't reveal the real reason to avoid adaptation
            raise serializers.ValidationError(
                {"non_field_errors": "Ошибка отправки формы. Попробуйте позже."}
            )

        if score >= SCORE_REJECT:
            logger.warning(
                f"Lead rejected. IP={ip} score={score} flags={flags}"
            )
            raise serializers.ValidationError(
                {"non_field_errors": "Ошибка отправки формы. Попробуйте ещё раз."}
            )

        if score >= SCORE_SPAM_MARK:
            # Accept but mark as spam — no email notification will be sent
            logger.info(
                f"Lead flagged as spam. IP={ip} score={score} flags={flags}"
            )
            attrs['status'] = Lead.Status.SPAM

        # ── Deduplication by phone (Redis) ────────────────────────────────────
        from django.core.cache import cache
        phone = attrs.get('phone', '')
        if phone:
            normalized = normalize_phone(phone)
            dedup_key = f"lead_dedup:{normalized}"
            try:
                if cache.get(dedup_key):
                    raise serializers.ValidationError(
                        {"phone": "Заявка уже отправлена. Попробуйте позже."}
                    )
            except serializers.ValidationError:
                raise
            except Exception as e:
                logger.warning(f"Redis dedup check failed: {e}")

        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        if request:
            validated_data['ip_address'] = self._get_client_ip(request)
            validated_data['user_agent'] = request.META.get('HTTP_USER_AGENT', '')

        lead = super().create(validated_data)

        # Set dedup key after successful creation
        phone = validated_data.get('phone', '')
        if phone:
            from django.core.cache import cache
            normalized = normalize_phone(phone)
            dedup_key = f"lead_dedup:{normalized}"
            try:
                cache.set(dedup_key, True, timeout=300)
            except Exception as e:
                logger.warning(f"Redis dedup set failed: {e}")

        return lead

    def _get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR', '')
