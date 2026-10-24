from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import ItemViewSet, ClaimViewSet, RegisterView

router = DefaultRouter()
router.register('items', ItemViewSet, basename='item')
router.register('claims', ClaimViewSet, basename='claim')

urlpatterns = [
    path('auth/register/', RegisterView.as_view()),
    path('auth/login/', TokenObtainPairView.as_view()),
    path('auth/refresh/', TokenRefreshView.as_view()),
] + router.urls
