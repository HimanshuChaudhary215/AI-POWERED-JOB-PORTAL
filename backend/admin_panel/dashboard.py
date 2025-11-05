from django.db.models import Count # pyright: ignore[reportMissingModuleSource]
from users.models import User
from jobs.models import Job

def get_basic_stats():
    users_count = User.objects.count()
    jobs_count = Job.objects.count()
    # applications_count placeholder 0 (if applications app exists, replace)
    applications_count = 0
    return {"users": users_count, "jobs": jobs_count, "applications": applications_count}
