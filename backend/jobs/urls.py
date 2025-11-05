from django.urls import path # pyright: ignore[reportMissingModuleSource]
from .views import JobListCreateView, JobDetailView

urlpatterns = [
    path("", JobListCreateView.as_view(), name="jobs-list"),
    path("latest/", JobListCreateView.as_view(), name="jobs-latest"),
    path("<int:pk>/", JobDetailView.as_view(), name="job-detail"),
]
