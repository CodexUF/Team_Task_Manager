from rest_framework import serializers
from .models import Team

class TeamSerializer(serializers.ModelSerializer):
    members_names = serializers.SerializerMethodField()
    owner_name = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Team
        fields = ['id', 'name', 'owner', 'owner_name', 'members', 'members_names', 'created_at']
        read_only_fields = ['owner', 'members']

    def get_members_names(self, obj):
        return [user.username for user in obj.members.all()]
        
    def create(self, validated_data):
        # members is a ManyToMany field and will be handled in perform_create in views.py
        return super().create(validated_data)
