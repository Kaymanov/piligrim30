import logging
import time

from django.http import StreamingHttpResponse
from rest_framework.response import Response
from rest_framework.views import APIView

from .fallback import OFF_TOPIC_RESPONSE, get_fallback_response
from .models import ChatLog
from .prompts import LEGAL_DISCLAIMER, LEAD_CTA_MESSAGE, CTA_AFTER_MESSAGES
from .rag import get_relevant_context
from .serializers import ChatMessageSerializer
from .services import AIChatService, AIServiceUnavailableError, is_on_topic
from .throttling import ChatRateThrottle

logger = logging.getLogger(__name__)

MAX_HISTORY_PAIRS = 10  # Keep last 10 exchanges (20 messages) per session

# Session TTL for chat history: 2 hours of inactivity clears history
CHAT_SESSION_TTL = 60 * 60 * 2


class ChatView(APIView):
    """
    ИИ-Юрист endpoint.

    POST /api/v1/chat/
    Body: {"message": "...", "quiz_context": {...}}
    Response: {"reply": "...", "disclaimer": "...", "is_fallback": bool, "show_cta": bool}
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
        message_count = request.session.get('chat_message_count', 0)

        start_time = time.time()

        # Check off-topic (only for first message without context)
        if not is_on_topic(message) and len(history) == 0:
            reply = OFF_TOPIC_RESPONSE
            is_fallback = True
        else:
            # RAG: get relevant context from FAQ/blog
            rag_context = get_relevant_context(message)

            # Try AI service
            service = AIChatService()
            try:
                if service.is_available():
                    reply = service.generate_response(
                        message, history, quiz_context, rag_context
                    )
                    is_fallback = False
                else:
                    raise AIServiceUnavailableError("Service not configured")
            except AIServiceUnavailableError as e:
                logger.warning(f"AI service unavailable, using fallback: {e}")
                reply = get_fallback_response(message)
                is_fallback = True

        # Calculate response time
        response_time_ms = int((time.time() - start_time) * 1000)

        # Increment message count
        message_count += 1
        request.session['chat_message_count'] = message_count

        # Determine if CTA should be shown
        show_cta = message_count >= CTA_AFTER_MESSAGES and message_count % CTA_AFTER_MESSAGES == 0

        # Append CTA to reply if needed (server-side, for non-JS clients)
        reply_with_cta = reply
        if show_cta:
            reply_with_cta = reply + LEAD_CTA_MESSAGE

        # Update history
        history.append({'role': 'user', 'content': message})
        history.append({'role': 'assistant', 'content': reply})
        max_messages = MAX_HISTORY_PAIRS * 2
        if len(history) > max_messages:
            history = history[-max_messages:]
        request.session['chat_history'] = history

        # Log the conversation
        try:
            ChatLog.objects.create(
                session_key=request.session.session_key or "unknown",
                user_message=message,
                ai_response=reply,
                is_fallback=is_fallback,
                quiz_context=quiz_context,
                ip_address=self._get_client_ip(request),
                response_time_ms=response_time_ms,
            )
        except Exception as e:
            logger.error(f"Failed to log chat: {e}")

        return Response({
            'reply': reply_with_cta,
            'disclaimer': LEGAL_DISCLAIMER,
            'is_fallback': is_fallback,
            'show_cta': show_cta,
        })

    def _get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR')


class ChatStreamView(APIView):
    """
    SSE streaming endpoint for AI Lawyer.

    POST /api/v1/chat/stream/
    Returns: text/event-stream with chunks
    """
    throttle_classes = [ChatRateThrottle]

    def post(self, request):
        serializer = ChatMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        message = serializer.validated_data['message']
        quiz_context = serializer.validated_data.get('quiz_context')

        if not request.session.session_key:
            request.session.create()

        history = request.session.get('chat_history', [])
        # Snapshot history before streaming — avoids race condition
        history_snapshot = list(history)

        # Check off-topic
        if not is_on_topic(message) and len(history_snapshot) == 0:
            return self._stream_text(OFF_TOPIC_RESPONSE)

        # RAG context
        rag_context = get_relevant_context(message)

        service = AIChatService()
        if not service.is_available():
            return self._stream_text(get_fallback_response(message))

        try:
            stream = service.generate_response_stream(
                message, history_snapshot, quiz_context, rag_context
            )

            def event_stream():
                full_reply = ""
                for chunk in stream:
                    full_reply += chunk
                    # Encode chunk as base64 to avoid SSE format issues with newlines
                    import json
                    yield f"data: {json.dumps(chunk)}\n\n"

                # Save to history after streaming completes
                new_history = list(history_snapshot)
                new_history.append({'role': 'user', 'content': message})
                new_history.append({'role': 'assistant', 'content': full_reply})
                max_messages = MAX_HISTORY_PAIRS * 2
                if len(new_history) > max_messages:
                    new_history = new_history[-max_messages:]
                request.session['chat_history'] = new_history
                request.session.save()

                # Log
                try:
                    ChatLog.objects.create(
                        session_key=request.session.session_key or "unknown",
                        user_message=message,
                        ai_response=full_reply,
                        is_fallback=False,
                        quiz_context=quiz_context,
                        ip_address=self._get_client_ip(request),
                    )
                except Exception:
                    pass

                yield "data: [DONE]\n\n"

            response = StreamingHttpResponse(
                event_stream(),
                content_type="text/event-stream"
            )
            response['Cache-Control'] = 'no-cache'
            response['X-Accel-Buffering'] = 'no'
            return response

        except AIServiceUnavailableError:
            return self._stream_text(get_fallback_response(message))

    def _stream_text(self, text: str):
        """Stream a static text as SSE."""
        import json

        def gen():
            yield f"data: {json.dumps(text)}\n\n"
            yield "data: [DONE]\n\n"

        response = StreamingHttpResponse(gen(), content_type="text/event-stream")
        response['Cache-Control'] = 'no-cache'
        return response

    def _get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR')


class ChatResetView(APIView):
    """Reset chat history. POST /api/v1/chat/reset/"""

    def post(self, request):
        request.session.pop('chat_history', None)
        request.session.pop('chat_message_count', None)
        return Response({'status': 'ok'})
