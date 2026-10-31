import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LogIn, Key, Mail, ShieldAlert, Sparkles } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authAPI.login({ email, password });
      const authData = res?.data || res;
      if (authData && authData.token) {
        login(authData);

        // Redirect to intended protected page, or default to appropriate dashboard
        let targetDashboard;
        if (from && from !== '/' && from !== '/login') {
          targetDashboard = from;
        } else if (authData.role === 'ADMIN') {
          targetDashboard = '/admin';
        } else {
          targetDashboard = '/tracking';
        }

        navigate(targetDashboard, { replace: true });
      } else {
        setError('Login failed: Invalid server response');
      }
    } catch (err) {
      console.error('Sign in error:', err);
      let errorText = 'Invalid email or password. Please verify your credentials.';
      if (typeof err === 'string') {
        errorText = err;
      } else if (err?.message && (err.message.includes('Network') || err.message.includes('Failed to fetch') || err.code === 'ERR_NETWORK')) {
        errorText = 'Cannot connect to backend server. Please verify MySQL and Spring Boot are running on port 8080.';
      } else if (err?.message) {
        errorText = err.message;
      } else if (err?.error) {
        errorText = err.error;
      }
      setError(errorText);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.25rem' }}>
      <div className="form-card" style={{ maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            padding: '12px',
            borderRadius: '50%',
            background: '#eff6ff',
            color: '#2563eb',
            marginBottom: '0.75rem'
          }}>
            <LogIn size={28} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>Welcome Back</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Sign in to track live services or manage workshop bay queues
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
            <ShieldAlert size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="email"
                required
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Key size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="password"
                required
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.75rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Account'}
          </button>
        </form>

        {/* Demo Accounts Quick-Fill Section */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', fontWeight: '700', color: '#2563eb', marginBottom: '0.75rem' }}>
            <Sparkles size={16} /> Quick Demo Account Logins:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => fillDemoAccount('admin@vehicleservice.com', 'admin123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.8rem', textAlign: 'left', justifyContent: 'flex-start' }}
            >
              👑 Admin (Full Control)
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('jhansi@gmail.com', '123456')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.8rem', textAlign: 'left', justifyContent: 'flex-start' }}
            >
              🚗 Customer (Jhansi)
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('arun@example.com', '123456')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.8rem', textAlign: 'left', justifyContent: 'flex-start' }}
            >
              🏍️ Customer (Arun)
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('ravi.tech@vehicleservice.com', 'tech123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.8rem', textAlign: 'left', justifyContent: 'flex-start' }}
            >
              🔧 Technician (Ravi)
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: '#64748b' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: '600', color: '#2563eb' }}>
            Register as Customer
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

