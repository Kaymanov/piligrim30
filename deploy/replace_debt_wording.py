"""Update public site copy from «списание долгов» to «освобождение от долгов».

Run inside the backend container with ``python -``. The default is a dry run;
pass ``--apply`` to update matching public content in a single transaction.
URL slugs, paths and canonical URLs are deliberately excluded.
"""

import argparse
import os
import re

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

import django  # noqa: E402

django.setup()

from django.apps import apps  # noqa: E402
from django.db import transaction  # noqa: E402
from django.db.models import CharField, TextField  # noqa: E402


PUBLIC_APPS = {"seo", "site_settings", "services", "blog", "cases", "faq", "reviews"}
IDENTIFIER_FIELDS = {"slug", "path", "canonical_url"}
DEBT_PHRASE = re.compile(
    r"\b(?P<first>[Сс])писани(?P<ending>ем|е|я|ю|и)\s+долг(?P<number>ов|а)\b"
)
ENDINGS = {
    "е": "освобождение",
    "я": "освобождения",
    "ю": "освобождению",
    "ем": "освобождением",
    "и": "освобождении",
}
PREPOSITION = re.compile(r"\b([Оо])\s+освобождении\b")


def replace_phrase(text):
    def replace(match):
        noun = ENDINGS[match.group("ending")]
        if match.group("first") == "С":
            noun = noun.capitalize()
        debt = "долга" if match.group("number") == "а" else "долгов"
        return f"{noun} от {debt}"

    updated = DEBT_PHRASE.sub(replace, text)
    return PREPOSITION.sub(
        lambda match: "Об освобождении" if match.group(1) == "О" else "об освобождении",
        updated,
    )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    changes = []
    with transaction.atomic():
        for model in apps.get_models():
            if model._meta.app_label not in PUBLIC_APPS:
                continue
            fields = [
                field
                for field in model._meta.concrete_fields
                if isinstance(field, (CharField, TextField))
                and field.name not in IDENTIFIER_FIELDS
            ]
            for row in model.objects.all().iterator():
                updates = {}
                for field in fields:
                    before = getattr(row, field.name)
                    if not isinstance(before, str):
                        continue
                    after = replace_phrase(before)
                    if after == before:
                        continue
                    if field.max_length and len(after) > field.max_length:
                        raise ValueError(
                            f"{model._meta.label} id={row.pk} {field.name}: "
                            f"{len(after)} characters exceed {field.max_length}"
                        )
                    updates[field.name] = after
                    changes.append(f"{model._meta.label} id={row.pk} {field.name}")
                if args.apply and updates:
                    model.objects.filter(pk=row.pk).update(**updates)
    for change in changes:
        print(change)
    print(f"{'Updated' if args.apply else 'Would update'} {len(changes)} fields")


if __name__ == "__main__":
    main()
