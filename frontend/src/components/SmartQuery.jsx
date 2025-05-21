import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { postData } from '../helpers/axios';

const SmartQuery = () => {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [fullText, setFullText] = useState("");
  const [displayedText, setDisplayedText] = useState("");



  const askQuestion = async () => {
    try {
        setLoading(true);
      const response = await postData("genai-query/", { question });
      console.log("Here is the resp",response);
      setResult(response.result);
      setFullText(response.result); // this triggers the animation
setDisplayedText(""); // clear previous output

    } catch (error) {
      setResult("Something went wrong");
    }finally{
        setLoading(false);
    }
  };

  useEffect(() => {
  let index = 0;
  const interval = setInterval(() => {
    if (index < fullText.length) {
      setDisplayedText(prev => prev + fullText[index]);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 30); // typing speed in ms

  return () => clearInterval(interval);
}, [fullText]);


  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl mb-2 font-bold">Ask Smart Health Query</h2>
      <div className="row my-3">
        <center>
        <div className="col-10 p-4">
        <textarea
        type="text"
          rows="8"
          
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="form-control"
        placeholder="e.g., How many male patients are not vaccinated?"
      />
        </div>
        </center>
      </div>
      
      <button type="submit" className="btn btn-secondary" onClick={askQuestion} disabled={loading}>
            {loading ? <div className="mt-3 text-center">
                <div className="spinner-grow text-parimary" role="status"></div>
                <div className="spinner-grow text-warning" role="status"></div>
                <div className="spinner-grow text-dark" role="status"></div>
                <div className="spinner-grow text-success" role="status"></div>
               
            </div> : "Ask"}
          </button>
        {result && <div className="mt-4 p-4">
        {/* <h4>Answer:</h4> */}
        <p style={{direction:"ltr"}}>{result}</p>

      </div>}
      <div>
        {fullText && <div>
          {fullText}
        </div>}
      </div>
    </div>
  );
};

export default SmartQuery;
