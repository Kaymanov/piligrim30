from rest_framework import serializers
from .models import Service

class ServiceListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views — excludes heavy `content`."""
    class Meta:
        model = Service
        fields = [
            'id', 'title', 'slug', 'h1', 'short_description',
            'icon', 'cover_image', 'is_featured',
            'seo_title', 'seo_description',
        ]

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'
