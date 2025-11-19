from django.urls import path
from . import views

urlpatterns = [
    path("transactions/", views.TransactionListCreate.as_view(), name="transactions-list"),
    path("enquiries/", views.EnquiryListCreate.as_view(), name="enquiries-list"),
    path("enquiries/<int:pk>/", views.EnquiryRetrieveUpdate.as_view(), name="enquiries-detail"),
    path("admin/enquiries/", views.AdminEnquiryList.as_view(), name="admin-enquiries-list"),
]