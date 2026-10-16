from django.contrib import admin
from .models import Item

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'category', 'status', 'location', 'date')
    list_filter = ('type', 'category', 'status')
    search_fields = ('title', 'description', 'location')
