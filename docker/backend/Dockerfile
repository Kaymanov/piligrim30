FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Install postgresql-client for pg_isready and uv
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*
RUN pip install uv

COPY backend/pyproject.toml /app/backend/
COPY backend/uv.lock /app/backend/

WORKDIR /app/backend

# Use uv to sync dependencies
RUN uv sync --frozen

COPY backend /app/backend
COPY docker /app/docker

# Make entrypoint executable
RUN chmod +x /app/docker/backend/entrypoint.sh

EXPOSE 8000

CMD ["/app/docker/backend/entrypoint.sh"]
