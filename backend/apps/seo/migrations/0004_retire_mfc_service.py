from django.db import migrations, models


def retire_mfc_service(apps, schema_editor):
    database = schema_editor.connection.alias
    Service = apps.get_model("services", "Service")
    FAQ = apps.get_model("faq", "FAQ")
    Review = apps.get_model("reviews", "Review")
    SEOPage = apps.get_model("seo", "SEOPage")

    Service.objects.using(database).filter(slug="bankrotstvo-cherez-mfc").update(
        status="archived", is_featured=False, is_indexable=False
    )
    FAQ.objects.using(database).filter(
        question="Можно ли оформить банкротство через МФЦ бесплатно?"
    ).update(is_published=False)
    Review.objects.using(database).filter(
        author_name="Марина П.",
        text__startswith="Обращалась по банкротству через МФЦ.",
    ).update(is_published=False)
    SEOPage.objects.using(database).filter(path="/bankrotstvo-cherez-mfc").update(
        is_indexable=False, is_followable=False
    )


class Migration(migrations.Migration):
    dependencies = [
        ("seo", "0003_debt_wording"),
        ("services", "0001_initial"),
        ("faq", "0002_initial"),
        ("reviews", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="seopage",
            name="path",
            field=models.CharField(
                choices=[
                    ("/", "Главная"),
                    ("/bankrotstvo-fizicheskih-lic", "Банкротство физических лиц"),
                    ("/spisanie-dolgov", "Освобождение от долгов"),
                    ("/bankrotstvo-pod-klyuch", "Банкротство под ключ"),
                    ("/kollektory", "Защита от коллекторов"),
                    ("/services", "Юридические услуги"),
                    ("/blog", "Новости и статьи"),
                    ("/cases", "Кейсы"),
                    ("/reviews", "Отзывы"),
                    ("/faq", "Частые вопросы"),
                    ("/contacts", "Контакты"),
                    ("/privacy-policy", "Политика конфиденциальности"),
                    ("/personal-data-consent", "Согласие на обработку данных"),
                ],
                max_length=255,
                unique=True,
                verbose_name="Страница",
            ),
        ),
        migrations.RunPython(retire_mfc_service, migrations.RunPython.noop),
    ]
