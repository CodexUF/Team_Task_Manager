from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # User can see:
        # 1. Tasks assigned to them
        # 2. Tasks in teams they belong to
        # .distinct() ensures a task is only shown once even if it matches both
        return (Task.objects.filter(assigned_to=self.request.user) | 
                Task.objects.filter(team__members=self.request.user)).distinct()

    def perform_create(self, serializer):
        # Default assigned to the creator, but can be overridden in the POST request
        if 'assigned_to' not in self.request.data:
            serializer.save(assigned_to=self.request.user)
        else:
            serializer.save()
