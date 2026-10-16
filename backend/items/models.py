from django.conf import settings
from django.db import models


class Item(models.Model):
    TYPE_CHOICES = [('lost', 'Lost'), ('found', 'Found')]
    STATUS_CHOICES = [('open', 'Open'), ('claimed', 'Claimed'), ('returned', 'Returned')]
    CATEGORY_CHOICES = [
        ('electronics', 'Electronics'), ('books', 'Books'),
        ('id_cards', 'ID Cards'), ('clothing', 'Clothing'),
        ('keys', 'Keys'), ('other', 'Other'),
    ]

    title = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    photo = models.ImageField(upload_to='items/', blank=True, null=True)
    location = models.CharField(max_length=120)
    date = models.DateField()
    type = models.CharField(max_length=5, choices=TYPE_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='open')
    posted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_type_display()}: {self.title}"


class Claim(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='claims')
    claimant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='claims')
    message = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(fields=['item', 'claimant'], name='one_claim_per_person_per_item')
        ]

    def __str__(self):
        return f"{self.claimant} claims {self.item.title} ({self.status})"
