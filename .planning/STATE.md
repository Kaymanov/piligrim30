# STATE.md — Правовой Пилигрим

## Current Position

- **Milestone:** v1.0 — Frontend MVP
- **Phase:** 4 — Frontend MVP
- **Wave:** 2 (in progress)
- **Status:** in_progress
- **Last Action:** Секция Problems (блок 2) с кастомными иконками

## Completed Phases

- **Phase 1:** Базовая Инфраструктура, Next.js Router и Django Core ✓
- **Phase 2:** Django Backend — Информационные сущности и Админка ✓
- **Phase 3:** Лиды, Защита форм и ИИ-Юрист ✓
- **Phase 4 Wave 1:** Дизайн-система, Layout, UI-компоненты ✓

## Phase 4 Wave 2 Progress (Главная страница)

- [x] Hero — тёмный gradient, orbital cards вокруг lotus man, floating animation
- [x] Problems — "Когда стоит обратиться" (8 карточек, иконки из block2/)
- [x] DebtTypes — "Какие долги можно списать" (8 плиток, inline SVG иконки)
- [ ] Timeline — "Как проходит работа" (8 этапов)
- [ ] Quiz — интерактивный квиз (7 вопросов)
- [ ] ИИ-Юрист баннер (после квиза) + floating widget
- [ ] Cases — кейсы из API
- [ ] Reviews — отзывы из API
- [ ] FAQ — аккордеон из API
- [ ] LatestPosts — последние статьи из API
- [ ] FinalCTA — форма заявки

## Key Decisions

- ИИ-Юрист: вариант A+B (floating widget на всех страницах + баннер после квиза с quiz_context)
- AI Provider: Polza.ai (OpenAI-compatible), модель google/gemma-4-26b-a4b-it
- Hero всегда тёмный, light mode = rich blue gradient (не белый)
- Header: scroll morph → rounded pill, кнопка "ИИ-Юрист" с glow
- Footer: accordion на mobile/tablet (<1024px)

## Recent Progress

- 2026-05-25: DebtTypes redesigned — dark section, horizontal chips with checkmarks, slide-in animation
- 2026-05-25: All icons consolidated to /images/icon/ (removed block2/, root SVGs)
- 2026-05-25: Problems section с кастомными SVG-иконками из icon/
- 2026-05-25: Hero — orbital cards вокруг lotus man (man.png), floating animation
- 2026-05-25: Header — scroll morph, glow button, dark mode fix, favicon
- 2026-05-25: Footer — accordion, реквизиты ИП, логотип
- 2026-05-24: Wave 1 complete — design system, layout, API client, LeadForm
- 2026-05-24: Phase 3 complete — email, form protection, AI chat (Polza.ai)
- 2026-05-23: GSD project initialized

## Open Issues

- Нет тестовых данных в API (кейсы, отзывы, FAQ, блог) — нужно заполнить через admin
- Frontend Docker build: используем `npm install` вместо `npm ci` (platform mismatch)

## Session Continuity

- **Mode:** YOLO
- **Next step:** Секция "Как проходит работа" (Timeline)

---

_Last updated: 2026-05-25_
