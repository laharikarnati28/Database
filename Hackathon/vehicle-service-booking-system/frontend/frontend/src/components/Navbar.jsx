import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, Car, Calendar, Clock, ShieldCheck, LogOut, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar-inner">
          <Link to="/" className="brand">
            <span className="brand-icon">
              <Wrench size={22} />
            </span>
            <span>VehicleCare</span>
          </Link>

          <nav>
            <ul className="nav-links">
              <li className="nav-item">
                <NavLink to="/" end>Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/services">Services</NavLink>
              </li>

              {isAuthenticated && (
                <>
                  <li className="nav-item">
                    <NavLink to="/book">Book Service</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/tracking">Track Status</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/vehicles">My Vehicles</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/history">Service History</NavLink>
                  </li>
                </>
              )}

              {isAdmin && (
                <li className="nav-item">
                  <NavLink to="/admin" className="admin-nav-link" style={{ color: '#2563eb', fontWeight: '700' }}>
                    <ShieldCheck size={18} /> Admin Dashboard
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>

          <div className="nav-auth">
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="user-badge">
                  <span>{user?.name}</span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>({user?.role})</span>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Sign Out">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to="/login" className="btn btn-secondary btn-sm">
                  <LogIn size={16} /> Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  <UserPlus size={16} /> Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

