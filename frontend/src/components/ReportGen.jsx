import React, { useState,useRef } from 'react';
import axios from 'axios';
import { getData, postData } from '../helpers/axios';
import html2pdf from 'html2pdf.js';
import { FaCopy, FaDownload } from 'react-icons/fa';

const ReportGen = () => {
 
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const reportRef = useRef();

  const generateReport = async () => {
    try {
        setLoading(true);
      const response = await getData("report-gen/");
      console.log(response);
      setResult(response.result);
    } catch (error) {
      setResult("Error: " + error.response?.data?.error || "Something went wrong");
      alert("Opps, Something went wrong")
    }finally{
        setLoading(false);
    }
  };


  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    alert("Report copied to clipboard!");
  };

  const handleDownloadPDF = () => {
    const opt = {
      margin: 0.5,
      filename: 'hepatitis_b_monthly_report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(reportRef.current).save();
  };


  return (
    <div className="p-4 max-w-xl mx-auto">

      <h3 className='mt-4'>Feature coming soon!</h3>
      {/* <h2 className="text-xl mb-2 font-bold">Generate Report</h2>

      <button type="submit" className="btn btn-secondary" onClick={generateReport} disabled={loading}>
            {loading ? <div className="mt-3 text-center">
                <div className="spinner-grow text-light" role="status"></div>
                <div className="spinner-grow text-danger" role="status"></div>
                <div className="spinner-grow text-success" role="status"></div>
                <div className="spinner-grow text-info" role="status"></div>
                <p>Genearating report ...</p>
            </div> : "Generate Report"}
          </button>
        {result  && <div className="mt-4">
        <strong>Result:</strong>
        
        <div ref={reportRef}  className="mt-4 bg-light text-dark p-3 rounded" style={{ whiteSpace: 'pre-wrap' }}>
          <div className="mt-3 btn-group">
        <button className="btn btn-sm btn-outline-dark" onClick={handleCopy}><FaCopy /></button>
        <button className="btn btn-sm btn-outline-dark" onClick={handleDownloadPDF}><FaDownload /></button>
         </div>
          {result.output}
          </div>
      </div>} */}
    </div>
  );
};

export default ReportGen;
