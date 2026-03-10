from django.contrib import admin
from django.urls import path, include

urlpatterns = [

    path('admin/', admin.site.urls),

    path('auth/', include('users.urls')),

    path('api/teams/', include('teams.urls')),

    path('api/tasks/', include('tasks.urls')),

]