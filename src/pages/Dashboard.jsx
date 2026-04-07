import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useAlerts } from '../context/AlertContext';
import AlertList from '../components/AlertList';
import AlertMap from '../components/AlertMap';
import ZipCodeForm from '../components/ZipCodeForm';
import { AlertTriangle, CloudLightning, Waves, Mountain, Radio, TrendingUp, MapPin, RefreshCw } from 'lucide-react';

const statCards = [
  { key: 'total', label: 'Total Alerts', icon: <AlertTriangle size={20} />, color: '#3b82f6', gradient: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(59,130,246,0.03))' },
  { key: 'critical', label: 'Critical', icon: <AlertTriangle size={20} />, color: '#ef4444', gradient: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.03))' },
  { key: 'high', label: 'High', icon: <TrendingUp size={20} />, color: '#f97316', gradient: 'linear-gradient(135deg, rgba(249,115,22,0.12), rgba(249,115,22,0.03))' },
  { key: 'medium', label: 'Medium', icon: <CloudLightning size={20} />, color: '#f59e0b', gradient: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.03))' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { alerts, allAlerts, loading, connected, stats, fetchAlerts } = useAlerts();

  return (
    <div className="page-wrapper" style={{ paddingBottom: '60px' }}>
      <div className="container">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '32px', paddingTop: '24px', flexWrap: 'wrap', gap: '16px',
          }}
        >
          <div>
            <h1 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700,
              marginBottom: '6px',
            }}>
              Dashboard
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={15} />
              Alerts for ZIP code <strong style={{ color: '#38bdf8' }}>{user?.zipCode || '—'}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Live indicator */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 16px', borderRadius: '9999px',
              background: connected ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
              border: `1px solid ${connected ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
              fontSize: '0.82rem', fontWeight: 500,
              color: connected ? '#22c55e' : '#ef4444',
            }}>
              <span className="pulse-dot" style={{
                width: '8px', height: '8px',
                background: connected ? '#22c55e' : '#ef4444',
              }} />
              {connected ? 'Live Connected' : 'Reconnecting...'}
            </div>

            {/* Refresh button */}
            <button
              onClick={fetchAlerts}
              className="btn btn-secondary btn-sm"
              style={{ padding: '8px 14px' }}
              title="Refresh alerts"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid-4" style={{ marginBottom: '28px' }}>
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              style={{
                background: stat.gradient,
                border: `1px solid ${stat.color}20`,
                borderRadius: '16px',
                padding: '22px',
                display: 'flex', alignItems: 'center', gap: '16px',
              }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: `${stat.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: stat.color, flexShrink: 0,
              }}>
                {stat.icon}
              </div>
              <div>
                <div style={{
                  fontSize: '1.5rem', fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700, color: '#f1f5f9',
                }}>
                  {stats[stat.key]}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '24px',
          alignItems: 'start',
        }} className="dashboard-grid">
          {/* Left Column — Alert List */}
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '16px',
            }}>
              <h2 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.2rem',
                fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <Radio size={18} color="#3b82f6" />
                Active Alerts
              </h2>
              <span style={{
                fontSize: '0.78rem', color: '#64748b',
                padding: '4px 12px', borderRadius: '8px',
                background: 'rgba(100, 116, 139, 0.1)',
              }}>
                {alerts.length} alert{alerts.length !== 1 ? 's' : ''}
              </span>
            </div>
            <AlertList alerts={alerts} loading={loading} />
          </div>

          {/* Right Column — Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* ZIP Code Widget */}
            <ZipCodeForm />

            {/* Map */}
            <div>
              <h3 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1rem', fontWeight: 600,
                marginBottom: '12px',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <MapPin size={16} color="#8b5cf6" />
                Alert Map
              </h3>
              <AlertMap alerts={allAlerts.length > 0 ? allAlerts : alerts} height="320px" />
            </div>

            {/* Alert Type Summary */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              borderRadius: '16px',
              padding: '20px',
            }}>
              <h3 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '0.95rem', fontWeight: 600,
                marginBottom: '14px',
              }}>
                Alert Types
              </h3>
              {[
                { type: 'weather', icon: <CloudLightning size={16} />, color: '#38bdf8', label: 'Weather' },
                { type: 'flood', icon: <Waves size={16} />, color: '#06b6d4', label: 'Flood' },
                { type: 'earthquake', icon: <Mountain size={16} />, color: '#a78bfa', label: 'Earthquake' },
                { type: 'emergency', icon: <AlertTriangle size={16} />, color: '#fb7185', label: 'Emergency' },
              ].map((item) => {
                const count = alerts.filter(a => a.type === item.type).length;
                return (
                  <div key={item.type} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px', borderRadius: '10px',
                    marginBottom: '4px',
                    background: count > 0 ? `${item.color}08` : 'transparent',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: item.color }}>
                      {item.icon}
                      <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{item.label}</span>
                    </div>
                    <span style={{
                      fontSize: '0.85rem', fontWeight: 600,
                      color: count > 0 ? item.color : '#475569',
                    }}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
