from rest_framework import serializers


class ChatMessageSerializer(serializers.Serializer):
    """Входящее сообщение для ИИ-Юриста."""
    message = serializers.CharField(max_length=2000, min_length=1)
    quiz_context = serializers.DictField(
        required=False, allow_null=True, default=None
    )


class ChatResponseSerializer(serializers.Serializer):
    """Ответ ИИ-Юриста."""
    reply = serializers.CharField()
    disclaimer = serializers.CharField()
    is_fallback = serializers.BooleanField()
