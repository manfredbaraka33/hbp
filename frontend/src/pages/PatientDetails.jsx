import React,{useState,useEffect} from 'react'
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom'
import { getData,patchData } from '../helpers/axios';

const PatientDetails = () => {
    const {patient_id} = useParams();
    const [patient, setPatient] = useState(null);

    const getDetails = async () => {
        const response = await getData(`patient-details/${patient_id}/`);
        return response;
      };
      useEffect(() => {
        
        const loadPatientDetails = async () => {
         
          try {
            const patientDetails = await getDetails();
            setPatient(patientDetails);
          } catch (err) {
            console.log(err)
          } finally {
            
          }
        };
    
        loadPatientDetails();
      }, [patient_id]);
      
      const claculateAge=(dob)=>{
        const currentDate = new Date();
        const birthDate = new Date(dob);
        const age = currentDate.getFullYear() - birthDate.getFullYear();
        const monthDiff = currentDate.getMonth() - birthDate.getMonth();

        const adjustedAge =
          monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())
            ? age - 1
            : age;

        return age;

      }
     
      const toggleVaccinationStatus = async () => { 
        console.log("Hereis the id",patient_id)
        try{
          const response = await patchData(`patients/${patient_id}/toggle_vaccination/`);
          console.log(response); 
          alert("Vaccination status updated");

        }
        catch(error){
        console.log(error); 
        alert(error)
        }
        
       
        }; 

  return (
    <div className='container'>
       <Navbar /> 
       <br />
       <div className="container mt-5 pt-1">
        <div className="row bg-dark mt-3 text-warning rounded-top">
          <div className="col">
          <center>
          <h2>{patient?.first_name} {patient?.last_name} <span className='text-light'>({claculateAge(patient?.dob)} Years Old)</span> </h2>
          </center>
          </div>
          </div>
          <div style={{height:"450px"}} className="row bg-light rounded-bottom">
            <div className="col mx-2 bg-light rounded mt-2">
              <h4 className='text-primary'>Personal Details</h4>     
                <h6>Date Of Birth </h6>
               <p className='bg-secondary text-light rounded p-2'>{patient?.dob}</p>
               <h6>Gender</h6>
               <p className='bg-secondary text-light rounded p-2'>{patient?.gender}</p>
                <h6>Region</h6>
               <p className='bg-secondary text-light rounded p-2'>{patient?.region}</p>
                 <h6>Contact</h6>
               <p className='bg-secondary text-light rounded p-2'>{patient?.contact_number}</p>

            </div>
            <div className="col mx-2 bg-light rounded mt-2">
              <h4 className='text-primary'>Disease Details</h4>
              <h6>Hepatitis B Stage</h6>
              <p className='bg-secondary text-light rounded p-2'>{patient?.hepatitis_b_stage}</p>
              <h6>Treatment Status</h6>
              <p className='bg-secondary text-light rounded p-2'>{patient?.treatment_status}</p>
              <h6>Vaccination Status</h6>
              <p >
                {patient?.vaccination_status == false ? (<p className='bg-secondary text-light rounded p-2 border border-danger border-3'>Not Vaccinated</p>):
                (<p className='bg-secondary text-light rounded p-2 border border-success border-5'>Vaccinated</p>)
                }
                </p>
                <h6>Commorbidities</h6>
              <p >{patient?.comorbidities == "" ? (<p className='bg-secondary text-light rounded p-2'> No commorbidities registered</p>):
              (<p className='bg-secondary text-light rounded p-2'>{patient?.comorbidities}</p>)}</p>
            </div>
            <div className="col mx-2 bg-light rounded mt-2">
    
            <h4 className='text-primary'>Update Details</h4>
              {patient?.vaccination_status == false && 
             <>
               <h6>Vaccination status</h6>
              <button className='btn btn-success'
                onClick={toggleVaccinationStatus} 
                > 
                Update to vaccinated 
                </button>
             </>
                }
            </div>
          </div>
       </div>
    </div>
  )
}

export default PatientDetails