import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { FaCalendarAlt, FaDatabase, FaDownload, FaFemale, FaFileImport, FaFilter, FaGenderless, FaMale, FaSortNumericUpAlt, FaTimes, FaTransgenderAlt } from 'react-icons/fa';
import { FaLocationPin, FaRotateLeft, FaRotateRight } from 'react-icons/fa6';
import { getData } from '../helpers/axios';
import RegistrationChart from '../components/RegistrationTrendChart';
import GenderChart from '../components/GenderChart';
import VaccinationChart from '../components/VaccinationChart';
import StageBarChart from '../components/StageBarChart';
import TopRegionsBarChart from '../components/TopRegionBarChart';
import TanzaniaHeatMap from '../components/TanzaniaHeatMap';
import jsPDF from 'jspdf'; 
import html2canvas from 'html2canvas'; 
import { toast } from 'react-toastify';
import TanzaniaHeatMap2 from '../components/TanzaniaHeatMap2';
import TanzaniaLegend from '../components/TanzaniaLegend';
import TanzaniaLegend2 from '../components/TanzaniaLegend2';
import Filter from '../components/Filter';


const Dashboard = () => {

  const [totalPatients, setTotalPatients] = useState(null);
  const [data, setData] = useState(null);
  const [loading,setLoading]=useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    region: '',
    gender: '',
    ageGroup: '',
    vaccinationStatus: '',
    stage: '',
  });
    
  const handleDateChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearDates = () => {
    setFilters({ ...filters, startDate: '', endDate: '' });
  };

  const filterDataByDateRange = (data) => {
    const { startDate, endDate } = filters;
  
    return data.filter((item) => {
      
      const itemDate = new Date(item.registration_date);
  
      // Check if itemDate is invalid
      if (isNaN(itemDate)) {
        return false; // Skip this item if the date is invalid
      }
  
      const fromDate = startDate ? new Date(startDate + 'T00:00:00Z') : null; // Adding 'T00:00:00Z' for consistent comparison
      const toDate = endDate ? new Date(endDate + 'T23:59:59Z') : null; // Adding 'T23:59:59Z' for consistent comparison
  
      const isAfterStart = fromDate ? itemDate >= fromDate : true;
      const isBeforeEnd = toDate ? itemDate <= toDate : true;
  
      return isAfterStart && isBeforeEnd;
    });
  };
  
  const getPatients = async () => {
    try {
      setLoading(true);
      const response = await getData('/all_patients/');
      console.log(response);

      const currentDate = new Date();

      const updatedPatients = response.map(patient => {
        const birthDate = new Date(patient.dob);
        const age = currentDate.getFullYear() - birthDate.getFullYear();
        const monthDiff = currentDate.getMonth() - birthDate.getMonth();

        const adjustedAge =
          monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())
            ? age - 1
            : age;    

        return {
          ...patient,
          age: adjustedAge,
        };
      });

      setTotalPatients(updatedPatients.length);
      setData(updatedPatients);
      toast.success("Patient data refreshed");
      console.log(updatedPatients);
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    getPatients();
    
  }, []);

  const ageInGroup = (age, group) => {
    if (group === '0-18') return age <= 18;
    if (group === '19-35') return age >= 19 && age <= 35;
    if (group === '36-60') return age >= 36 && age <= 60;
    if (group === '60+') return age > 60;
    return true;
  };

  const filteredData = filterDataByDateRange(data || []).filter(p =>
    (filters.region ? p.region === filters.region : true) &&
    (filters.gender ? p.gender === filters.gender : true) &&
    (filters.ageGroup ? ageInGroup(p.age, filters.ageGroup) : true) &&
    (filters.vaccinationStatus ? p.vaccination_status === (filters.vaccinationStatus === 'Vaccinated') : true) &&
    (filters.stage ? p.hepatitis_b_stage === filters.stage : true)
  );

  const chronicCases = data?.filter(p => p.hepatitis_b_stage === "chronic").length;
  const chronicCases2 = filteredData?.filter(p => p.hepatitis_b_stage === "chronic").length;
  const activeCases = data?.filter(p => p.treatment_status === "ongoing").length;
  const activeCases2 = filteredData?.filter(p => p.treatment_status === "ongoing").length;
  const vaccinated = data?.filter(p => p.vaccination_status).length;
  const vaccinated2 = filteredData?.filter(p => p.vaccination_status).length;
  const total = data?.length;
  const total2 = filteredData?.length;
  const vaccinationCoverage = ((vaccinated / total) * 100).toFixed(1) + "%";
  let vaccinationCoverage2;
  if (total2 == 0) {
    vaccinationCoverage2 = "-";
  } else {
    vaccinationCoverage2 = ((vaccinated2 / total2) * 100).toFixed(1) + "%";
  }

  const downloadCSV = () => {
    if (!filteredData.length) return;

    const headers = Object.keys(filteredData[0]);
    const csvRows = [
      headers.join(','), // header row
      ...filteredData.map(row => headers.map(field => `"${row[field]}"`).join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'patients.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

 



  return (
    <div id='main-db' className='container-fluid'>
        <Navbar />
        <br />
        {loading ? (<div className="container mt-5">
        <br /><br /><br />
        <div className="mt-5 text-center">
                <div className="spinner-grow text-light" role="status"></div>
                <div className="spinner-grow text-danger" role="status"></div>
                <div className="spinner-grow text-success" role="status"></div>
                <div className="spinner-grow text-info" role="status"></div>
                <p>Loading data ...</p>
            </div>
      </div> 
          


      ):(      <div  className="mt-5 container-fluid text-dark">
        <div className="row p-2">
          <div className="col-2 bg-light rounded p-3 filters">
            <div className="">
                <div className="btn-group border mb-3">
                    <button className="btn btn-outline-success btn-sm" onClick={downloadCSV}> <FaDownload />   CSV</button>
                    <button className="btn btn-outline-primary" onClick={getPatients}><FaRotateRight /> Refresh</button>
                  </div>
              </div>
            <h4 className='text-dark mb-3'> <FaFilter /> Filters</h4>
            
            <div className="container-fluid rounded border bg-secondary text-light border-warning p-2">
              <div className="row">
                <h6 className=''> <FaCalendarAlt /> Date</h6>
                <div className="col">
                  <label htmlFor="startDate"> From: </label>
                  <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleDateChange}
                    className="border p-2 rounded"
                  />

                  <label htmlFor="endDate">To: </label>
                  <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleDateChange}
                    className="border p-2 rounded"
                  />

                  <button
                    onClick={clearDates}
                    className="my-2 btn btn-outline-light">All Time</button>
                </div>
              </div>
            </div>
            <br />
            <div className="container-fluid rounded border bg-secondary text-light border-warning py-2">
              <div className="row">
                <h6 className=''> <FaLocationPin /> Region</h6>
                <div className="col bg-secondary rounded">
                  <div className="my-3">
                    <select
                      className="form-control"
                      value={filters.region}
                      onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                    >
                      <option value="">All</option>
                      <option value="Arusha">Arusha</option>
                      <option value="Dar es salaam">Dar es Salaam</option>
                      <option value="Dodoma">Dodoma</option>
                      <option value="Geita">Geita</option>
                      <option value="Iringa">Iringa</option>
                      <option value="Kagera">Kagera</option>
                      <option value="Katavi">Katavi</option>
                      <option value="Kigoma">Kigoma</option>
                      <option value="Kilimanjaro">Kilimanjaro</option>
                      <option value="Lindi">Lindi</option>
                      <option value="Manyara">Manyara</option>
                      <option value="Mara">Mara</option>
                      <option value="Mbeya">Mbeya</option>
                      <option value="Morogoro">Morogoro</option>
                      <option value="Mtwara">Mtwara</option>
                      <option value="Mwanza">Mwanza</option>
                      <option value="Njombe">Njombe</option>
                      <option value="Pwani">Pwani</option>
                      <option value="Rukwa">Rukwa</option>
                      <option value="Ruvuma">Ruvuma</option>
                      <option value="Shinyanga">Shinyanga</option>
                      <option value="Simiyu">Simiyu</option>
                      <option value="Singida">Singida</option>
                      <option value="Tabora">Tabora</option>
                      <option value="Tanga">Tanga</option>
                      <option value="Songwe">Songwe</option>
                      <option value="Zanzibar North">Zanzibar North</option>
                      <option value="Zanzibar Central/South">Zanzibar Central/South</option>
                      <option value="Zanzibar Urban/West">Zanzibar Urban/West</option>
                      <option value="Pemba North">Pemba North</option>
                      <option value="Pemba South">Pemba South</option>

                    </select>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div className="container-fluid rounded border bg-secondary text-light border-warning py-2">
              <div className="row">
                <h6 className=''> <FaSortNumericUpAlt /> Age Group</h6>
                <div className="col">
                  <select
                    className="form-control"
                    value={filters.ageGroup}
                    onChange={(e) => setFilters({ ...filters, ageGroup: e.target.value })}
                  >
                    <option value="">All</option>
                    <option value="0-18">0-18</option>
                    <option value="19-35">19-35</option>
                    <option value="36-60">36-60</option>
                    <option value="60+">60+</option>
                  </select>
                </div>
              </div>
            </div>
            <br />
            <div className="container-fluid rounded border bg-secondary text-light border-warning py-2">
              <div className="row">
                <h6 className=''> <FaMale /> <FaFemale /> Gender</h6>
                <div className="col bg-secondary py-2">
                  <select
                    className="form-control"
                    value={filters.gender}
                    onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                  >
                    <option value="">All</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
              </div>
            </div> <br />
            <center>
            
            </center>
          </div>
          <div className='text-warning rounded mt-2 notf'>
            <div className="row mb-3">
              <div className="col"><button className='btn btn-sm btn-primary' onClick={() => setShowFilter(true)}><FaFilter /> Filter</button></div>
              <div className="col"><button className='btn btn-sm btn-warning text-dark' onClick={getPatients}><FaRotateRight  /> Refresh</button></div>
              <div className="col"><button className='btn btn-sm btn-success' onClick={downloadCSV}><FaDownload /> CSV</button></div>
            </div>

                  {showFilter && (
                      <div className="filter-overlay">
                        <div className="filter-panel bg-white p-4 shadow">
                          <button onClick={() => setShowFilter(false)} className="btn-close" />
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            
                            
                              <Filter filters={filters} handleDateChange={handleDateChange} clearDates={clearDates} setFilters={setFilters}/>
                          </div>
                          
                        </div>
                      </div>
                    )}


            <div className="row text-dark">
              <div className="col bg-light rounded my-1">
              <center>
                  <div><h2 className='mt-2'>{totalPatients} {totalPatients !== total2 && <span className='text-secondary'><span className='text-success'>/</span> {total2}</span>}</h2>
                    <p className='text-secondary'>Registered</p> </div>
                </center>
              </div>
              <div className="col bg-light rounded m-1">
              <center>
                  <div>
                    <h4 className='mt-2'>{vaccinationCoverage} {vaccinationCoverage !== vaccinationCoverage2 && <span className='text-secondary'><span className='text-success'>/</span> {vaccinationCoverage2}</span>}</h4>
                    <p className='text-secondary'>Vaccination Coverage</p>
                  </div>
                </center>
              </div>
            </div>
            <div className="row text-dark">
              <div className="col bg-light rounded my-1">
              <center>
                  <div>
                    <h2 className='mt-2'>{activeCases} {activeCases !== activeCases2 && <span className='text-secondary'><span className='text-success'>/</span> {activeCases2}</span>}</h2>
                    <p className='text-secondary'>Active cases</p>
                  </div>
                </center>
              </div>
              <div className="col bg-light rounded m-1">
              <center>
                  <div>
                    <h2 className='mt-2'>{chronicCases} {chronicCases !== chronicCases2 && <span className='text-secondary'><span className='text-success'>/</span> {chronicCases2}</span>} </h2>
                    <p className='text-secondary'>Chronic cases</p>
                  </div>
                </center>
              </div> 
            </div>
            <div className="row mt-2">
              <div className="col  bg-light rounded">
              <RegistrationChart   data={filteredData} />
              </div>
            </div>
            <div className="row mt-2">
            <div id='chart2' className="col bg-light rounded">
            {filteredData.length > 0 ? (
                  <GenderChart data={filteredData} />
                ):(
                  <div className='mt-5 p-5'><h3>No data found</h3></div>
                )}
              </div>
            </div>

            <div className="row mt-2">
            <div id='chart3' className="col bg-light rounded">
                
                {filteredData.length > 0 ? (
                  <VaccinationChart data={filteredData} />
                ):(
                  <div className='mt-5 p-5'><h3>No data found</h3></div>
                )}
              </div>
            </div>

            <div className="row mt-2">
            <div id='chart4' className="col bg-light rounded">
                
                {filteredData.length > 0 ? (
                  <StageBarChart data={filteredData} />
                ):(
                  <div className='mt-5 p-5'><h3>No data found</h3></div>
                )}
              </div>
            </div>

            <div className="row mt-2">
            <div id='chart5' className="col bg-light rounded ">
                
                {filteredData.length > 0 ? (
                  <TopRegionsBarChart data={filteredData} />
                ):(
                  <div className='mt-5 p-5'><h3>No data found</h3></div>
                )}
              </div>
            </div>

              <div className="row mt-2">
                <div className="col">
                   <TanzaniaHeatMap2 data={filteredData} />
                </div>
              </div>
             
          
            
          </div>
          <div className="col rounded mx-3 visuals">
            <div style={{ height: '90px' }} className="row text-dark">
              <div className="col bg-light rounded ">
                <center>
                  <div><h2 className='mt-2'>{totalPatients} {totalPatients !== total2 && <span className='text-secondary'><span className='text-success'>/</span> {total2}</span>}</h2>
                    <p className='text-secondary'>Registered</p> </div>
                </center>
              </div>
              <div className="col bg-light rounded mx-1">
                <center>
                  <div>
                    <h4 className='mt-2'>{vaccinationCoverage} {vaccinationCoverage !== vaccinationCoverage2 && <span className='text-secondary'><span className='text-success'>/</span> {vaccinationCoverage2}</span>}</h4>
                    <p className='text-secondary'>Vaccination Coverage</p>
                  </div>
                </center>
              </div>
              <div className="col bg-light rounded mx-1">
                <center>
                  <div>
                    <h2 className='mt-2'>{activeCases} {activeCases !== activeCases2 && <span className='text-secondary'><span className='text-success'>/</span> {activeCases2}</span>}</h2>
                    <p className='text-secondary'>Active cases</p>
                  </div>
                </center>
              </div>
              <div className="col bg-light rounded">
                <center>
                  <div>
                    <h2 className='mt-2'>{chronicCases} {chronicCases !== chronicCases2 && <span className='text-secondary'><span className='text-success'>/</span> {chronicCases2}</span>} </h2>
                    <p className='text-secondary'>Chronic cases</p>
                  </div>
                </center>
              </div>
            </div>
                                     
            <div style={{ height: '400px' }} className="row my-2">
              <div id='chart1' className="col bg-light rounded p-2">
                <center>{filteredData.length > 0 ? (
                  <RegistrationChart   data={filteredData} />
                ):(
                  <div className='mt-5 p-5'><h3>No data found</h3></div>
                )}</center>
              </div>
              
            </div>
            
            <div style={{ height: '400px' }} className="row mt-3">
            <div id='chart2' className="col bg-light rounded mx-1">
            {filteredData.length > 0 ? (
                  <GenderChart data={filteredData} />
                ):(
                  <div className='mt-5 p-5'><h3>No data found</h3></div>
                )}
              </div>
              <div id='chart3' className="col bg-light rounded">
                
                {filteredData.length > 0 ? (
                  <VaccinationChart data={filteredData} />
                ):(
                  <div className='mt-5 p-5'><h3>No data found</h3></div>
                )}
              </div>
              
            </div>
            
            <div style={{ height: '400px' }} className="row mt-4">
            <div id='chart4' className="col bg-light rounded mx-1">
                
                {filteredData.length > 0 ? (
                  <StageBarChart data={filteredData} />
                ):(
                  <div className='mt-5 p-5'><h3>No data found</h3></div>
                )}
              </div>
              <div id='chart5' className="col bg-light rounded ">
                
                {filteredData.length > 0 ? (
                  <TopRegionsBarChart data={filteredData} />
                ):(
                  <div className='mt-5 p-5'><h3>No data found</h3></div>
                )}
              </div>
              
            </div>
          <br />
            <div style={{ height: '400px' }} className="row mt-4">
             
              <div id='chart6' className="col bg-light rounded">
               
               {filteredData.length > 0 ? (
                  <TanzaniaHeatMap data={filteredData} />
               ):(
                 <div className='mt-5 p-5'><h3>No data found</h3></div>
               )}
             </div>
              </div>
            <br /> 
          </div>
        </div>
      </div>)}
    </div>
  )
};

export default Dashboard;
