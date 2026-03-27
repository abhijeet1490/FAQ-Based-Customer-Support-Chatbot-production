"""A serializer's job is to convert complex data, like our Django FAQ model, into a simple format like JSON that can be easily sent over the internet.
"""

from rest_framework import serializers
from .models import FAQ

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ['question', 'answer']