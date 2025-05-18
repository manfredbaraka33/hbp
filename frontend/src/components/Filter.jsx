import React from 'react'
import { FaFilter, FaCalendarAlt, FaFemale,FaMale, FaSortNumericUpAlt } from 'react-icons/fa'
import { FaLocationPin } from 'react-icons/fa6'

const Filter = ({filters,handleDateChange,clearDates,setFilters}) => {
  return (
              <div className="bg-light text-dark rounded p-3">
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
  )
}

export default Filter