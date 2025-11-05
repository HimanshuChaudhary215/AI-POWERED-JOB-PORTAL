import os
from django.core.asgi import get_asgi_application # pyright: ignore[reportMissingModuleSource]
from channels.routing import ProtocolTypeRouter, URLRouter # pyright: ignore[reportMissingModuleSource]
from channels.auth import AuthMiddlewareStack # pyright: ignore[reportMissingModuleSource]
import websocket.routing # pyright: ignore[reportMissingImports]

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket.routing.websocket_urlpatterns
        )
    ),
})
