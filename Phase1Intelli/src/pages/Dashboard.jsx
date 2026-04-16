import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TrafficChart from '../components/TrafficChart';
import api from '../services/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const UserDistributionChart = ({ distribution }) => {
  const data = {
    labels: ['Normal Users', 'Bot Traffic', 'Suspicious'],
    datasets: [{
      data: [distribution.normal, distribution.bot, distribution.suspicious],
      backgroundColor: ['#3b82f6', '#10b981', '#ef4444'], // Blue, Green, Red
      borderWidth: 0,
    }],
  };
  const options = {
    cutout: '60%',
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (context) => ` ${context.label}: ${context.raw} visits` } }
    }
  };
  return (
    <div style={{ width: '200px', height: '200px', margin: '0 auto', position: 'relative' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

const Dashboard = () => {
  const [websites, setWebsites] = useState([]);
  const [selectedWebsite, setSelectedWebsite] = useState(null);
  const [trafficData, setTrafficData] = useState([]);
  const [aiDistribution, setAiDistribution] = useState({ normal: 1, bot: 1, suspicious: 1, normalPct: 100, botPct: 0, suspiciousPct: 0 });
  const [recentAnomalies, setRecentAnomalies] = useState([]);
  const [predictedNextHour, setPredictedNextHour] = useState(0);
  const [healthScore, setHealthScore] = useState(100);
  const [loading, setLoading] = useState(true);
  const [blockedIPs, setBlockedIPs] = useState(new Set());
  const navigate = useNavigate();

  const userName = localStorage.getItem('user_name') || 'Admin User';
  const initials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/websites');
        setWebsites(res.data);
        if (res.data.length > 0) setSelectedWebsite(res.data[0]._id);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (selectedWebsite) {
      const fetchTraffic = async () => {
        try {
          const res = await api.get(`/analytics/${selectedWebsite}`);
          const traffic = res.data.visitsPerHour || [];
          setTrafficData(traffic.map(t => ({ time: t.hour, visits: t.count })));
          
          setWebsites(prev => prev.map(w => w._id === selectedWebsite ? { ...w, totalVisits: res.data.totalVisits || 0 } : w));
          
          if (res.data.aiDistribution) {
             let normal = 0, bot = 0, suspicious = 0, total = 0;
             res.data.aiDistribution.forEach(d => {
                if (d._id === 'normal') normal = d.count;
                if (d._id === 'bot') bot = d.count;
                if (d._id === 'suspicious') suspicious = d.count;
                total += d.count;
             });
             if (total > 0) {
                 setAiDistribution({
                     normal: normal,
                     bot: bot,
                     suspicious: suspicious,
                     normalPct: ((normal/total)*100).toFixed(1),
                     botPct: ((bot/total)*100).toFixed(1),
                     suspiciousPct: ((suspicious/total)*100).toFixed(1)
                 });
             }
          }
          setPredictedNextHour(res.data.predictedNextHour || 0);
          setHealthScore(res.data.healthScore ?? 100);
          setRecentAnomalies(res.data.recentAnomalies || []);
        } catch (err) { }
      };
      fetchTraffic();
    }
  }, [selectedWebsite]);

  const handleBlock = async (ip) => {
    try {
      await api.post(`/websites/${selectedWebsite}/block`, { ip });
      setBlockedIPs(prev => {
        const next = new Set(prev);
        next.add(ip);
        return next;
      });
      alert(`IP ${ip} blocked!`);
    } catch (err) { alert('Failed to block IP.'); }
  };

  const activeWebsiteInfo = websites.find(w => w._id === selectedWebsite);

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <span style={{color: '#10b981'}}>ılı</span> Shop
        </div>
        <div className="sidebar-nav">
          <a href="#" className="sidebar-link active">Dashboard</a>
          <a href="/add-website" className="sidebar-link">Add Website</a>
          <a href="#" className="sidebar-link">Reports</a>
          <a href="#" className="sidebar-link">Documents</a>
          <a href="#" className="sidebar-link">Notification</a>
          <a href="#" className="sidebar-link">Profile</a>
          <a href="#" className="sidebar-link">Settings</a>
        </div>
        <div style={{ background: '#fdf6b2', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', marginTop: '2rem' }}>
          <h4 style={{ color: '#854d0e', marginBottom: '0.5rem' }}>Upgrade to Pro</h4>
          <p style={{ fontSize: '0.75rem', color: '#a16207', marginBottom: '1rem' }}>get all features</p>
          <button style={{ background: '#eab308', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Upgrade Now</button>
        </div>
        <button 
          onClick={() => { localStorage.removeItem('token'); navigate('/'); }} 
          style={{ marginTop: '1rem', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Log Out
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="dashboard-main">
        {/* HEADER */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {websites.length > 0 && (
              <select value={selectedWebsite || ''} onChange={(e) => setSelectedWebsite(e.target.value)} className="input-field" style={{ width: 'auto', background: 'white' }}>
                {websites.map(site => <option key={site._id} value={site._id}>{site.websiteName}</option>)}
              </select>
            )}
            <input type="text" className="dashboard-search" placeholder="Search" />
            <div className="user-chip">
              <div style={{ background: '#6366f1', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{initials}</div>
              <div style={{ lineHeight: '1.2' }}>
                <div style={{ fontWeight: '600' }}>{userName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted-text)' }}>Admin</div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading dashboard...</div>
        ) : websites.length === 0 ? (
          <div className="white-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>No websites tracking yet</h3>
            <a href="/add-website" className="btn btn-primary">Add Website</a>
          </div>
        ) : (
          <>
            {/* 4 STAT CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="stat-card">
                <div className="stat-card-title">Total Visitors</div>
                <div className="stat-card-value">{(activeWebsiteInfo?.totalVisits || 0).toLocaleString()}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>Total tracked</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-title">Traffic Health</div>
                <div className="stat-card-value">{healthScore}%</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>Anomaly Free</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-title">Predicted (Next Hr)</div>
                <div className="stat-card-value">{predictedNextHour}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>Expected Visitors</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-title">Bot Traffic</div>
                <div className="stat-card-value">{aiDistribution.botPct}%</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>Of Total Traffic</div>
              </div>
            </div>

            {/* MIDDLE CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              {/* Traffic Chart */}
              <div className="white-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ color: 'var(--dark-text)' }}>Traffic Analysis <span style={{ fontSize: '0.875rem', color: 'var(--muted-text)', fontWeight: 'normal' }}>Weekly</span></h3>
                </div>
                <TrafficChart data={trafficData} />
              </div>

              {/* Distribution */}
              <div className="white-panel">
                <h3 style={{ color: 'var(--dark-text)', marginBottom: '1rem' }}>Traffic Distribution</h3>
                <UserDistributionChart distribution={aiDistribution} />
                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                   <div style={{display:'flex', gap:'0.5rem', alignItems:'center'}}><div style={{width:'10px', height:'10px', background:'#3b82f6', borderRadius:'50%'}}></div> Normal Users</div>
                   <div style={{display:'flex', gap:'0.5rem', alignItems:'center'}}><div style={{width:'10px', height:'10px', background:'#10b981', borderRadius:'50%'}}></div> Bot Traffic</div>
                   <div style={{display:'flex', gap:'0.5rem', alignItems:'center'}}><div style={{width:'10px', height:'10px', background:'#ef4444', borderRadius:'50%'}}></div> Suspicious</div>
                </div>
              </div>
            </div>

            {/* BOTTOM SECTION */}
            <div className="white-panel">
              <h3 style={{ color: 'var(--dark-text)', marginBottom: '1.5rem' }}>Daily Traffic Metrics (Recent Anomalies)</h3>
              {recentAnomalies.length === 0 ? (
                <div style={{ color: 'var(--muted-text)' }}>No critical anomalies found.</div>
              ) : (
                <table className="glass-table">
                  <thead>
                    <tr>
                      <th>IP Address</th>
                      <th>Page Accessed</th>
                      <th>Flags</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAnomalies.map((anom, idx) => (
                      <tr key={idx}>
                        <td style={{ textDecoration: blockedIPs.has(anom.ip) ? 'line-through' : 'none', color: blockedIPs.has(anom.ip) ? 'var(--muted-text)' : 'inherit' }}>{anom.ip}</td>
                        <td>{anom.page}</td>
                        <td><span className="badge badge-danger">High Spike</span></td>
                        <td>
                           <button onClick={() => handleBlock(anom.ip)} disabled={blockedIPs.has(anom.ip)} style={{ background: blockedIPs.has(anom.ip) ? '#e2e8f0' : '#f1f5f9', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: blockedIPs.has(anom.ip) ? 'not-allowed' : 'pointer', fontWeight: 'bold', color: blockedIPs.has(anom.ip) ? '#94a3b8' : '#3b82f6' }}>
                             {blockedIPs.has(anom.ip) ? 'Blocked' : 'Block IP'}
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
