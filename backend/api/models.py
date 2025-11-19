from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Transaction(models.Model):
    name = models.CharField(max_length=100)
    account_number = models.TextField(blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="transactions")

    def __str__(self):
        return f"{self.name} - {self.amount} - {self.created_at}"

class Enquiry(models.Model):
    ENQUIRY_STATUS = (
        ('pending', 'Pending'),
        ('reviewed', 'Reviewed'),
        ('resolved', 'Resolved'),
    )

    reason = models.CharField(max_length=100)
    details = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="enquiries")
    attachment = models.FileField(upload_to='enquiries/', blank=True, null=True)
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, related_name="enquiries")
    status = models.CharField(max_length=10, choices=ENQUIRY_STATUS, default='pending')

    def __str__(self):
        return f"{self.reason} - {self.status}"
    

    
    