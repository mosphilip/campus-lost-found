from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Item, Claim
from .permissions import IsOwnerOrReadOnly
from .serializers import ItemSerializer, RegisterSerializer, ClaimSerializer


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['type', 'category', 'status', 'location']
    search_fields = ['title', 'description', 'location']

    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def claim(self, request, pk=None):
        item = self.get_object()

        if item.posted_by == request.user:
            return Response({'detail': 'You cannot claim your own item.'}, status=400)
        if item.status != 'open':
            return Response({'detail': 'This item is no longer open for claims.'}, status=400)
        if Claim.objects.filter(item=item, claimant=request.user).exists():
            return Response({'detail': 'You already claimed this item.'}, status=400)

        serializer = ClaimSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(item=item, claimant=request.user)
        return Response(serializer.data, status=201)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
