from rest_framework import serializers # pyright: ignore[reportMissingImports]
from .models import Job

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = "__all__"
