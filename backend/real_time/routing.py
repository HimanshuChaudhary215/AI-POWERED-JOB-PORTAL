from django.urls import re_path # pyright: ignore[reportMissingModuleSource]
from . import consumers

websocket_urlpatterns = [
    # notifications consumer (path: /ws/notifications/)
    re_path(r"ws/notifications/$", consumers.NotificationConsumer.as_asgi()), # pyright: ignore[reportArgumentType] # pyright: ignore[reportCallIssue] # type: ignore
]
