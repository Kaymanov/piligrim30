# PROJECT.md — Правовой Пилигрим

## What This Is

Премиальный SEO-сайт юридического проекта «Правовой Пилигрим» (г. Астрахань), специализирующегося на банкротстве физических лиц и списании долгов. Headless-архитектура: Django REST API + Next.js 15 frontend.

## Core Value

**Системный источник органических заявок** — сайт привлекает клиентов из поиска, формирует доверие через экспертный контент и конвертирует посетителей в заявки без зависимости от рекламы.

## Context

- **Текущий сайт:** https://piligrim30.ru/
- **География:** Астрахань и Астраханская область
- **Тематика:** банкротство физлиц, списание долгов, юридические услуги
- **Формат:** премиальный продающий сайт + SEO-медиа
- **Контент:** пишет владелец через Django Admin
- **Кейсы:** реальные обезличенные

## Tech Stack

- **Backend:** Django 6.0 + DRF + PostgreSQL 15 + Redis 7 + Celery
- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind CSS + Framer Motion
- **Infrastructure:** Docker Compose (postgres, redis, backend, frontend)
- **Package Managers:** uv (Python), npm (Node.js)
- **Rich Content:** CKEditor 5
- **Image Optimization:** Pillow → WebP auto-conversion
- **Caching:** django-redis (15 min on read endpoints)

## Requirements

### Validated

- ✓ Монорепозиторий с Docker Compose — existing
- ✓ PostgreSQL + Redis с healthchecks — existing
- ✓ Django skeleton с 10 приложениями — existing
- ✓ Next.js 15 scaffold (App Router + Tailwind) — existing
- ✓ Модели контента (Pages, Services, Blog, Cases, FAQ, Reviews) — existing
- ✓ SEOMixin (meta, OG, schema.org, sitemap_priority) — existing
- ✓ REST API для всех сущностей (`/api/v1/`) — existing
- ✓ Django Admin с полными fieldsets — existing
- ✓ Модель Lead с UTM-трекингом и типами (default/quiz/callback) — existing
- ✓ Rate Limiting (5/min anon) — existing
- ✓ Redirect middleware (301/302) — existing
- ✓ WebP auto-conversion при загрузке — existing
- ✓ Кэширование на read endpoints (15 min) — existing
- ✓ CKEditor 5 для rich content — existing
- ✓ CORS для localhost:3000 — existing
- ✓ Superuser auto-creation в entrypoint — existing

### Active

- [ ] **LEAD-01**: Email-уведомления при создании заявки (SMTP)
- [ ] **LEAD-02**: Honeypot protection на формах
- [ ] **LEAD-03**: Дополнительная защита форм (обсудить: SmartCaptcha / Turnstile)
- [ ] **AI-01**: ИИ-Юрист — интеграция Gemini 2.5 Flash API
- [ ] **AI-02**: ИИ-Юрист — получение контекста из квиза
- [ ] **AI-03**: ИИ-Юрист — сохранение истории чата
- [ ] **AI-04**: ИИ-Юрист — fallback rule-based механизм
- [ ] **AI-05**: ИИ-Юрист — юридические дисклеймеры в каждом ответе
- [ ] **AI-06**: Endpoint `/api/v1/chat/`

### Out of Scope

- Frontend реализация — следующий этап после Phase 3
- Telegram-уведомления — второй этап после MVP
- CRM-интеграция — второй этап
- Расширенный квиз — второй этап
- Поиск по сайту — второй этап

## Key Decisions

| Decision                       | Rationale                                           | Outcome     |
| ------------------------------ | --------------------------------------------------- | ----------- |
| Django + Next.js headless      | SEO + скорость + удобное управление контентом       | Реализовано |
| uv вместо pip/requirements.txt | Быстрый, современный менеджер зависимостей          | Реализовано |
| Gemini 2.5 Flash для ИИ-Юриста | Быстрый, дешевый, хорошее качество для консультаций | Pending     |
| YOLO mode                      | Автономная работа без подтверждений                 | Принято     |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition:**

1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

---

_Last updated: 2026-05-23 after initialization_
