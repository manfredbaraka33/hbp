import React from "react";
import Plot from "react-plotly.js";

const StageBarChart = ({ data }) => {
  if (!Array.isArray(data)) return <p>Loading or no data available.</p>;
  const stageCounts = data.reduce((acc, p) => {
    acc[p.hepatitis_b_stage] = (acc[p.hepatitis_b_stage] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ width: "100%", height: "100%", maxHeight: "400px" }}>
        <Plot
      data={[{
        type: "bar",
        x: Object.keys(stageCounts),
        y: Object.values(stageCounts)
      }]}
      layout={{autosize: true,
        responsive:true,
        title:{text:"Hepatitis B Stage"},
        margin: { l: 40, r: 20, t: 100, b: 40 },
        yaxis: {
          title: {text:"Patients"},
          tickformat: ",d",   // comma-separated integers
        }}}
        useResizeHandler={true}
        config={{ responsive: true }}
        style={{ width: "100%", height: "100%" }}
        
    />
    </div>
  
  );
};

export default StageBarChart;
