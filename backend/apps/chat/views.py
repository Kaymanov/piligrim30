import logging

from rest_framework.response import Response
from rest_framework.views import APIView

from .fallback import OFF_TOPIC_RESPONSE, get_fallback_response
from .prompts import LEGAL_DISCLAIMER
from .serializers import ChatMessageSerializer
from .services import AIChatService, AIServiceUnavailableError, is_on_topic
from .throttling import ChatRateThrottle

logger = logging.getLogger(__name__)

# Maximum number of message pairs to keep in history
MAX_HISTORY_PAIRS = 20


class ChatView(APIView):
    """
    ИИ-Юрист endpoint.

    POST /api/v1/chat/
    Body: {"message": "...", "quiz_context": {...}}
    Response: {"reply": "...", "disclaimer": "...", "is_fallback": bool}
    """
    throttle_classes = [ChatRateThrottle]

    def post(self, request):
        serializer = ChatMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        message = serializer.validated_data['message']
        quiz_context = serializer.validated_data.get('quiz_context')

        # Ensure session exists
        if not request.session.session_key:
            request.session.create()

        # Get chat history from session
        history = request.session.get('chat_history', [])

        # Check off-topic (only for first message without context)
        if not is_on_topic(message) and len(history) == 0:
            reply = OFF_TOPIC_RESPONSE
            is_fallback = True
        else:
            # Try Polza.ai API
            service = AIChatService()
            try:
                if service.is_available():
                    reply = service.generate_response(message, history, quiz_context)
                    is_fallback = False
                else:
                    raise AIServiceUnavailableError("Service not configured")
            except AIServiceUnavailableError as e:
                logger.warning(f"AI service unavailable, using fallback: {e}")
                reply = get_fallback_response(message)
                is_fallback = True

        # Update history (keep max MAX_HISTORY_PAIRS pairs = MAX_HISTORY_PAIRS*2 messages)
        history.append({'role': 'user', 'content': message})
        history.append({'role': 'assistant', 'content': reply})
        max_messages = MAX_HISTORY_PAIRS * 2
        if len(history) > max_messages:
            history = history[-max_messages:]
        request.session['chat_history'] = history

        return Response({
            'reply': reply,
            'disclaimer': LEGAL_DISCLAIMER,
            'is_fallback': is_fallback,
        })


class ChatResetView(APIView):
    """
    Сброс истории чата.

    POST /api/v1/chat/reset/
    """

    def post(self, request):
        request.session.pop('chat_history', None)
        return Response({'status': 'ok'})
