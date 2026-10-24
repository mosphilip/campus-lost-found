from django.contrib.auth.models import User
from django.db.models import Q
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


class ClaimViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ClaimSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Claim.objects.filter(Q(claimant=user) | Q(item__posted_by=user))

    @action(detail=False)
    def mine(self, request):
        claims = Claim.objects.filter(claimant=request.user)
        return Response(ClaimSerializer(claims, many=True).data)

    @action(detail=False)
    def received(self, request):
        claims = Claim.objects.filter(item__posted_by=request.user)
        return Response(ClaimSerializer(claims, many=True).data)

    def decide(self, request, new_status):
        claim = self.get_object()

        if claim.item.posted_by != request.user:
            return Response({'detail': 'Only the person who posted the item can do this.'}, status=403)
        if claim.status != 'pending':
            return Response({'detail': 'This claim was already decided.'}, status=400)

        claim.status = new_status
        claim.save()

        if new_status == 'approved':
            claim.item.status = 'claimed'
            claim.item.save()
            Claim.objects.filter(item=claim.item, status='pending').update(status='rejected')

        return Response(ClaimSerializer(claim).data)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        return self.decide(request, 'approved')

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        return self.decide(request, 'rejected')


class MyItemsView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Item.objects.filter(posted_by=self.request.user)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
