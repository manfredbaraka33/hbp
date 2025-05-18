import React, { useEffect, useState, useRef } from 'react'; 

const NotificationSocket = () => {
    const [notifications, setNotifications] = useState([]); 
    
    useEffect(() => { 
        // Create WebSocket connection 
        const socket = new WebSocket('wss://hbpbackend.linkpc.net/ws/notifications/'); 

        socket.onmessage = (event) =>{
            const data = JSON.parse(event.data);
            setNotifications((prev)=>[data, ...prev]);
        };

        socket.onclose = () => console.log("Web socket closed");
 
        
        return () => socket.close();
    }, []); 
 
    
  return notifications;
}

export default NotificationSocket
