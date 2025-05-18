"""
ASGI config for hbp project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

# import os

# from django.core.asgi import get_asgi_application

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hbp.settings')

# application = get_asgi_application()


import os 
from channels.routing import ProtocolTypeRouter, URLRouter 
from django.core.asgi import get_asgi_application 
from channels.auth import AuthMiddlewareStack 
import patients.routing 

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hbp.settings') 
application = ProtocolTypeRouter({ 
    "http": get_asgi_application(), 
    "websocket": AuthMiddlewareStack( 
    URLRouter( 
        patients.routing.websocket_urlpatterns 
    ) 
      ), 
    }) 