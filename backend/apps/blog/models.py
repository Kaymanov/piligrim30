from django.db import models
from django.utils.translation import gettext_lazy as _
from core.common.models import TimestampMixin, PublishableMixin
from apps.seo.models import SEOMixin
from django_ckeditor_5.fields import CKEditor5Field

class BlogCategory(models.Model):
    name = models.CharField(max_length=100, verbose_name=_("Название"))
    slug = models.SlugField(max_length=100, unique=True, verbose_name=_("Slug"))
    description = models.TextField(blank=True, verbose_name=_("Описание"))
    seo_title = models.CharField(max_length=70, blank=True, verbose_name=_("SEO Title"))
    seo_description = models.CharField(max_length=160, blank=True, verbose_name=_("SEO Description"))

    class Meta:
        verbose_name = _("Категория блога")
        verbose_name_plural = _("Категории блога")

    def __str__(self):
        return self.name

class BlogPost(SEOMixin, TimestampMixin, PublishableMixin):
    title = models.CharField(max_length=200, verbose_name=_("Заголовок"))
    slug = models.SlugField(max_length=200, unique=True, verbose_name=_("Slug"))
    h1 = models.CharField(max_length=200, blank=True, verbose_name=_("H1"))
    excerpt = models.TextField(blank=True, verbose_name=_("Краткое содержание"))
    content = CKEditor5Field(blank=True, verbose_name=_("Контент"), config_name='default')
    
    category = models.ForeignKey(BlogCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='posts', verbose_name=_("Категория"))
    tags = models.CharField(max_length=255, blank=True, help_text=_("Теги через запятую"), verbose_name=_("Теги"))
    author = models.CharField(max_length=100, blank=True, verbose_name=_("Автор"))
    cover_image = models.ImageField(upload_to="blog/covers/", blank=True, null=True, verbose_name=_("Обложка"))
    
    is_news = models.BooleanField(default=False, verbose_name=_("Новость"))
    is_expert_article = models.BooleanField(default=False, verbose_name=_("Экспертная статья"))
    is_featured = models.BooleanField(default=False, verbose_name=_("Рекомендуемая"))
    reading_time = models.PositiveIntegerField(default=5, help_text=_("Время чтения в минутах"), verbose_name=_("Время чтения"))

    class Meta:
        verbose_name = _("Статья")
        verbose_name_plural = _("Статьи")

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        from core.common.utils import optimize_image_to_webp
        if self.cover_image:
            self.cover_image = optimize_image_to_webp(self.cover_image)
        if hasattr(self, 'og_image') and self.og_image:
            self.og_image = optimize_image_to_webp(self.og_image)
        super().save(*args, **kwargs)
