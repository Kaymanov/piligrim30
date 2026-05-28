# STATE.md — Правовой Пилигрим

## Current Position

- **Milestone:** v1.0 — Frontend MVP
- **Phase:** 4 — Frontend MVP
- **Status:** complete (all 3 waves done + polish)
- **Last Action:** FinalCTA contacts + Yandex Map + Reviews carousel

## Completed Phases

- **Phase 1:** Базовая Инфраструктура, Next.js Router и Django Core ✓
- **Phase 2:** Django Backend — Информационные сущности и Админка ✓
- **Phase 3:** Лиды, Защита форм и ИИ-Юрист ✓
- **Phase 4 Wave 1:** Дизайн-система, Layout, UI-компоненты ✓
- **Phase 4 Wave 2:** Главная страница (11 секций) ✓
- **Phase 4 Wave 3:** Внутренние страницы + SEO (17 маршрутов) ✓

## Phase 4 Post-Wave Polish (доработки)

- [x] Header: scroll morph, glow button, animated burger, dark mode fix
- [x] Footer: accordion mobile, реквизиты ИП, логотип
- [x] Hero: orbital cards, lotus man, responsive
- [x] Problems: custom icons from /images/icon/
- [x] DebtTypes: dark section redesign → light mode soft gradient
- [x] Timeline: scroll-linked line + premium finale animation
- [x] Quiz: 6 вопросов, streaming, dark mode hover fix
- [x] AiLawyerBanner: light mode soft gradient
- [x] Cases: expandable details, light mode header fix
- [x] Reviews: Embla Carousel + fade mask + autoplay + dots + center align
- [x] LatestPosts: real blog images, subtitle fix
- [x] FinalCTA: contacts grid (address/phone/email/hours) + Yandex Map link + light mode
- [x] ChatWidget: floating button fix (position:fixed), streaming SSE
- [x] Modals: LeadModal, CallbackModal, event-based system
- [x] ИИ-Юрист improvements: RAG, logging (ChatLog), CTA after 3 msgs, SSE streaming
- [x] Icons consolidated to /images/icon/
- [x] Dark theme by default
- [x] Якорные ссылки: Контакты→#contact, ЧАВО→#faq, Отзывы→#reviews
- [x] Страница /services с данными piligrim30.ru (доп. услуги + перечень)

## Key Decisions

- ИИ-Юрист: вариант A+B (floating widget + баннер после квиза с quiz_context)
- AI Provider: Polza.ai (OpenAI-compatible), модель google/gemma-4-26b-a4b-it
- Hero всегда тёмный, light mode = rich blue gradient
- Header: scroll morph → rounded pill, кнопка "ИИ-Юрист" с glow
- Footer: accordion на mobile/tablet (<1024px)
- Reviews: Embla Carousel с autoplay + fade mask
- FinalCTA: 2-column (form + contacts/map)
- Яндекс Карта: placeholder-ссылка на localhost, iframe на production
- Streaming: SSE через /api/v1/chat/stream/ (Polza.ai поддерживает)
- RAG: keyword search по FAQ + BlogPost, inject в system prompt

## Recent Progress

- 2026-05-25: FinalCTA — contacts grid + Yandex Map placeholder
- 2026-05-25: Reviews — Embla Carousel + fade mask + autoplay + center align
- 2026-05-25: ИИ-Юрист — RAG, ChatLog, CTA after 3 msgs, SSE streaming
- 2026-05-25: Wave 3 complete — 17 internal pages + sitemap + robots
- 2026-05-25: Wave 2 complete — all 11 homepage sections
- 2026-05-25: Multiple polish fixes (dark mode, animations, icons, colors)
- 2026-05-24: Wave 1 complete — design system, layout, API client
- 2026-05-24: Phase 3 complete — email, form protection, AI chat (Polza.ai)
- 2026-05-23: GSD project initialized

## Open Issues

- Яндекс Карта iframe заблокирована на localhost (работает на production)
- Нет тестовых данных в API (кейсы, отзывы, FAQ, блог) — заполнить после деплоя
- Frontend Docker: npm install вместо npm ci (platform mismatch)
- Квиз отправка: нужно проверить на production (CORS + trailing slash)

## Session Continuity

- **Mode:** YOLO
- **Next step:** Деплой на сервер или дополнительные правки

---

_Last updated: 2026-05-25_
