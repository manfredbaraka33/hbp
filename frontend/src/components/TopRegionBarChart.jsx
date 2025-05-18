import React from "react";
import Plot from "react-plotly.js";

const TopRegionsBarChart = ({ data }) => {
if (!Array.isArray(data)) return <p>Loading or no data available.</p>;
  const regionCounts = data.reduce((acc, p) => {
    acc[p.region] = (acc[p.region] || 0) + 1;
    return acc;
  }, {});

  const sorted = Object.entries(regionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const regions = sorted.map(([region]) => region);
  const counts = sorted.map(([_, count]) => parseInt(count));

  return (
    <div style={{ width: "100%", height: "100%", maxHeight: "400px" }}>
       <Plot
      data={[
        {
          x: counts,
          y: regions,
          type: "bar",
          orientation: "h",
          marker: { color: "orange" },
        },
      ]}
      layout={{
        title:{text:"Top 10 Regions by Case Count"},
        yaxis: { automargin: true,
            autorange: "reversed",
         },
         xaxis:{
          title:{text:"Patient count"},
          tickformat: ",d",
            
         },
         margin: { l: 20, r: 20, t: 100, b: 60 },
      }}

      config={{ responsive: true }}
      style={{ width: "100%", height:390 }}
      useResizeHandler={true}
    />
    </div>
   
  );
};

export default TopRegionsBarChart;
