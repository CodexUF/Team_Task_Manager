from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Team
from .serializers import TeamSerializer

class IsOwnerOrMember(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user == obj.owner or request.user in obj.members.all()

class TeamViewSet(viewsets.ModelViewSet):
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrMember]

    def get_queryset(self):
        user = self.request.user
        return (Team.objects.filter(owner=user) | Team.objects.filter(members=user)).distinct()

    def perform_create(self, serializer):
        team = serializer.save(owner=self.request.user)
        team.members.add(self.request.user)

    def destroy(self, request, *args, **kwargs):
        team = self.get_object()
        if team.owner != request.user:
            return Response({"error": "Only the creator can delete this team."}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        team = self.get_object()
        if team.owner != request.user:
            return Response({"error": "Only the creator can add members."}, status=status.HTTP_403_FORBIDDEN)
        
        username = request.data.get("username")
        try:
            user_to_add = User.objects.get(username=username)
            team.members.add(user_to_add)
            return Response({"message": f"User {username} added to team"})
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
