from django.contrib import admin
from .models import Item, Claim


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'category', 'status', 'location', 'date')
    list_filter = ('type', 'category', 'status')
    search_fields = ('title', 'description', 'location')


@admin.register(Claim)
class ClaimAdmin(admin.ModelAdmin):
    list_display = ('item', 'claimant', 'status', 'created_at')
    list_filter = ('status',)
