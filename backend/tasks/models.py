from django.db import models
from django.contrib.auth.models import User
from teams.models import Team

class Task(models.Model):

    STATUS = [
        ("todo","Todo"),
        ("progress","In Progress"),
        ("done","Done")
    ]

    title = models.CharField(max_length=200)

    description = models.TextField()

    team = models.ForeignKey(
        Team,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    assigned_to = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS,
        default="todo"
    )

    due_date = models.DateField(null=True,blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title