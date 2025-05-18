import React from "react";
import Plot from "react-plotly.js";

const GenderChart = ({ data }) => {
  if (!Array.isArray(data)) return <p>Loading or no data available.</p>;

  const genderCounts = data.reduce((acc, p) => {
    acc[p.gender] = (acc[p.gender] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ width: "100%", height: "100%", maxHeight: "400px" }}>
      <Plot
        data={[
          {
            type: "pie",
            labels: Object.keys(genderCounts),
            values: Object.values(genderCounts),
            textinfo: "label+percent",
            insidetextorientation: "radial",
          },
        ]}
        layout={{
          autosize: true,
          title: { text: "Gender Distribution" },
          margin: { l: 20, r: 20, t: 50, b: 20 },
        }}
        config={{ responsive: true }}
        useResizeHandler={true}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default GenderChart;

