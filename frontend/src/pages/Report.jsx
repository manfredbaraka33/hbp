import React from 'react'
import Navbar from '../components/Navbar'
import SmartQuery from '../components/SmartQuery'
import ReportGen from '../components/ReportGen'

const Report = () => {
  return (
    <div style={{height:"1200px"}} className='mt-5 conatiner bg-dark text-light'>
        <Navbar />
        <br />
         <br />   
      <div className="d-flex justify-content-center">
        <ul className="nav nav-tabs mb-3 d-inline-flex" id="inputTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button className="nav-link active" id="smartquery-tab" data-bs-toggle="tab" data-bs-target="#smartquery" type="button" role="tab">
              Smart Query
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="reportgen-tab" data-bs-toggle="tab" data-bs-target="#reportgen" type="button" role="tab">
              Generate Report
            </button>
          </li>
        </ul>
      </div>


      <div className="tab-content" id="inputTabContent">

      <div className="tab-pane fade show active" id="smartquery" role="tabpanel" aria-labelledby="smartquery-tab">
        <center>
          
         <SmartQuery />
         </center>
        </div>

        <div className="tab-pane fade show" id="reportgen" role="tabpanel" aria-labelledby="reportgen-tab">
        <center>
          
         <ReportGen /> 
         </center>
        </div>

      </div>

        </div>
  )
}

export default Report
