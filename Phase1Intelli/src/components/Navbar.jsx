import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="glass-panel" style={{ margin: '1rem', borderRadius: '12px', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="navbar-brand">
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: 'var(--primary-blue, #3b82f6)' }}>Smart</span>Traffic
        </Link>
      </div>
      <div className="navbar-links" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/add-website" className="nav-link">Add Website</Link>
            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              Get Started
            </Link>
          </>
        )}
      </div>

      <style>{`
        .nav-link {
          color: var(--text-muted);
          font-weight: 500;
          transition: color 0.3s;
        }
        .nav-link:hover {
          color: white;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
