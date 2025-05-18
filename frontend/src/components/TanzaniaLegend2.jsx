import React from 'react';

const grades = [0, 5, 10, 20, 50, 100];
const colors = ['#FFEDA0', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026'];

const TanzaniaLegend = () => {
  return (
    <div
      className="bg-white p-3 rounded shadow-sm border"
      style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        zIndex: 1000,
        maxWidth: '240px',
        width: '70%',
        fontSize: '14px',
        fontWeight: 600,
        boxSizing: 'border-box',
      }}
    >
      <h5 style={{ marginBottom: '10px', fontSize: '15px' }}>Patients</h5>
      {grades.map((grade, index) => {
        const nextGrade = grades[index + 1];
        const color = colors[index];
        return (
          <div
            key={grade}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '6px',
            }}
          >
            <div
              style={{
                backgroundColor: color,
                width: '18px',
                height: '18px',
                marginRight: '10px',
                border: '1px solid #999',
              }}
            />
            <span>
              {grade}
              {nextGrade ? ` – ${nextGrade}` : '+'}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default TanzaniaLegend;
