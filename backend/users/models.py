from django.contrib.auth.models import AbstractUser # pyright: ignore[reportMissingModuleSource]
from django.db import models # pyright: ignore[reportMissingModuleSource]

class User(AbstractUser):
    ROLE_CHOICES = (("candidate","Candidate"), ("recruiter","Recruiter"), ("admin","Admin"))
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="candidate")
    skills = models.TextField(blank=True)
    experience = models.TextField(blank=True)
    resume = models.FileField(upload_to="resumes/", blank=True, null=True)

    def __str__(self):
        return self.username
