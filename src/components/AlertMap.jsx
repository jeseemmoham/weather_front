import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import SeverityBadge from './SeverityBadge';

const severityColors = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#f59e0b',
  low: '#22c55e',
};

const severityRadius = {
  critical: 14,
  high: 12,
  medium: 10,
  low: 8,
};

export default function AlertMap({ alerts = [], height = '400px' }) {
  const [center, setCenter] = useState([39.8283, -98.5795]); // US center
  const [zoom, setZoom] = useState(4);

  // Auto-center on first valid alert
  useEffect(() => {
    const validAlerts = alerts.filter(a =>
      a.location?.coordinates &&
      a.location.coordinates[0] !== 0 &&
      a.location.coordinates[1] !== 0
    );

    if (validAlerts.length > 0) {
      const first = validAlerts[0];
      setCenter([first.location.coordinates[1], first.location.coordinates[0]]);
      setZoom(validAlerts.length === 1 ? 10 : 5);
    }
  }, [alerts]);

  const validAlerts = alerts.filter(a =>
    a.location?.coordinates &&
    a.location.coordinates[0] !== 0 &&
    a.location.coordinates[1] !== 0
  );

  return (
    <div style={{
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid rgba(148, 163, 184, 0.1)',
    }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height, width: '100%' }}
        scrollWheelZoom={true}
        key={`${center[0]}-${center[1]}-${zoom}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {validAlerts.map((alert) => (
          <CircleMarker
            key={alert._id}
            center={[alert.location.coordinates[1], alert.location.coordinates[0]]}
            radius={severityRadius[alert.severity] || 10}
            pathOptions={{
              color: severityColors[alert.severity] || '#94a3b8',
              fillColor: severityColors[alert.severity] || '#94a3b8',
              fillOpacity: 0.35,
              weight: 2,
            }}
          >
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <SeverityBadge severity={alert.severity} size="sm" />
                </div>
                <h4 style={{ margin: '0 0 6px', fontSize: '0.9rem', fontWeight: 600 }}>
                  {alert.title}
                </h4>
                <p style={{ margin: '0 0 6px', fontSize: '0.8rem', opacity: 0.8, lineHeight: 1.5 }}>
                  {alert.description?.slice(0, 120)}...
                </p>
                <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                  📍 ZIP: {alert.zipCode}
                  {alert.location.city && ` • ${alert.location.city}`}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
