from rest_framework import serializers
from .models import BlogCategory, BlogPost

class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = '__all__'

class BlogPostListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views — excludes heavy `content`."""
    category_data = BlogCategorySerializer(source='category', read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'h1', 'excerpt', 'category', 'category_data',
            'tags', 'author', 'cover_image', 'is_news', 'is_expert_article',
            'is_featured', 'reading_time', 'published_at',
            'seo_title', 'seo_description',
        ]

class BlogPostSerializer(serializers.ModelSerializer):
    category_data = BlogCategorySerializer(source='category', read_only=True)
    
    class Meta:
        model = BlogPost
        fields = '__all__'
