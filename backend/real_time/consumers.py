import json
from channels.generic.websocket import AsyncWebsocketConsumer # pyright: ignore[reportMissingModuleSource]
from urllib.parse import parse_qs
from django.contrib.auth import get_user_model # pyright: ignore[reportMissingModuleSource]
from rest_framework_simplejwt.tokens import UntypedToken # pyright: ignore[reportMissingImports]
from django.conf import settings # pyright: ignore[reportMissingModuleSource]
from jwt import DecodeError, InvalidTokenError # pyright: ignore[reportMissingImports]
import jwt # pyright: ignore[reportMissingImports]

User = get_user_model()

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Accept the connection, then try to find user from token query param
        qs = parse_qs(self.scope.get("query_string").decode())
        token_list = qs.get("token", None)
        self.user = None

        if token_list:
            token = token_list[0]
            try:
                # decode token (SimpleJWT default)
                payload = jwt.decode(token, settings.SIMPLE_JWT['SIGNING_KEY'], algorithms=[settings.SIMPLE_JWT.get('ALGORITHM','HS256')])
                user_id = payload.get("user_id")
                self.user = await self.get_user(user_id)
            except Exception:
                self.user = None

        # Accept connection
        await self.accept()
        # Add to a group per-user so we can push notifications
        if self.user:
            self.group_name = f"user_{self.user.id}" # pyright: ignore[reportAttributeAccessIssue]
            await self.channel_layer.group_add(self.group_name, self.channel_name)
        else:
            self.group_name = None

    async def disconnect(self, close_code): # pyright: ignore[reportIncompatibleMethodOverride]
        if self.group_name:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        # Echo or handle client messages if needed
        data = json.loads(text_data) if text_data else {}
        # Example: client requests latest recs
        if data.get("action") == "fetch_recs":
            await self.send(json.dumps({"type": "info", "message": "fetching recs"}))

    async def send_notification(self, event):
        # send event dict to websocket
        await self.send(text_data=json.dumps(event["payload"]))

    @staticmethod
    async def get_user(user_id):
        try:
            return await User.objects.aget(id=user_id)
        except Exception:
            return None
