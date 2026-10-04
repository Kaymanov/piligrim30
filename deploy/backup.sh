#!/usr/bin/env bash
# Usage: bash deploy/backup.sh /absolute/live/project /absolute/backup/root
# Run on the server, from the current project's Docker context, before changing code.
set -euo pipefail
umask 077

project_dir=$(realpath -e "${1:?Specify existing project directory}")
backup_root=$(realpath -e "${2:?Specify existing backup directory outside the project}")
case "$backup_root/" in "$project_dir/"*) echo 'Backup must be outside the project.' >&2; exit 1 ;; esac
[[ -f "$project_dir/.env" && -f "$project_dir/docker-compose.yml" ]] || { echo 'Missing live .env or compose file.' >&2; exit 1; }
cd "$project_dir"
compose=(docker compose --project-directory "$project_dir" -f "$project_dir/docker-compose.yml")

# Refuse to guess a project name or use a different database container.
db_container=$("${compose[@]}" ps -q postgres)
backend_container=$("${compose[@]}" ps --all -q backend)
[[ -n "$db_container" && -n "$backend_container" ]] || { echo 'Live postgres/backend containers not found. Inspect deployment first.' >&2; exit 1; }
actual_dir=$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project.working_dir"}}' "$db_container")
[[ "$actual_dir" == "$project_dir" ]] || { echo 'Compose working directory does not match. Stop and inspect.' >&2; exit 1; }
backend_mount=$(docker inspect --format '{{range .Mounts}}{{if eq .Destination "/app/backend"}}{{.Source}}{{end}}{{end}}' "$backend_container")
[[ "$backend_mount" == "$project_dir/backend" ]] || { echo 'Unexpected backend mount. Stop and inspect media storage.' >&2; exit 1; }

backup_dir=$(mktemp -d "$backup_root/piligrim-$(date -u +%Y%m%dT%H%M%SZ)-XXXXXX")
printf 'Backup destination: %s\n' "$backup_dir"
"${compose[@]}" exec -T postgres sh -eu -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom' < /dev/null > "$backup_dir/database.dump"
[[ -s "$backup_dir/database.dump" ]]
"${compose[@]}" exec -T postgres pg_restore --list < "$backup_dir/database.dump" > "$backup_dir/database.contents"

# Preserve source, local changes, media, .env and git metadata, excluding only build caches.
# Tar errors (including files changing mid-copy) stop the backup. Use maintenance mode
# to obtain a consistent final database/media snapshot before deploying.
tar --exclude='./frontend/node_modules' --exclude='./frontend/.next' \
    --exclude='./backend/.venv' --exclude='*/__pycache__' \
    -czf "$backup_dir/project.tar.gz" -C "$project_dir" .
tar -tzf "$backup_dir/project.tar.gz" > "$backup_dir/project.contents"
if [[ -d /etc/nginx ]]; then
    tar -czf "$backup_dir/nginx.tar.gz" -C /etc nginx
fi
"${compose[@]}" ps -q | xargs -r docker inspect --format '{{.Name}} {{.Image}} {{json .Mounts}}' > "$backup_dir/container-mounts.txt"
git rev-parse HEAD > "$backup_dir/revision.txt"
git status --short > "$backup_dir/worktree.txt"
(
    cd "$backup_dir"
    sha256sum database.dump project.tar.gz > SHA256SUMS
    if [[ -f nginx.tar.gz ]]; then sha256sum nginx.tar.gz >> SHA256SUMS; fi
    sha256sum --check SHA256SUMS
)
printf 'Backup files verified. Restore into an isolated database before deployment.\n'
