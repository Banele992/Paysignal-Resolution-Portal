from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import (
    UserSerializer,
    TransactionSerializer,
    EnquirySerializer,
    CustomTokenObtainPairSerializer,
)
from .models import Transaction, Enquiry

class TransactionListCreate(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class EnquiryListCreate(generics.ListCreateAPIView):
    serializer_class = EnquirySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Enquiry.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class EnquiryRetrieveUpdate(generics.RetrieveUpdateAPIView):
    serializer_class = EnquirySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Enquiry.objects.all()
        return Enquiry.objects.filter(author=self.request.user)

class AdminEnquiryList(generics.ListAPIView):
    serializer_class = EnquirySerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    queryset = Enquiry.objects.all()

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer