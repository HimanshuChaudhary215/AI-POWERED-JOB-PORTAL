from django.contrib import admin # pyright: ignore[reportMissingModuleSource]
from django.urls import path, include # pyright: ignore[reportMissingModuleSource]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/users/", include("users.urls")),
    path("api/jobs/", include("jobs.urls")),
    path("api/applications/", include("applications.urls")),
    path("api/admin-panel/", include("admin_panel.urls")),
    path("api/ai/", include("ai.urls")),  # <--- AI recommend endpoint
]
