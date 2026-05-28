"""
Simple RAG: retrieve relevant FAQ and blog content for AI context.
No vector DB — uses keyword matching against Django models.
"""
import logging
from django.db.models import Q

logger = logging.getLogger(__name__)


def get_relevant_context(message: str, max_items: int = 3) -> str:
    """
    Retrieve relevant FAQ answers and blog excerpts based on user message.
    Returns formatted context string to inject into the AI prompt.
    """
    context_parts = []

    # Search FAQ
    try:
        from apps.faq.models import FAQ
        keywords = _extract_keywords(message)
        if keywords:
            q_filter = Q()
            for kw in keywords:
                q_filter |= Q(question__icontains=kw) | Q(answer__icontains=kw)

            faqs = FAQ.objects.filter(q_filter, is_published=True)[:max_items]
            for faq in faqs:
                # Strip HTML tags from CKEditor content
                clean_answer = _strip_html(str(faq.answer))
                context_parts.append(f"В: {faq.question}\nО: {clean_answer[:300]}")
    except Exception as e:
        logger.warning(f"RAG FAQ search failed: {e}")

    # Search Blog posts
    try:
        from apps.blog.models import BlogPost
        if keywords:
            q_filter = Q()
            for kw in keywords:
                q_filter |= Q(title__icontains=kw) | Q(excerpt__icontains=kw)

            posts = BlogPost.objects.filter(q_filter, status="published")[:2]
            for post in posts:
                context_parts.append(f"Статья «{post.title}»: {post.excerpt[:200]}")
    except Exception as e:
        logger.warning(f"RAG Blog search failed: {e}")

    if not context_parts:
        return ""

    return "\n\n---\nРелевантная информация из базы знаний:\n" + "\n\n".join(context_parts) + "\n---\n"


def _extract_keywords(message: str) -> list[str]:
    """Extract meaningful keywords from user message (simple approach)."""
    # Remove short words and common stop words
    stop_words = {
        "что", "как", "где", "когда", "если", "при", "для", "это", "мне",
        "мой", "моя", "моё", "мои", "можно", "нужно", "будет", "есть",
        "или", "так", "уже", "ещё", "еще", "очень", "тоже", "также",
        "какие", "какой", "какая", "какое", "который", "которая",
    }
    words = message.lower().split()
    keywords = [w for w in words if len(w) > 3 and w not in stop_words]
    return keywords[:5]  # Limit to 5 keywords


def _strip_html(text: str) -> str:
    """Remove HTML tags from CKEditor content."""
    import re
    clean = re.sub(r"<[^>]+>", "", text)
    clean = re.sub(r"\s+", " ", clean).strip()
    return clean
