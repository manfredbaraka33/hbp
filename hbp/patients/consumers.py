import json 
from channels.generic.websocket import AsyncWebsocketConsumer 


class NotificationConsumer(AsyncWebsocketConsumer): 
    async def connect(self):  
        self.group_name = "notifications" 
        await self.channel_layer.group_add( self.group_name, self.channel_name) 
        await self.accept() 
        
    async def disconnect(self, close_code): 
        await self.channel_layer.group_discard( self.group_name,  self.channel_name)
         
    async def receive(self, text_data): 
        pass
    
    async def send_notification(self, event): 
        await self.send(text_data=json.dumps(event['content'])) 