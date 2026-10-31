import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, Clock, Wrench, CheckCircle } from 'lucide-react';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await servicesAPI.getAll(false);
        if (res.data) {
          setServices(res.data);
          const uniqueCats = ['All', ...new Set(res.data.map(s => s.category).filter(Boolean))];
          setCategories(uniqueCats);
        }
      } catch (err) {
        setError('Failed to fetch services from the backend API: ' + (err.message || ''));
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const matchesSearch = service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleBookNow = (serviceId) => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/book?serviceId=' + serviceId);
    } else {
      navigate(`/book?serviceId=${serviceId}`);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      <div className="section-header" style={{ margin: '0 0 2rem' }}>
        <h1 className="section-title">Vehicle Service Packages</h1>
        <p className="section-subtitle">Choose from factory-recommended maintenance and overhaul packages</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Search and Category Filter Toolbar */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search service by name or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading catalog from database...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="empty-state">
          <Wrench size={48} className="empty-state-icon" />
          <h3>No service packages found</h3>
          <p>Try modifying your search query or selected category filter.</p>
        </div>
      ) : (
        <div className="cards-grid">
          {filteredServices.map(service => (
            <div key={service.serviceId} className="card">
              <div className="card-header">
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#2563eb', letterSpacing: '0.04em' }}>
                    {service.category || 'Maintenance'}
                  </span>
                  <h3 className="card-title" style={{ marginTop: '0.25rem' }}>{service.serviceName}</h3>
                </div>
                <span className="service-price">₹{service.price}</span>
              </div>

              <p className="card-description">{service.description}</p>

              <div style={{ marginBottom: '1.25rem', fontSize: '0.875rem', color: '#64748b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <Clock size={16} /> <strong>Estimated Time:</strong> ~{service.estimatedTime} minutes
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle size={16} color="#10b981" /> <strong>Warranty:</strong> 30 Days / 1,000 KM
                </div>
              </div>

              <div className="card-footer">
                <button
                  onClick={() => handleBookNow(service.serviceId)}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  Book This Service
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesPage;

