from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.ReadOnlyField(source='assigned_to.username')
    team_name = serializers.ReadOnlyField(source='team.name')

    class Meta:
        model = Task
        fields = "__all__"
        read_only_fields = ['assigned_to']
