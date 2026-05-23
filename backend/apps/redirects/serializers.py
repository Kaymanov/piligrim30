from rest_framework import serializers
from .models import Redirect

class RedirectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Redirect
        fields = '__all__'
