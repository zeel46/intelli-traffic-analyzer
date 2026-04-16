import React, { useState } from 'react';
import api from '../services/api';

const AddWebsite = () => {
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [trackingCode, setTrackingCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/websites', { websiteName: name, domain });
      const siteId = res.data.apiKey;
      const code = `<script src="http://localhost:5000/tracker.js" data-key="${siteId}"></script>`;
      setTrackingCode(code);
      setLoading(false);
      
    } catch (err) {
      setError('Failed to add website. Try again.');
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackingCode);
    alert('Tracking code copied to clipboard!');
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '800px', padding: '2rem 1rem', margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '2rem' }}>Add New Website</h2>

      <div className="glass-panel">
        {!trackingCode ? (
          <form onSubmit={handleSubmit}>
            {error && <div style={{ color: '#fca5a5', marginBottom: '1rem' }}>{error}</div>}
            
            <div className="input-group">
              <label className="input-label" htmlFor="name">Website Name</label>
              <input 
                type="text" 
                id="name"
                className="input-field" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Awesome Blog"
                required 
              />
            </div>
            
            <div className="input-group">
              <label className="input-label" htmlFor="domain">Domain</label>
              <input 
                type="text" 
                id="domain"
                className="input-field" 
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="example.com"
                required 
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Tracking Code'}
            </button>
          </form>
        ) : (
          <div className="animate-fade-in">
            <h3 style={{ color: '#10b981', marginBottom: '1rem' }}>Website Added Successfully!</h3>
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
              Copy the following code and paste it right before the closing <code>&lt;/head&gt;</code> tag on your website to start tracking.
            </p>
            
            <div style={{ position: 'relative', marginBottom: '2rem' }}>
              <pre style={{ 
                background: 'rgba(0,0,0,0.3)', 
                padding: '1.5rem', 
                borderRadius: '8px', 
                overflowX: 'auto',
                color: '#e2e8f0',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <code>{trackingCode}</code>
              </pre>
              <button 
                onClick={copyToClipboard}
                className="btn btn-outline"
                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
              >
                Copy
              </button>
            </div>
            
            <button onClick={() => setTrackingCode('')} className="btn btn-outline">
              Add Another Website
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddWebsite;
