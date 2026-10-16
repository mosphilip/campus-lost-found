from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Item, Claim


class ItemSerializer(serializers.ModelSerializer):
    posted_by = serializers.ReadOnlyField(source='posted_by.username')

    class Meta:
        model = Item
        fields = '__all__'


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class ClaimSerializer(serializers.ModelSerializer):
    claimant = serializers.ReadOnlyField(source='claimant.username')
    item_title = serializers.ReadOnlyField(source='item.title')

    class Meta:
        model = Claim
        fields = ['id', 'item', 'item_title', 'claimant', 'message', 'status', 'created_at']
        read_only_fields = ['item', 'status']
