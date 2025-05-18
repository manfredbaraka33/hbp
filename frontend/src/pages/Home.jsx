// import React from 'react'
import Navbar from '../components/Navbar'
// import { useState } from 'react';
// import { FaSearch } from 'react-icons/fa';
// import { useAuth } from '../contexts/AuthContext';
// import { FaPersonCirclePlus } from 'react-icons/fa6';
// import { Link } from 'react-router-dom';

// const Home = () => {

//     const [searchQuery, setSearchQuery] = useState("");
//     const {user}=useAuth();
//     const [searchResults,setSearchResults]=useState([]);
//     const [len,setLen]=useState(0);
//     const [loading,setLoading]=useState(false);
//     const [searching,setsearching]=useState(false);

//     const handleSearchChange = (e) => {
//         setSearchQuery(e.target.value);
//         if(searchQuery == ""){
//          setSearchResults([])
//         }else{
//           handleSearch();
//         }
       
//     };
    
       
//     const handleKeyDown = (e) => {
//         if (e.key === 'Enter') {
//             handleSearch(); 
//         }
//     };

 
//     const handleSearch = () => {
//       setsearching(true);
//       setLoading(true);
//       if (searchQuery.trim() !== "") {
//         fetch(`http://localhost:8000/api/search/?query=${searchQuery}`)
//           .then((response) => response.json())
//           .then((data) => {
//             setSearchResults(data.results);
//             setLen(data.results.length);
//             console.log(len,searchResults);
//             setLoading(false);
//           })
//           .catch((error) =>{
//             console.error("Error searching:", error);
//             setLoading(false);
//             alert("An error occured");
//             setsearching(false)
//           }) 
//       }
//     };

//   return (
//     <div style={{height:'600px'}} className='container-fluid bg-secondary'>
//         <Navbar />
//        <h3 className='my-4'> Welcome to HBAnalytics</h3>
//         <div className="container m-2">
//         <div className="search-bar mt-5 mb-5">
//             <input type="text"
//              placeholder="Search for the patient here...."
//              value={searchQuery} 
//              onChange={handleSearchChange}
//              onKeyDown={handleKeyDown}
//              className="text-light"
//              />
//             <button id="search-button" onClick={handleSearch}>
//               <FaSearch/>
//             </button>
//         </div>
//         <div className='row'>
//        <center> <div className="col">
//         {user?.role != "analyst" && 
         
//          <Link to='/patientreg'><button className='btn btn-outline-light'><FaPersonCirclePlus /> Register patient</button></Link>
       
//        }
//         </div>
//         </center>
//         </div>
//         {searching &&         <div className="container search-results text-light p-3">
//         {loading ? (
//           <div className="loading">
//             <center>
//             <div className="mt-3 text-center">
//                 <div className="spinner-grow text-primary" role="status"></div>
//                 <div className="spinner-grow text-danger" role="status"></div>
//                 <div className="spinner-grow text-success" role="status"></div>
//                 <div className="spinner-grow text-info" role="status"></div>
//                 <p>Searching patient...</p>
//             </div>
//             </center>
//           </div>
//         ) : (
//             !len ? (<div style={{margin:"20px"}}>
//               <center>
//               No results found
//               </center>
//             </div>

//           ):(<center>
             
               
//               {searchResults?.map((re) => (
//                 <Link to={`/patient_details/${re.id}`} 
//                 style={{width:"400px",textDecoration:"none",color:'white'}} 
//                 className="rounded my-2 p-2 bg-dark mx-3 " key={re.id}>
                
//                   {re.first_name}   {re.last_name}
                
//                   </Link>
//               ))}
            
//           </center>
//             )
          
//       )}
//         </div>
//         }
//         </div>
//     </div>
//   )
// }

// export default Home

import React from 'react'
import Notifications from '../components/Notifications'

const Home = () => {
  return (
    <div>
      <Navbar />
      <br /><br />
      <Notifications />
    </div>
  )
}

export default Home