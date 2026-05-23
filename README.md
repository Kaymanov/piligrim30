# Правовой Пилигрим

## О проекте
Премиальный SEO-сайт для юридического проекта «Правовой Пилигрим» (г. Астрахань), специализирующегося на банкротстве физических лиц и списании долгов.

## Технологический стек
- **Backend:** Django + Django REST Framework + PostgreSQL + Redis
- **Frontend:** Next.js 15 (App Router) + Tailwind CSS + Framer Motion
- **Инфраструктура:** Docker Compose

## Как запустить локально

1. Скопируйте файл с переменными окружения:
   ```bash
   cp .env.example .env
   ```
2. Поднимите контейнеры:
   ```bash
   docker-compose up --build
   ```
3. Фронтенд доступен по адресу: `http://localhost:3000`
4. Бэкенд (API и админка) доступен по адресу: `http://localhost:8001`
