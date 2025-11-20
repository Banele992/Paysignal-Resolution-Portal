from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Transaction
from .models import Enquiry


# Makes sure data is valid, serializer is a translator and a gatekeeper
class UserSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(
        choices=(
            ("user", "User"),
            ("admin", "Admin"),
        ),
        write_only=True,
        default="user",
    )

    class Meta:
        model = User
        fields = ["id", "username", "password", "role"]
        extra_kwargs = {
            "password": {"write_only": True}  # Accept password on create, but never return it
        }

    # Creating a new user
    def create(self, validated_data):
        role = validated_data.pop("role", "user")
        user = User.objects.create_user(**validated_data)

        if role == "admin":
            user.is_staff = True
            user.save(update_fields=["is_staff"])

        return user

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ["id","name","account_number","amount","created_at","author"]
        extra_kwargs = {"author": {"read_only": True}} 


class EnquirySerializer(serializers.ModelSerializer):
    transaction = TransactionSerializer(read_only=True)
    transaction_id = serializers.PrimaryKeyRelatedField(
        source="transaction",
        queryset=Transaction.objects.all(),
        write_only=True
    )

    class Meta:
        model = Enquiry
        fields = [
            "id",
            "reason",
            "details",
            "created_at",
            "author",
            "attachment",
            "transaction",
            "transaction_id",
            "status",
        ]
        extra_kwargs = {"author": {"read_only": True}} 


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = "admin" if user.is_staff else "user"
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["role"] = "admin" if self.user.is_staff else "user"
        return data
