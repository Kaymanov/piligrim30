"""
Management command to delete old ChatLog entries.

Run manually or via cron to keep the table small and comply with data
minimisation principles (GDPR/152-ФЗ).

Usage:
    python manage.py cleanup_chat_logs           # delete logs older than 90 days
    python manage.py cleanup_chat_logs --days 30 # delete logs older than 30 days
    python manage.py cleanup_chat_logs --dry-run # preview without deleting
"""
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.chat.models import ChatLog


class Command(BaseCommand):
    help = "Delete ChatLog entries older than N days (default: 90)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--days",
            type=int,
            default=90,
            help="Delete logs older than this many days (default: 90)",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Show what would be deleted without actually deleting",
        )

    def handle(self, *args, **options):
        days = options["days"]
        dry_run = options["dry_run"]
        cutoff = timezone.now() - timedelta(days=days)

        qs = ChatLog.objects.filter(created_at__lt=cutoff)
        count = qs.count()

        if dry_run:
            self.stdout.write(
                self.style.WARNING(
                    f"DRY RUN: would delete {count} ChatLog entries older than {days} days "
                    f"(before {cutoff.strftime('%Y-%m-%d')})"
                )
            )
            return

        if count == 0:
            self.stdout.write("No old chat logs to delete.")
            return

        qs.delete()
        self.stdout.write(
            self.style.SUCCESS(
                f"Deleted {count} ChatLog entries older than {days} days."
            )
        )
