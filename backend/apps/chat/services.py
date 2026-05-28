"""
Сервис интеграции с Polza.ai API для ИИ-Юриста.
Использует OpenAI-совместимый API через openai SDK.
"""
import logging

from django.conf import settings
from openai import OpenAI

from .prompts import SYSTEM_PROMPT, QUIZ_CONTEXT_TEMPLATE

logger = logging.getLogger(__name__)

# Timeout for API calls (seconds)
API_TIMEOUT_SECONDS = 15

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


class AIServiceUnavailableError(Exception):
    """Raised when AI API is unavailable or returns an error."""
    pass


class AIChatService:
    """Сервис для генерации ответов через Polza.ai (OpenAI-compatible API)."""

    def __init__(self):
        self.api_key = getattr(settings, 'POLZA_API_KEY', '')
        self.base_url = getattr(settings, 'POLZA_BASE_URL', 'https://polza.ai/api')
        self.model = getattr(settings, 'POLZA_MODEL', 'google/gemma-4-27b-it')

    def is_available(self) -> bool:
        """Проверяет доступность API (наличие валидного ключа)."""
        return bool(self.api_key) and self.api_key != 'your-polza-api-key'

    def generate_response(
        self, message: str, history: list, quiz_context: dict = None,
        rag_context: str = ""
    ) -> str:
        """
        Генерирует ответ через Polza.ai API.

        Args:
            message: Сообщение пользователя
            history: История чата [{'role': 'user'|'assistant', 'content': str}]
            quiz_context: Контекст из квиза (опционально)
            rag_context: Релевантный контекст из базы знаний (RAG)

        Returns:
            Текст ответа

        Raises:
            AIServiceUnavailableError: При любой ошибке API
        """
        if not self.is_available():
            raise AIServiceUnavailableError("API key not configured")

        try:
            client = OpenAI(
                base_url=self.base_url,
                api_key=self.api_key,
                timeout=API_TIMEOUT_SECONDS,
            )

            # Build system instruction with optional quiz context + RAG
            system_content = SYSTEM_PROMPT
            if quiz_context:
                context_str = QUIZ_CONTEXT_TEMPLATE.format(
                    debt_amount=quiz_context.get('debt_amount', 'не указана'),
                    has_overdue=quiz_context.get('has_overdue', 'не указано'),
                    has_enforcement=quiz_context.get('has_enforcement', 'не указано'),
                    has_property=quiz_context.get('has_property', 'не указано'),
                    has_mortgage=quiz_context.get('has_mortgage', 'не указано'),
                    income_type=quiz_context.get('income_type', 'не указан'),
                )
                system_content += context_str
            if rag_context:
                system_content += rag_context

            # Build messages array
            messages = [{"role": "system", "content": system_content}]
            for msg in history:
                messages.append({
                    "role": msg['role'] if msg['role'] == 'user' else 'assistant',
                    "content": msg['content'],
                })
            messages.append({"role": "user", "content": message})

            response = client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=1024,
            )

            if not response.choices or not response.choices[0].message.content:
                raise AIServiceUnavailableError("Empty response from API")

            return response.choices[0].message.content.strip()

        except AIServiceUnavailableError:
            raise
        except Exception as e:
            logger.error(f"Polza.ai API error: {e}")
            raise AIServiceUnavailableError(f"API error: {e}")

    def generate_response_stream(
        self, message: str, history: list, quiz_context: dict = None,
        rag_context: str = ""
    ):
        """
        Stream response from Polza.ai API (generator yielding text chunks).
        """
        if not self.is_available():
            raise AIServiceUnavailableError("API key not configured")

        try:
            client = OpenAI(
                base_url=self.base_url,
                api_key=self.api_key,
                timeout=API_TIMEOUT_SECONDS,
            )

            system_content = SYSTEM_PROMPT
            if quiz_context:
                context_str = QUIZ_CONTEXT_TEMPLATE.format(
                    debt_amount=quiz_context.get('debt_amount', 'не указана'),
                    has_overdue=quiz_context.get('has_overdue', 'не указано'),
                    has_enforcement=quiz_context.get('has_enforcement', 'не указано'),
                    has_property=quiz_context.get('has_property', 'не указано'),
                    has_mortgage=quiz_context.get('has_mortgage', 'не указано'),
                    income_type=quiz_context.get('income_type', 'не указан'),
                )
                system_content += context_str
            if rag_context:
                system_content += rag_context

            messages = [{"role": "system", "content": system_content}]
            for msg in history:
                messages.append({
                    "role": msg['role'] if msg['role'] == 'user' else 'assistant',
                    "content": msg['content'],
                })
            messages.append({"role": "user", "content": message})

            stream = client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=1024,
                stream=True,
            )

            for chunk in stream:
                if chunk.choices and chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content

        except Exception as e:
            logger.error(f"Polza.ai streaming error: {e}")
            raise AIServiceUnavailableError(f"Streaming error: {e}")


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
