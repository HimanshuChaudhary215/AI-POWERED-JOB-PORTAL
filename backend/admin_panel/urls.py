from django.urls import path # pyright: ignore[reportMissingModuleSource]
from . import views

urlpatterns = [
    path("stats/", views.StatsView.as_view(), name="admin-stats"), # pyright: ignore[reportAttributeAccessIssue]
]
from django.db.models import Count # pyright: ignore[reportMissingModuleSource]