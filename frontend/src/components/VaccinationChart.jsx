// import React from "react";
// import Plot from "react-plotly.js";

// const VaccinationChart = ({ data }) => {
//   if (!Array.isArray(data)) return <p>Loading or no data available.</p>;
//   const vaccinated = data.filter(p => p.vaccination_status).length;
//   const notVaccinated = data.length - vaccinated;

//   return (
//     <Plot
//       data={[{
//         type: "pie",
//         labels: ["Vaccinated", "Not Vaccinated"],
//         values: [vaccinated, notVaccinated]
//       }]}
//       layout={{width:470,height:410,title:{text:"Vaccination Status"}}}
//     />
//   );
// };

// export default VaccinationChart;


import React from "react";
import Plot from "react-plotly.js";

const VaccinationChart = ({ data }) => {
  if (!Array.isArray(data)) return <p>Loading or no data available.</p>;

  const vaccinated = data.filter(p => p.vaccination_status).length;
  const notVaccinated = data.length - vaccinated;

  return (
    <div style={{ width: "100%", height: "100%", maxHeight: "400px" }}>
      <Plot
        data={[
          {
            type: "pie",
            labels: ["Yes", "No"],
            values: [vaccinated, notVaccinated],
            textinfo: "label+percent",
            insidetextorientation: "radial",
          },
        ]}
        layout={{
          autosize: true,
          title: { text: "Vaccination Status" },
          margin: { l: 20, r: 20, t: 50, b: 20 },
        }}
        config={{ responsive: true }}
        useResizeHandler={true}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default VaccinationChart;

