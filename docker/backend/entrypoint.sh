#!/bin/bash

# Wait for PostgreSQL to be ready
echo "Waiting for postgres..."

while ! pg_isready -h postgres -p 5432 -U $POSTGRES_USER; do
  sleep 1
done

echo "PostgreSQL started"

# Apply database migrations
echo "Apply database migrations"
uv run python manage.py migrate

# Create superuser if it doesn't exist
echo "Creating superuser if not exists"
uv run python manage.py shell -c "
from django.contrib.auth import get_user_model;
User = get_user_model();
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin');
    print('Superuser created')
else:
    print('Superuser already exists')
"

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
