import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FaArrowAltCircleRight, FaArrowRight, FaBars, FaBrain, FaChartBar, FaFilePdf, FaLine, FaRobot, FaStarAndCrescent, FaTimes } from 'react-icons/fa';
import NotificationSocket from './NotificationSocket';
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
   const {user}=useAuth();
   
   const notifications = NotificationSocket();

   console.log("My notifs",notifications);

   useEffect(()=>{
    if(notifications.length > 0){
      toast.success(notifications[0].message);
    }
   },[notifications])


  return (
    <nav className='nav-bar fixed-top bg-dark text-light'>
        <div className="nav-bar-brand mx-0"><span style={{textDecoration:"none",color:"yellow"}} to='/home'>HBA</span></div>
        <div className='mx-1'>
              <Link  to="/profile">
                <img className="rounded-circle mx-2" style={{ width: "30px", height: "30px" }} src="/download.jpg" alt={user?.username} />
              </Link>
              <Link  style={{textDecoration:"none",color:"white"}} className='mx-2 email' to="/profile"><span>{user?.email}</span></Link>
            </div>

          <ToastContainer />
        
        <div className="nav-bar-links">
          <div style={{ display: "flex" }}>  
          
         
          
           
            <div className='mx-2'>
                <Link  style={{textDecoration:"none"}} to="/dashboard">
                  <span className='btn btn-outline-light'> <FaChartBar /> <span className='db'>Dashboard</span></span>
                </Link>
            </div>
            <div className='mx-2'>
                <Link  style={{textDecoration:"none"}} to="/report" >
                <button className="btn btn-outline-light" ><FaBrain /><span className='db'>Insight</span>  </button>
                </Link>
            </div>
            
            <div className='mx-2'>
                <Link  style={{textDecoration:"none"}} to="/">
                  <span className="btn btn-outline-light"><FaArrowAltCircleRight  /> <span className='lo'>Logout</span> </span> 
                </Link>
            </div>           
          </div> 
      </div>
    </nav>
  )
}

export default Navbar
