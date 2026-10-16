from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Anyone can read. Only the person who posted the item can change it."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.posted_by == request.user
