

import React from "react";
import Plot from "react-plotly.js";
import dayjs from "dayjs";

const RegistrationTrendChart = ({ data }) => {
  if (!Array.isArray(data)) return <p>Loading or no data available.</p>;

  const grouped = data.reduce((acc, curr) => {
    const date = dayjs(curr.registration_date).format("YYYY-MM-DD");
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();
  const counts = sortedDates.map(date => parseInt(grouped[date]));

  return (
    <div style={{ width: "100%", height: "100%", maxHeight: "400px" }}>
      <Plot
        data={[
          {
            x: sortedDates,
            y: counts,
            type: "scatter",
            mode: "lines+markers",
            marker: { color: "blue" }
          }
        ]}
        layout={{
          autosize: true,
          responsive: true,
          title: { text: "Registration Trend" },
          yaxis: {
            title: { text: "Registrations" },
            tickformat: ",d"
          },
          margin: { l: 50, r: 30, b: 50, t: 100 },
        }}
        config={{ responsive: true }}
        style={{ width: "100%", height:390 }}
        useResizeHandler={true}
      />
    </div>
  );
};

export default RegistrationTrendChart;
