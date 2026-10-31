import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { vehiclesAPI, servicesAPI, bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, Car, Wrench, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const preSelectedServiceId = searchParams.get('serviceId');

  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    vehicleId: '',
    serviceId: preSelectedServiceId || '',
    bookingDate: today,
    bookingTime: '10:00:00',
    problemDescription: ''
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadPrerequisites = async () => {
      try {
        const [vehiclesRes, servicesRes] = await Promise.all([
          vehiclesAPI.getAll(),
          servicesAPI.getAll(false)
        ]);

        if (vehiclesRes.data) {
          setVehicles(vehiclesRes.data);
          if (vehiclesRes.data.length > 0 && !formData.vehicleId) {
            setFormData(prev => ({ ...prev, vehicleId: vehiclesRes.data[0].vehicleId }));
          }
        }

        if (servicesRes.data) {
          setServices(servicesRes.data);
          if (servicesRes.data.length > 0 && !formData.serviceId) {
            setFormData(prev => ({
              ...prev,
              serviceId: preSelectedServiceId || servicesRes.data[0].serviceId
            }));
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to initialize booking form options');
      } finally {
        setLoading(false);
      }
    };

    loadPrerequisites();
  }, [preSelectedServiceId]);

  const selectedService = services.find(s => String(s.serviceId) === String(formData.serviceId));
  const selectedVehicle = vehicles.find(v => String(v.vehicleId) === String(formData.vehicleId));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.vehicleId) {
      setError('Please select or register a vehicle first.');
      return;
    }

    if (!formData.serviceId) {
      setError('Please select a service package.');
      return;
    }

    if (formData.bookingDate < today) {
      setError('Booking date cannot be in the past.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        vehicleId: Number(formData.vehicleId),
        serviceId: Number(formData.serviceId),
        bookingDate: formData.bookingDate,
        bookingTime: formData.bookingTime.length === 5 ? formData.bookingTime + ':00' : formData.bookingTime,
        problemDescription: formData.problemDescription
      };

      const res = await bookingsAPI.create(payload);
      if (res.data) {
        setConfirmedBooking(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit booking appointment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 1rem' }}>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading booking parameters...</p>
        </div>
      </div>
    );
  }

  // Confirmation View
  if (confirmedBooking) {
    return (
      <div className="container" style={{ padding: '3rem 1rem' }}>
        <div className="form-card" style={{ textAlign: 'center', maxWidth: '600px' }}>
          <div style={{ color: '#10b981', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            <CheckCircle2 size={64} />
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
            Service Booked Successfully!
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '1.5rem' }}>
            Your appointment has been saved to the database. An administrator will verify and assign an expert technician shortly.
          </p>

          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '1.5rem',
            textAlign: 'left',
            marginBottom: '2rem',
            lineHeight: '1.8'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
              <strong>Booking Reference ID:</strong>
              <span style={{ color: '#2563eb', fontWeight: '700' }}>#{confirmedBooking.bookingId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Vehicle:</span>
              <strong>{confirmedBooking.vehicleBrand} {confirmedBooking.vehicleModel} ({confirmedBooking.vehicleNumber})</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Service Package:</span>
              <strong>{confirmedBooking.serviceName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Appointment Slot:</span>
              <strong>{confirmedBooking.bookingDate} at {confirmedBooking.bookingTime}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
              <span>Estimated Base Price:</span>
              <strong style={{ color: '#10b981', fontSize: '1.1rem' }}>₹{confirmedBooking.totalAmount}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate(`/tracking?bookingId=${confirmedBooking.bookingId}`)} className="btn btn-primary">
              Track Real-Time Status <ArrowRight size={16} />
            </button>
            <Link to="/history" className="btn btn-secondary">
              View All Bookings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      <div className="section-header" style={{ margin: '0 0 2rem' }}>
        <h1 className="section-title">Schedule a Service Appointment</h1>
        <p className="section-subtitle">Reserve a workshop bay with certified technicians and guaranteed slots</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Booking Form */}
        <div className="card" style={{ padding: '2rem' }}>
          {error && <div className="alert alert-error"><AlertCircle size={18} /> {error}</div>}

          {vehicles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <Car size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
              <h3>No Vehicles Found</h3>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                You must add your vehicle registration details before scheduling an appointment.
              </p>
              <Link to="/vehicles" className="btn btn-primary">
                Add Vehicle Now
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Authenticated Customer Info */}
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Customer Details</span>
                <div style={{ fontWeight: '700', fontSize: '1rem', color: '#0f172a' }}>{user?.name}</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{user?.email} • {user?.phone}</div>
              </div>

              {/* Select Vehicle */}
              <div className="form-group">
                <label className="form-label">Select Registered Vehicle *</label>
                <select
                  className="form-control"
                  required
                  value={formData.vehicleId}
                  onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                >
                  {vehicles.map(v => (
                    <option key={v.vehicleId} value={v.vehicleId}>
                      {v.brand} {v.model} - {v.vehicleNumber} ({v.vehicleType})
                    </option>
                  ))}
                </select>
                <div style={{ marginTop: '0.35rem', textAlign: 'right' }}>
                  <Link to="/vehicles" style={{ fontSize: '0.825rem' }}>+ Add another vehicle</Link>
                </div>
              </div>

              {/* Select Service */}
              <div className="form-group">
                <label className="form-label">Select Service Package *</label>
                <select
                  className="form-control"
                  required
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                >
                  {services.map(s => (
                    <option key={s.serviceId} value={s.serviceId}>
                      {s.serviceName} - ₹{s.price} (~{s.estimatedTime} mins)
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time Slot */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Appointment Date *</label>
                  <input
                    type="date"
                    min={today}
                    className="form-control"
                    required
                    value={formData.bookingDate}
                    onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Preferred Time Slot *</label>
                  <select
                    className="form-control"
                    required
                    value={formData.bookingTime}
                    onChange={(e) => setFormData({ ...formData, bookingTime: e.target.value })}
                  >
                    <option value="09:00:00">09:00 AM - Morning Bay 1</option>
                    <option value="10:30:00">10:30 AM - Morning Bay 2</option>
                    <option value="12:00:00">12:00 PM - Midday Slot</option>
                    <option value="14:00:00">02:00 PM - Afternoon Bay 1</option>
                    <option value="15:30:00">03:30 PM - Afternoon Bay 2</option>
                    <option value="17:00:00">05:00 PM - Evening Express</option>
                  </select>
                </div>
              </div>

              {/* Problem Symptoms Description */}
              <div className="form-group">
                <label className="form-label">Describe any specific vehicle symptoms or requests (Optional)</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="e.g., Brake squeaking noise, slight engine vibration when idling, AC cooling slow..."
                  value={formData.problemDescription}
                  onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '1rem' }}
              >
                {submitting ? 'Confirming Appointment...' : 'Confirm Service Booking'}
              </button>
            </form>
          )}
        </div>

        {/* Live Booking Summary Card */}
        <div className="card" style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            Appointment Summary
          </h3>

          <div style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Vehicle:</span>
              <strong style={{ color: '#0f172a' }}>
                {selectedVehicle ? `${selectedVehicle.brand} ${selectedVehicle.model}` : 'None'}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Registration No:</span>
              <strong style={{ color: '#0f172a' }}>
                {selectedVehicle ? selectedVehicle.vehicleNumber : '-'}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Service Selected:</span>
              <strong style={{ color: '#0f172a' }}>
                {selectedService ? selectedService.serviceName : 'None'}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Estimated Duration:</span>
              <strong style={{ color: '#0f172a' }}>
                {selectedService ? `~${selectedService.estimatedTime} mins` : '-'}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Scheduled Date:</span>
              <strong style={{ color: '#0f172a' }}>{formData.bookingDate}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Scheduled Time:</span>
              <strong style={{ color: '#0f172a' }}>{formData.bookingTime.substring(0, 5)}</strong>
            </div>

            <div style={{
              borderTop: '2px solid #e2e8f0',
              marginTop: '1rem',
              paddingTop: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>Estimated Labor Price:</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#2563eb' }}>
                ₹{selectedService ? selectedService.price : '0.00'}
              </span>
            </div>

            <p style={{ fontSize: '0.775rem', color: '#94a3b8', marginTop: '0.75rem' }}>
              * Price is calculated using database authoritative service rates. Any additional replacement spare parts will be confirmed via job card diagnostics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

