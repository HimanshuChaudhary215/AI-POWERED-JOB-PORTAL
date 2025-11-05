from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/users/", include("users.urls")),
    path("api/jobs/", include("jobs.urls")),
    path("api/admin-panel/", include("admin_panel.urls")),
    path("api/ai/", include("ai.urls")),
]
