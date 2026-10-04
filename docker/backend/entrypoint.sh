#!/bin/bash
set -euo pipefail

# Wait for PostgreSQL to be ready
echo "Waiting for postgres..."

while ! pg_isready -h postgres -p 5432 -U "${POSTGRES_USER:-piligrim_user}"; do
  sleep 1
done

echo "PostgreSQL started"

# Apply database migrations
echo "Apply database migrations"
uv run python manage.py migrate

# Create administrators explicitly with manage.py createsuperuser.

# Collect static files
echo "Collect static files"
uv run python manage.py collectstatic --noinput

# Start server
echo "Starting server"
exec uv run gunicorn core.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers 3 \
  --worker-class gthread \
  --threads 4 \
  --timeout 300
