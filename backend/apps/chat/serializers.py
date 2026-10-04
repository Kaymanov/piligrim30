from rest_framework import serializers


class ChatMessageSerializer(serializers.Serializer):
    """Входящее сообщение для ИИ-Юриста."""
    message = serializers.CharField(max_length=2000, min_length=1)
    quiz_context = serializers.DictField(
        required=False, allow_null=True, default=None,
        child=serializers.CharField(max_length=200)
    )

    def validate_quiz_context(self, value):
        allowed = {'debt_amount', 'has_overdue', 'has_enforcement', 'has_property', 'has_mortgage', 'income_type'}
        if value is not None and not set(value).issubset(allowed):
            raise serializers.ValidationError('Неизвестные поля контекста.')
        return value


class ChatResponseSerializer(serializers.Serializer):
    """Ответ ИИ-Юриста."""
    reply = serializers.CharField()
    disclaimer = serializers.CharField()
    is_fallback = serializers.BooleanField()
