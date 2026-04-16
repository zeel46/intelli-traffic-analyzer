import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* HERO SECTION */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem', textAlign: 'center' }}>
          Smart Traffic Analyzer
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#475569', marginBottom: '3rem', textAlign: 'center', maxWidth: '600px', lineHeight: '1.6' }}>
          Monitor your website traffic with precision and ease. Advanced analytics for modern businesses.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '400px' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '1rem', fontSize: '1.1rem', borderRadius: '12px' }}>
            Get Started
          </Link>
          <Link to="/login" className="btn btn-white" style={{ padding: '1rem', fontSize: '1.1rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            Sign In
          </Link>
        </div>

        {/* 3 FEATURE CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '5rem', width: '100%', maxWidth: '1000px' }}>
          
          <div className="white-panel" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
            <h3 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '0.75rem' }}>Real-time Analytics</h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Track your traffic in real-time with detailed insights</p>
          </div>

          <div className="white-panel" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
            <h3 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '0.75rem' }}>Secure & Reliable</h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Enterprise-grade security for your data</p>
          </div>

          <div className="white-panel" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
            <h3 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '0.75rem' }}>Lightning Fast</h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Instant reports with minimal latency</p>
          </div>

        </div>
      </main>

    </div>
  );
};

export default Home;
