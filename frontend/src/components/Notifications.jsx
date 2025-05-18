import React from 'react'
import NotificationSocket from './NotificationSocket' 
import { toast } from 'react-toastify'; 
import { ToastContainer } from 'react-toastify'; 

const Notifications = () => {
    const notifications = NotificationSocket();
    toast.info(notifications)
  return (
    <span className='p-4'>
        {/* <h2>Notifications</h2> */}
        {notifications.map((note,idx) =>(
            <div key={idx} className='p-2 mb-2 bg-green-100 rounded'>
                {note.message} 
                 
            </div>
        ))

        } 

      

        {/* <ToastContainer /> */}
    </span>
  )
}

export default Notifications