from rest_framework.views import APIView # pyright: ignore[reportMissingImports]
from rest_framework.response import Response # pyright: ignore[reportMissingImports]
from rest_framework.permissions import IsAuthenticatedOrReadOnly # pyright: ignore[reportMissingImports]
from django.contrib.auth import get_user_model # pyright: ignore[reportMissingModuleSource]
from .recommender import recommend_jobs_for_user
from jobs.serializers import JobSerializer
from users.models import User

class RecommendView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        # prefer user_id param or use authenticated user
        user_id = request.query_params.get("user_id") or (request.user.id if request.user and request.user.is_authenticated else None)
        if not user_id:
            return Response([], status=200)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response([], status=200)

        rec_jobs = recommend_jobs_for_user(user, top_n=10)
        serializer = JobSerializer(rec_jobs, many=True)
        return Response(serializer.data)
