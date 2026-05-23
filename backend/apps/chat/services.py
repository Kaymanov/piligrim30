"""
Сервис интеграции с Gemini API для ИИ-Юриста.
"""
import logging

from django.conf import settings
from google import genai

from .prompts import SYSTEM_PROMPT, QUIZ_CONTEXT_TEMPLATE

logger = logging.getLogger(__name__)

# Timeout for Gemini API calls
GEMINI_TIMEOUT_SECONDS = 15

# Keywords for on-topic detection
ON_TOPIC_KEYWORDS = [
    'банкротств', 'долг', 'кредит', 'займ', 'микрозайм',
    'коллектор', 'пристав', 'суд', 'ипотек', 'имуществ',
    'списан', 'процедур', 'арест', 'карт', 'счет', 'счёт',
    'зарплат', 'жкх', 'мфц', 'исполнительн', 'взыскан',
    'просрочк', 'задолженност', 'неплатеж', 'реструктуриз',
    'рассрочк', 'банк', 'финансов', 'платеж', 'платёж',
    'юрист', 'консультац', 'документ', 'заявлен',
    'последстви', 'стоимост', 'цен', 'сколько стоит',
    'как долго', 'срок', 'этап', 'порядок',
]

# Short messages that are contextual (greetings, confirmations)
CONTEXTUAL_SHORT_MESSAGES = [
    'да', 'нет', 'ок', 'хорошо', 'понятно', 'спасибо',
    'привет', 'здравствуйте', 'добрый день', 'подробнее',
    'а если', 'а что', 'почему', 'как', 'когда', 'где',
]


class GeminiUnavailableError(Exception):
    """Raised when Gemini API is unavailable or returns an error."""
    pass


class GeminiChatService:
    """Сервис для генерации ответов через Gemini API."""

    def __init__(self):
        self.api_key = getattr(settings, 'GEMINI_API_KEY', '')
        self.model_name = "gemini-2.5-flash"

    def is_available(self) -> bool:
        """Проверяет доступность API (наличие валидного ключа)."""
        return bool(self.api_key) and self.api_key != 'your-gemini-api-key'

    def generate_response(
        self, message: str, history: list, quiz_context: dict = None
    ) -> str:
        """
        Генерирует ответ через Gemini API.

        Args:
            message: Сообщение пользователя
            history: История чата [{'role': 'user'|'assistant', 'content': str}]
            quiz_context: Контекст из квиза (опционально)

        Returns:
            Текст ответа

        Raises:
            GeminiUnavailableError: При любой ошибке API
        """
        if not self.is_available():
            raise GeminiUnavailableError("API key not configured")

        try:
            client = genai.Client(api_key=self.api_key)

            # Build system instruction with optional quiz context
            system_instruction = SYSTEM_PROMPT
            if quiz_context:
                context_str = QUIZ_CONTEXT_TEMPLATE.format(
                    debt_amount=quiz_context.get('debt_amount', 'не указана'),
                    has_overdue=quiz_context.get('has_overdue', 'не указано'),
                    has_enforcement=quiz_context.get('has_enforcement', 'не указано'),
                    has_property=quiz_context.get('has_property', 'не указано'),
                    has_mortgage=quiz_context.get('has_mortgage', 'не указано'),
                    income_type=quiz_context.get('income_type', 'не указан'),
                )
                system_instruction += context_str

            # Build contents from history + new message
            contents = []
            for msg in history:
                role = 'user' if msg['role'] == 'user' else 'model'
                contents.append(
                    genai.types.Content(
                        role=role,
                        parts=[genai.types.Part(text=msg['content'])]
                    )
                )

            # Add current message
            contents.append(
                genai.types.Content(
                    role='user',
                    parts=[genai.types.Part(text=message)]
                )
            )

            # Generate response
            response = client.models.generate_content(
                model=self.model_name,
                contents=contents,
                config=genai.types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.7,
                    max_output_tokens=1024,
                ),
            )

            if not response or not response.text:
                raise GeminiUnavailableError("Empty response from Gemini")

            return response.text.strip()

        except GeminiUnavailableError:
            raise
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            raise GeminiUnavailableError(f"API error: {e}")


def is_on_topic(message: str) -> bool:
    """
    Проверяет, относится ли сообщение к теме банкротства/долгов.

    Короткие контекстные сообщения (приветствия, "да", "нет") считаются on-topic,
    так как они продолжают существующий диалог.
    """
    message_lower = message.lower().strip()

    # Short contextual messages are always on-topic
    if len(message_lower) <= 15:
        for phrase in CONTEXTUAL_SHORT_MESSAGES:
            if phrase in message_lower:
                return True
        # Very short messages (< 10 chars) are contextual by default
        if len(message_lower) < 10:
            return True

    # Check for topic keywords
    for keyword in ON_TOPIC_KEYWORDS:
        if keyword in message_lower:
            return True

    return False
