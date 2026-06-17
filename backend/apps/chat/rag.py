"""
Simple RAG: retrieve relevant FAQ and blog content for AI context.
No vector DB — uses keyword matching against Django models.
"""
import re
import logging

from django.db.models import Q

logger = logging.getLogger(__name__)

# Maximum characters of blog article content to include in context
MAX_CONTENT_CHARS = 600
MAX_EXCERPT_CHARS = 300
MAX_FAQ_ANSWER_CHARS = 400


def get_relevant_context(message: str, max_items: int = 3) -> str:
    """
    Retrieve relevant FAQ answers and blog content based on user message.
    Returns formatted context string to inject into the AI prompt.

    Searches:
    - FAQ: question + answer (HTML stripped)
    - Blog: title + excerpt + beginning of content (HTML stripped)
    """
    keywords = _extract_keywords(message)
    if not keywords:
        return ""

    context_parts = []

    # ── Search FAQ ────────────────────────────────────────────────────────────
    try:
        from apps.faq.models import FAQ
        q_filter = Q()
        for kw in keywords:
            q_filter |= (
                Q(question__icontains=kw) |
                Q(answer__icontains=kw) |
                Q(category__icontains=kw)
            )
        faqs = FAQ.objects.filter(q_filter, is_published=True)[:max_items]
        for faq in faqs:
            clean_answer = _strip_html(str(faq.answer))[:MAX_FAQ_ANSWER_CHARS]
            context_parts.append(f"В: {faq.question}\nО: {clean_answer}")
    except Exception as e:
        logger.warning(f"RAG FAQ search failed: {e}")

    # ── Search Blog posts ─────────────────────────────────────────────────────
    try:
        from apps.blog.models import BlogPost
        q_filter = Q()
        for kw in keywords:
            q_filter |= (
                Q(title__icontains=kw) |
                Q(excerpt__icontains=kw) |
                Q(content__icontains=kw)   # full article text (was missing)
            )
        posts = BlogPost.objects.filter(q_filter, status="published")[:2]
        for post in posts:
            excerpt = post.excerpt[:MAX_EXCERPT_CHARS] if post.excerpt else ""
            # Include beginning of full content for richer context
            content_snippet = ""
            if post.content:
                clean_content = _strip_html(str(post.content))
                content_snippet = clean_content[:MAX_CONTENT_CHARS]

            parts = [f"Статья «{post.title}»"]
            if excerpt:
                parts.append(f"Краткое: {excerpt}")
            if content_snippet:
                parts.append(f"Содержание: {content_snippet}")
            context_parts.append("\n".join(parts))
    except Exception as e:
        logger.warning(f"RAG Blog search failed: {e}")

    if not context_parts:
        return ""

    return (
        "\n\n---\n"
        "Релевантная информация из базы знаний:\n"
        + "\n\n".join(context_parts)
        + "\n---\n"
    )


def _extract_keywords(message: str) -> list[str]:
    """Extract meaningful keywords from user message."""
    stop_words = {
        "что", "как", "где", "когда", "если", "при", "для", "это", "мне",
        "мой", "моя", "моё", "мои", "можно", "нужно", "будет", "есть",
        "или", "так", "уже", "ещё", "еще", "очень", "тоже", "также",
        "какие", "какой", "какая", "какое", "который", "которая",
        "после", "перед", "через", "между", "около", "вместо",
        "меня", "тебя", "него", "неё", "нас", "вас", "них",
    }
    # Also handle punctuation
    words = re.sub(r"[^\w\s]", " ", message.lower()).split()
    keywords = [w for w in words if len(w) > 3 and w not in stop_words]
    return keywords[:6]  # Slightly more keywords for better recall


def _strip_html(text: str) -> str:
    """Remove HTML tags and normalise whitespace."""
    clean = re.sub(r"<[^>]+>", "", text)
    clean = re.sub(r"&[a-z]+;", " ", clean)   # HTML entities
    clean = re.sub(r"\s+", " ", clean).strip()
    return clean
