import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import axiosService from '../helpers/axios'


const PatientReg = () => {

  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState(null);
  const navigate =useNavigate();

    const [formData,setFormData]=useState({
            first_name:'',
            last_name:'',
            gender:'',
            dob:'',
            contact_number:'',
            hepatitis_b_stage:'',
            region:'',
            comorbidities:'',
            treatment_type:''
        })

    const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData((prevData) => ({
              ...prevData,
              [name]: value,
            }));
          };

    const handleSubmit=async (e)=>{
           e.preventDefault();
           const data = new FormData();
           Object.keys(formData).forEach((key) => {
               data.append(key, formData[key]);
           });
          console.log("here is the data",data);
          console.log("here is the dformdata",formData);
          try{
            const response = await axiosService.post('/register_patient/', data);
            setSuccess(true);
            alert("Patient registered successfully");
            navigate('/home')
          }
          catch(error){
          console.log(error);
          setErrors(error);
          alert("Patient registration failed")
          }
          finally{
            
          }
    }

  return (
    <div style={{height:'600px'}} className='container-fluid  text-light' >
        <Navbar />
        <br />
    <div className="container mt-5">
       <> </>
       <form className='mt-3 reg-form p-3 rounded' onSubmit={handleSubmit}>
       <h3>Register a new patient</h3>
            <div className="row my-2">
                <div className="col">
                    <label htmlFor="fname">First name: </label>
                    <input type="text" className='form-control' name='first_name' placeholder='Enter the first name' required value={formData.first_name} onChange={handleChange} />
                </div>
                <div className="col">
                    <label htmlFor="lname">Last name: </label>
                    <input type="text" className='form-control' name='last_name' placeholder='Enter last name' required value={formData.last_name} onChange={handleChange} />
                </div>
            </div>
            <div className="row my-2">
                <div className="col">
                    <label className='' htmlFor="gender">Gender: </label>
                    <br />
                     <span>
                    <input type="radio" className='mx-3' name='gender' value="M"  required  onChange={handleChange} />
                    Male
                    </span>
                        <br />
                    <span>
                    <input type="radio" className='mx-3' name='gender' value="F" required  onChange={handleChange} />
                    Female
                    </span>
                </div>
                <div className="col">
                    <label htmlFor="dob">Date of Birth: </label>
                    <input type='date' className='form-control' name='dob'  required value={formData.dob} onChange={handleChange}/>
                </div>
            </div>
            <div className="row my-2">
                <div className="col">
                <label htmlFor="dob">Contact number: </label>
                    <input type='tel' className='form-control' name='contact_number' placeholder='Eg. 07XXXXXXXX/06xxxxxxxx' maxLength='10'  required value={formData.contact_number} onChange={handleChange} />
                </div>
                <div className="col">
                    <label htmlFor="region">Region: </label>
                    <select name="region" id="region" className='form-control' required value={formData.region} onChange={handleChange}>
                       <option value='' >Click to select region</option>
                       <option value="Arusha">Arusha</option>
                       <option value="Mwanza">Mwanza</option>
                       <option value="Kagera">Kagera</option>
                       <option value="Mbeya">Mbeya</option>
                       <option value="Dar-es-salaam">Dar-es-salaam</option>
                       <option value="Kigoma">Kigoma</option>
                       <option value="Iringa">Iringa</option>
                       <option value="Shinyanga">Shinyanga</option>
                       <option value="Kilimanjaro">Kilimanjaro</option>
                       <option value="Manyara">Manyara</option>
                       <option value="Mororgoro">Mororgoro</option>
                    </select>
                </div>
            </div>
            <div className="row my-2">
            <div className="col">
                    <label htmlFor="comobid">Comorbidities: </label>
                    <textarea name="comorbidities" id="comobid" rows="6" className='form-control' 
                    placeholder='Enter all comorbidities the patient has (if any)....'
                    value={formData.comorbidities} onChange={handleChange}
                    ></textarea>
                </div>
                <div className="col">
                    <label htmlFor="stage">Hepatitis B stage: </label>
                    <select name="hepatitis_b_stage" id="stage" className='form-control' required value={formData.hepatitis_b_stage} onChange={handleChange}>
                        <option value='' >Click to select stage</option>
                        <option value="acute">Acute</option>
                        <option value="chronic">Chronic</option>
                    </select>
                </div>
                
            </div>
            <button className="btn btn-outline-info" type="submit">Register</button>
            {errors && (
          <div className="alert alert-danger">
            <div>An error from our side occurred, please contact support team for help.</div>
          </div>
        )}
        

        {success && (
          <div className="alert alert-success">
            The patient has been registered.
          </div>
        )}
       </form>
    </div>

    </div>
  )
}

export default PatientReg