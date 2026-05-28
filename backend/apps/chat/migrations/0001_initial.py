from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='ChatLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('session_key', models.CharField(db_index=True, max_length=100, verbose_name='Session Key')),
                ('user_message', models.TextField(verbose_name='Сообщение пользователя')),
                ('ai_response', models.TextField(verbose_name='Ответ ИИ')),
                ('is_fallback', models.BooleanField(default=False, verbose_name='Fallback ответ')),
                ('quiz_context', models.JSONField(blank=True, null=True, verbose_name='Контекст квиза')),
                ('ip_address', models.GenericIPAddressField(blank=True, null=True, verbose_name='IP')),
                ('response_time_ms', models.PositiveIntegerField(blank=True, null=True, verbose_name='Время ответа (мс)')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Дата')),
            ],
            options={
                'verbose_name': 'Лог чата',
                'verbose_name_plural': 'Логи чата',
                'ordering': ['-created_at'],
            },
        ),
    ]
