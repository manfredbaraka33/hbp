import React from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../contexts/AuthContext'

const Profile = () => {
  const {user}=useAuth();
  return (
    <div className='container'>
        <Navbar />
        <br /> <br />
       <div className="container mt-5">
        {user?.email}
        <br />
        {user?.role}
        <br />
        <img src={user?.profile_image} width="100px" height="100px" className='rounded-circle' alt="" />
       </div>
        
        </div>
  )
}

export default Profile