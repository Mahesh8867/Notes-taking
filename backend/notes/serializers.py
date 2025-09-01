from .models import *
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["email"] = user.user_email
        token["name"] = user.user_name
        return token

    @classmethod
    def get_username_field(cls):
        # Tell SimpleJWT to authenticate with user_email instead of username
        return "user_email"

    def validate(self, attrs):
        data = super().validate(attrs)
        data["email"] = self.user.user_email
        data["name"] = self.user.user_name
        return data



class NotesSerializers(serializers.ModelSerializer):
    class Meta:
        model = Notes
        fields = ["note_id", "note_title", "note_content", "create_on"]  # no need to expose owner directly

    def create(self, validated_data):
        user = self.context["request"].user  # get logged-in user
        return Notes.objects.create(owner=user, **validated_data)

