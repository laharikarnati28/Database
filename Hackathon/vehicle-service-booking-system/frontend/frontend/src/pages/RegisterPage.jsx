import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Phone, Key, MapPin, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    role: 'CUSTOMER'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authAPI.register(formData);
      const authData = res?.data || res;
      if (authData && authData.token) {
        login(authData);
        navigate('/');
      } else {
        setError('Registration failed: Invalid server response');
      }
    } catch (err) {
      if (err?.errors) {
        const firstErrorKey = Object.keys(err.errors)[0];
        setError(err.errors[firstErrorKey]);
      } else if (err?.message && (err.message.includes('Network') || err.message.includes('Failed to fetch') || err.code === 'ERR_NETWORK')) {
        setError('Cannot reach backend server. Please verify Spring Boot is running on port 8080.');
      } else {
        setError(err?.message || 'Registration failed. Please check your details.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.25rem' }}>
      <div className="form-card" style={{ maxWidth: '520px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            padding: '12px',
            borderRadius: '50%',
            background: '#ecfdf5',
            color: '#10b981',
            marginBottom: '0.75rem'
          }}>
            <UserPlus size={28} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>Create VehicleCare Account</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Register your vehicle owner profile for seamless service booking
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                required
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Jhansi Priya"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="tel"
                  required
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Key size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="password"
                required
                minLength="6"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Residential Address</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
              <textarea
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                rows="2"
                placeholder="Plot / Flat, Street, Area, City"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.75rem' }}
          >
            {loading ? 'Creating Account...' : 'Complete Customer Registration'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: '600', color: '#2563eb' }}>
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

