from django.contrib import admin
from .models import Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'assigned_to', 'team', 'status', 'created_at')
    list_filter = ('status', 'team')
    search_fields = ('title', 'description')
