from rest_framework import serializers # pyright: ignore[reportMissingImports]
from django.contrib.auth.password_validation import validate_password # pyright: ignore[reportMissingModuleSource]
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    class Meta:
        model = User
        fields = ("id","username","email","password","role","skills","experience")

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id","username","email","role","skills","experience","resume")
