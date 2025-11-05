from django.db import models # pyright: ignore[reportMissingModuleSource]
from users.models import User

class Job(models.Model):
    recruiter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posted_jobs")
    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    description = models.TextField()
    skills_required = models.TextField(blank=True)
    location = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} @ {self.company}"
