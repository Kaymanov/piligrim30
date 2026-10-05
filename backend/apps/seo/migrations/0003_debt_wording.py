from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("seo", "0002_seoconfiguration_indexnow_enabled"),
    ]

    operations = [
        migrations.AlterField(
            model_name="seoconfiguration",
            name="default_description",
            field=models.CharField(
                default="Банкротство физических лиц и освобождение от долгов в Астрахани и Астраханской области. Юридическая консультация и сопровождение процедуры.",
                max_length=300,
                verbose_name="Описание по умолчанию",
            ),
        ),
        migrations.AlterField(
            model_name="seopage",
            name="path",
            field=models.CharField(
                choices=[
                    ("/", "Главная"),
                    ("/bankrotstvo-fizicheskih-lic", "Банкротство физических лиц"),
                    ("/spisanie-dolgov", "Освобождение от долгов"),
                    ("/bankrotstvo-pod-klyuch", "Банкротство под ключ"),
                    ("/bankrotstvo-cherez-mfc", "Банкротство через МФЦ"),
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
    ]
