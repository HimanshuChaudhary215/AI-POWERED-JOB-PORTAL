from rest_framework import generics, permissions # pyright: ignore[reportMissingImports]
from .serializers import RegisterSerializer, UserSerializer
from .models import User
from rest_framework.response import Response # pyright: ignore[reportMissingImports]
from rest_framework.views import APIView # pyright: ignore[reportMissingImports]

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class MeView(APIView):
    def get(self, request):
        if not request.user or not request.user.is_authenticated:
            return Response({}, status=200)
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
