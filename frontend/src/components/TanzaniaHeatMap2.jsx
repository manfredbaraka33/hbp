import L from 'leaflet';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { MapContainer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import TanzaniaLegend from './TanzaniaLegend';
import TanzaniaLegend2 from '../components/TanzaniaLegend2';

const TanzaniaHeatMap2 = ({ data }) => {
  const [geoJson, setGeoJson] = useState(null);
  const mapRef = useRef(null);
  const geoJsonLayerRef = useRef(null);

  // Load the GeoJSON for Tanzania regions once
  useEffect(() => {
    const fetchGeoJson = async () => {
      try {
        const res = await fetch('/tanzania_regions.geojson');
        const json = await res.json();
        setGeoJson(json);
      } catch (err) {
        console.error('Failed to load GeoJSON:', err);
      }
    };
    fetchGeoJson();
  }, []);

  // Function to return color based on count thresholds
  const getColor = (count) => {
    return count > 100 ? '#800026' :
           count > 50  ? '#BD0026' :
           count > 20  ? '#E31A1C' :
           count > 10  ? '#FC4E2A' :
           count > 5   ? '#FD8D3C' :
           count > 0   ? '#FEB24C' :
                         '#FFEDA0';
  };

  // Calculate counts of patients per region, memoized for performance
  const regionCounts = useMemo(() => {
    const counts = {};
    data?.forEach((item) => {
      const region = item.region?.trim();
      if (region) {
        counts[region] = (counts[region] || 0) + 1;
      }
    });
    return counts;
  }, [data]);

  // Set style and popup for each region feature on initial load
  const onEachFeature = (feature, layer) => {
    const name = feature.properties.shapeName;
    const count = regionCounts[name] || 0;
    layer.setStyle({
      fillColor: getColor(count),
      weight: 1,
      color: '#333',
      fillOpacity: 0.8,
    });
    layer.bindPopup(`<strong>${name}</strong><br/>Patients: ${count}`);
    layer.bindTooltip(name, { permanent: false, direction: 'center' });
  };

  // Fit map bounds once GeoJSON loads
  useEffect(() => {
    if (geoJson && mapRef.current && geoJsonLayerRef.current) {
      const bounds = geoJsonLayerRef.current.getBounds();
      mapRef.current.fitBounds(bounds);
    }
  }, [geoJson]);

  // Update region colors and popups dynamically when data changes
  useEffect(() => {
    if (!geoJsonLayerRef.current) return;

    geoJsonLayerRef.current.eachLayer((layer) => {
      const name = layer.feature.properties.shapeName;
      const count = regionCounts[name] || 0;

      layer.setStyle({
        fillColor: getColor(count),
        weight: 1,
        color: '#333',
        fillOpacity: 0.8,
      });

      layer.bindPopup(`<strong>${name}</strong><br/>Patients: ${count}`);
      layer.bindTooltip(name, { permanent: false, direction: 'center' });
    });
  }, [regionCounts]);

  // Add legend to the map
  useEffect(() => {
    if (!mapRef.current) return;

    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'legend bg-white p-3 rounded shadow-sm border');
      const grades = [0, 5, 10, 20, 50, 100];
      const labels = ['<strong>Patients</strong><br>'];

      for (let i = 0; i < grades.length; i++) {
        const from = grades[i];
        const to = grades[i + 1];

        labels.push(
          `<i style="background:${getColor(from + 1)};width:18px;height:18px;display:inline-block;margin-right:8px;border:1px solid #ccc"></i> 
          ${from}${to ? '&ndash;' + to : '+'}`
        );
      }

      div.innerHTML = labels.join('<br>');
      return div;
    };

    legend.addTo(mapRef.current);

    return () => {
      legend.remove();
    };
  }, [regionCounts]);

  return (
    <div
      className="container rounded"
      style={{
        width: '100%',
        minHeight: '400px',
        backgroundColor: '#fff',
        padding: '1rem',
        boxSizing: 'border-box'
      }}
    >
      <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Patient Distribution Across Tanzania</h3>
      <MapContainer
        style={{
          width: '100%',
          height: 'calc(100vh - 150px)',
          minHeight: '400px'
        }}
        zoom={6}
        center={[-6.369028, 34.888822]}
        zoomControl={true}
        config={{ responsive: true }}
        useResizeHandler={true}
        attributionControl={false}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
      >
        {geoJson && (
          <GeoJSON
            data={geoJson}
            onEachFeature={onEachFeature}
            ref={(layer) => {
              geoJsonLayerRef.current = layer;
            }}
          />
        )}
         <TanzaniaLegend2 /> 
      </MapContainer>
    </div>
  );
};

export default TanzaniaHeatMap2;
