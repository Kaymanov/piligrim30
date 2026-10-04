"""Install only reviewed manifest paths; refuse any unexpected live file changes.

Usage: python3 apply-code.py LIVE RELEASE MANIFEST ROLLBACK_DIRECTORY
Does not migrate, restart, replace .env, or write database/media files.
"""
import hashlib
import json
import os
from pathlib import Path
import stat
import sys
import tarfile
import tempfile


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def safe_path(root, name):
    parts = Path(name).parts
    if not parts or Path(name).is_absolute() or '..' in parts:
        raise ValueError(f'Unsafe release path: {name}')
    if any(part in ('.env', '.git', 'media', 'node_modules', '.venv') for part in parts):
        raise ValueError(f'Protected release path: {name}')
    path = root.joinpath(name)
    if path.is_symlink() or not path.resolve().is_relative_to(root):
        raise ValueError(f'Symlink or escaping release path: {name}')
    return path


def main():
    live, release, manifest_path, backup = map(Path, sys.argv[1:])
    live, release, backup = live.resolve(), release.resolve(), backup.resolve()
    data = json.loads(manifest_path.read_text())
    # Validate every destination and source before changing any live file.
    for name, entry in data.items():
        destination = safe_path(live, name)
        expected = entry['before']
        if expected is None:
            if destination.exists():
                raise ValueError(f'New path already exists on server: {name}')
        elif not destination.is_file() or digest(destination) != expected:
            raise ValueError(f'Live file differs from inspected base: {name}')
        if entry['after'] is not None and digest(safe_path(release, name)) != entry['after']:
            raise ValueError(f'Release checksum mismatch: {name}')

    backup.mkdir(mode=0o700, parents=False, exist_ok=False)
    with tarfile.open(backup / 'previous-code.tar.gz', 'w:gz') as archive:
        for name, entry in data.items():
            if entry['before'] is not None:
                archive.add(live / name, arcname=name, recursive=False)
    (backup / 'manifest.json').write_text(json.dumps(data, indent=2))
    owner = live.stat()
    for name, entry in data.items():
        destination = safe_path(live, name)
        if entry['after'] is None:
            destination.unlink()
            continue
        destination.parent.mkdir(parents=True, exist_ok=True)
        mode = stat.S_IMODE(destination.stat().st_mode) if destination.exists() else 0o644
        with tempfile.NamedTemporaryFile(dir=destination.parent, delete=False) as temp:
            temp.write((release / name).read_bytes())
            temp_path = Path(temp.name)
        os.chmod(temp_path, mode)
        if os.geteuid() == 0:
            os.chown(temp_path, owner.st_uid, owner.st_gid)
        temp_path.replace(destination)
    print(f'Installed {len(data)} reviewed paths; rollback code saved in {backup}')


if __name__ == '__main__':
    main()
