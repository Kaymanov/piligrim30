from rest_framework import serializers
from .models import BlogCategory, BlogPost

class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = '__all__'

class BlogPostSerializer(serializers.ModelSerializer):
    category_data = BlogCategorySerializer(source='category', read_only=True)
    
    class Meta:
        model = BlogPost
        fields = '__all__'
