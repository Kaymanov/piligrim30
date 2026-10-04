"""Read-only PostgreSQL/media comparison. Run with backend as working directory."""
import hashlib
import json
import os
from pathlib import Path

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
import django
django.setup()
from django.conf import settings
from django.db import connection

result = {'tables': {}, 'media': {}}
with connection.cursor() as cursor:
    for table in connection.introspection.table_names():
        name = connection.ops.quote_name(table)
        cursor.execute(f'SELECT row_to_json(t)::text FROM {name} t ORDER BY row_to_json(t)::text COLLATE "C"')
        digest = hashlib.sha256()
        count = 0
        while rows := cursor.fetchmany(1000):
            for (row,) in rows:
                digest.update(row.encode() + b'\n')
                count += 1
        result['tables'][table] = {'rows': count, 'sha256': digest.hexdigest()}
media = Path(settings.MEDIA_ROOT)
for path in sorted(media.rglob('*')):
    if path.is_file() and not path.is_symlink():
        result['media'][str(path.relative_to(media))] = hashlib.sha256(path.read_bytes()).hexdigest()
print(json.dumps(result, sort_keys=True))
