import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { servicesAPI, dashboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Wrench, Shield, Clock, Award, ArrowRight, CheckCircle2, Calendar, UserCheck } from 'lucide-react';

const HomePage = () => {
  const [featuredServices, setFeaturedServices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesRes = await servicesAPI.getAll(false);
        if (servicesRes.data) {
          setFeaturedServices(servicesRes.data.slice(0, 3));
        }

        // Try fetching dashboard stats (falls back gracefully if not admin)
        try {
          const statsRes = await dashboardAPI.getStats();
          if (statsRes.data) {
            setStats(statsRes.data);
          }
        } catch {
          // Public users won't access admin stats endpoint, provide demo fallback numbers
          setStats({
            totalBookings: 148,
            totalCustomers: 96,
            totalTechnicians: 8,
            completedServices: 132
          });
        }
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <h1 className="hero-title">
                Smart Vehicle Servicing, <span>Tracked in Real-Time.</span>
              </h1>
              <p className="hero-subtitle">
                Experience hassle-free maintenance for cars and bikes. Schedule certified technician appointments, 
                inspect live job cards, and enjoy transparent itemized billing.
              </p>
              <div className="hero-buttons">
                <Link to={isAuthenticated ? "/book" : "/login"} className="btn btn-primary btn-lg">
                  <Calendar size={18} /> Book a Service Now
                </Link>
                <Link to="/services" className="btn btn-secondary btn-lg" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
                  Explore Services <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            <div className="hero-card">
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.25rem', color: '#93c5fd' }}>
                Workshop Live Metrics
              </h3>
              <div className="stats-grid">
                <div className="stat-box">
                  <div className="stat-value">{stats ? stats.totalBookings : '100+'}</div>
                  <div className="stat-label">Total Services Handled</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">{stats ? stats.completedServices : '98%'}</div>
                  <div className="stat-label">Successful Deliveries</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">{stats ? stats.totalCustomers : '80+'}</div>
                  <div className="stat-label">Registered Vehicle Owners</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">{stats ? stats.totalTechnicians : '12'}</div>
                  <div className="stat-label">Master Technicians</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="container">
        <div className="section-header">
          <h2 className="section-title">Popular Service Packages</h2>
          <p className="section-subtitle">Factory-grade diagnostics, multi-point checks, and genuine parts warranty</p>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading service packages from database...</p>
          </div>
        ) : (
          <div className="cards-grid">
            {featuredServices.map((service) => (
              <div key={service.serviceId} className="card">
                <div className="card-header">
                  <h3 className="card-title">{service.serviceName}</h3>
                  <span className="service-price">₹{service.price}</span>
                </div>
                <p className="card-description">{service.description}</p>
                <div className="card-footer">
                  <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={16} /> ~{service.estimatedTime} mins
                  </span>
                  <button
                    onClick={() => navigate(isAuthenticated ? `/book?serviceId=${service.serviceId}` : '/login')}
                    className="btn btn-primary btn-sm"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/services" className="btn btn-secondary">
            View All Service Packages <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* 4-Step Process Section */}
      <section style={{ backgroundColor: '#f1f5f9', padding: '4rem 0', marginTop: '4rem' }}>
        <div className="container">
          <div className="section-header" style={{ margin: '0 0 3rem' }}>
            <h2 className="section-title">How VehicleCare Works</h2>
            <p className="section-subtitle">Seamless 4-step workflow from booking to safe vehicle delivery</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <div className="card" style={{ textAlign: 'center', alignItems: 'center' }}>
              <div style={{ background: '#eff6ff', color: '#2563eb', padding: '16px', borderRadius: '50%', marginBottom: '1rem' }}>
                <Calendar size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem' }}>1. Select &amp; Book</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                Pick your registered vehicle, select the required service package, and choose your preferred date and time slot.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', alignItems: 'center' }}>
              <div style={{ background: '#ecfdf5', color: '#10b981', padding: '16px', borderRadius: '50%', marginBottom: '1rem' }}>
                <UserCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem' }}>2. Technician Allocation</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                Workshop admin reviews the problem description and assigns a verified specialist technician with an active job card.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', alignItems: 'center' }}>
              <div style={{ background: '#fffbeb', color: '#f59e0b', padding: '16px', borderRadius: '50%', marginBottom: '1rem' }}>
                <Wrench size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem' }}>3. Real-Time Tracking</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                Monitor lifecycle progress live from BOOKED to IN_PROGRESS. Review parts replaced directly on your tracking screen.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', alignItems: 'center' }}>
              <div style={{ background: '#eff6ff', color: '#1d4ed8', padding: '16px', borderRadius: '50%', marginBottom: '1rem' }}>
                <Shield size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem' }}>4. Pay &amp; Collect</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                Receive an itemized digital invoice upon completion. Make payment via UPI, Card, or Cash and receive your serviced vehicle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container" style={{ padding: '4rem 1.25rem' }}>
        <div className="section-header" style={{ margin: '0 0 2.5rem' }}>
          <h2 className="section-title">Why Vehicle Owners Trust VehicleCare</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <CheckCircle2 color="#10b981" size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontWeight: '700', fontSize: '1.05rem', marginBottom: '0.25rem' }}>100% Genuine Spare Parts</h4>
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Every part fitted comes straight from authorized OEM channels with warranty protection.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <CheckCircle2 color="#10b981" size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontWeight: '700', fontSize: '1.05rem', marginBottom: '0.25rem' }}>Upfront Transparent Pricing</h4>
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>No hidden labor surcharges. What you see on your booking confirmation is what you pay.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <CheckCircle2 color="#10b981" size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontWeight: '700', fontSize: '1.05rem', marginBottom: '0.25rem' }}>Certified Technicians</h4>
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Specialists with 3 to 10 years of multi-brand mechanical and electrical diagnostics experience.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

