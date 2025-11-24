from rest_framework.views import APIView # pyright: ignore[reportMissingImports]
from rest_framework.response import Response # pyright: ignore[reportMissingImports]
from rest_framework.permissions import IsAdminUser # pyright: ignore[reportMissingImports]
from .dashboard import get_basic_stats # pyright: ignore[reportMissingImports]

class StatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        stats = get_basic_stats()
        return Response(stats)
