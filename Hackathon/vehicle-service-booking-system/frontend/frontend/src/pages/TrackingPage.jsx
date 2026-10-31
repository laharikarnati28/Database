import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bookingsAPI, jobCardsAPI } from '../services/api';
import TrackerProgress from '../components/TrackerProgress';
import StatusBadge from '../components/StatusBadge';
import { RefreshCw, Car, Wrench, UserCheck, Calendar, Clock, AlertCircle, FileText } from 'lucide-react';

const TrackingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlBookingId = searchParams.get('bookingId');

  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [jobCard, setJobCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [autoPoll, setAutoPoll] = useState(false);

  const pollTimerRef = useRef(null);

  const fetchBookings = async (silent = false) => {
    try {
      if (!silent) setRefreshing(true);
      setError('');
      const res = await bookingsAPI.getMy();
      if (res.data) {
        setBookings(res.data);

        // If bookingId was requested in URL or current selection exists, find it
        if (urlBookingId) {
          const found = res.data.find(b => String(b.bookingId) === String(urlBookingId));
          if (found) {
            setSelectedBooking(found);
            loadJobCard(found.bookingId);
          } else if (res.data.length > 0) {
            setSelectedBooking(res.data[0]);
            loadJobCard(res.data[0].bookingId);
          }
        } else if (res.data.length > 0 && !selectedBooking) {
          setSelectedBooking(res.data[0]);
          loadJobCard(res.data[0].bookingId);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve active booking tracker data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadJobCard = async (bookingId) => {
    try {
      const res = await jobCardsAPI.getByBookingId(bookingId);
      if (res.data) {
        setJobCard(res.data);
      } else {
        setJobCard(null);
      }
    } catch {
      setJobCard(null);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [urlBookingId]);

  // Clean polling implementation with unmount timer teardown
  useEffect(() => {
    if (autoPoll) {
      pollTimerRef.current = setInterval(() => {
        fetchBookings(true);
      }, 15000); // 15 seconds poll interval
    } else {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    }

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [autoPoll, selectedBooking]);

  const handleSelectBooking = (booking) => {
    setSelectedBooking(booking);
    setSearchParams({ bookingId: booking.bookingId });
    loadJobCard(booking.bookingId);
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    if (!window.confirm(`Are you sure you want to cancel booking #${selectedBooking.bookingId}?`)) return;

    try {
      await bookingsAPI.cancel(selectedBooking.bookingId);
      fetchBookings();
    } catch (err) {
      alert(err.message || 'Failed to cancel booking');
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="section-title">Live Service Status Tracking</h1>
          <p className="section-subtitle">Real-time status updates and diagnostics for your vehicle in the bay</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={autoPoll}
              onChange={(e) => setAutoPoll(e.target.checked)}
            />
            Auto-refresh (15s polling)
          </label>

          <button onClick={() => fetchBookings(false)} disabled={refreshing} className="btn btn-secondary btn-sm">
            <RefreshCw size={15} className={refreshing ? 'spinner' : ''} />
            {refreshing ? 'Updating...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error"><AlertCircle size={18} /> {error}</div>}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Connecting to backend and fetching status...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <Clock size={56} className="empty-state-icon" />
          <h3>No Active Bookings Found</h3>
          <p>You haven't scheduled any service bookings yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'flex-start' }}>
          {/* Booking List Selector */}
          <div className="card" style={{ padding: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.75rem', color: '#64748b' }}>
              Your Bookings ({bookings.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {bookings.map(b => (
                <div
                  key={b.bookingId}
                  onClick={() => handleSelectBooking(b)}
                  style={{
                    padding: '0.85rem',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: selectedBooking?.bookingId === b.bookingId ? '#2563eb' : '#e2e8f0',
                    background: selectedBooking?.bookingId === b.bookingId ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>#{b.bookingId} - {b.vehicleNumber}</strong>
                    <StatusBadge status={b.status} />
                  </div>
                  <div style={{ fontSize: '0.825rem', color: '#64748b' }}>
                    {b.serviceName}
                  </div>
                  <div style={{ fontSize: '0.775rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    {b.bookingDate} at {b.bookingTime}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Tracker Main Details */}
          {selectedBooking && (
            <div>
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>
                      Booking Reference
                    </span>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>
                      #{selectedBooking.bookingId} • {selectedBooking.vehicleBrand} {selectedBooking.vehicleModel}
                    </h2>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.25rem' }}>
                      <span style={{ background: '#1e3a8a', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '700' }}>
                        {selectedBooking.vehicleNumber}
                      </span>
                      <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{selectedBooking.serviceName}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Current Status</div>
                    <StatusBadge status={selectedBooking.status} />
                  </div>
                </div>

                {/* Progress Steps */}
                <TrackerProgress status={selectedBooking.status} />

                {/* Grid Metadata */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', padding: '1.25rem 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={15} /> Scheduled Date
                    </div>
                    <div style={{ fontWeight: '600', color: '#0f172a', marginTop: '0.25rem' }}>
                      {selectedBooking.bookingDate}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={15} /> Time Slot
                    </div>
                    <div style={{ fontWeight: '600', color: '#0f172a', marginTop: '0.25rem' }}>
                      {selectedBooking.bookingTime}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <UserCheck size={15} /> Assigned Technician
                    </div>
                    <div style={{ fontWeight: '600', color: '#0f172a', marginTop: '0.25rem' }}>
                      {selectedBooking.technicianName || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Pending Allocation</span>}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Base Service Amount</div>
                    <div style={{ fontWeight: '700', color: '#10b981', fontSize: '1.15rem', marginTop: '0.25rem' }}>
                      ₹{selectedBooking.totalAmount}
                    </div>
                  </div>
                </div>

                {/* Problem Description */}
                {selectedBooking.problemDescription && (
                  <div style={{ marginTop: '1.25rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.3rem' }}>
                      Reported Symptoms / Complaints:
                    </div>
                    <p style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem', color: '#475569' }}>
                      "{selectedBooking.problemDescription}"
                    </p>
                  </div>
                )}

                {/* Cancel Booking Action */}
                {(selectedBooking.status === 'BOOKED' || selectedBooking.status === 'CONFIRMED') && (
                  <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                    <button onClick={handleCancelBooking} className="btn btn-secondary btn-sm" style={{ color: '#ef4444', borderColor: '#fca5a5' }}>
                      Cancel This Appointment
                    </button>
                  </div>
                )}
              </div>

              {/* Connected Job Card Details */}
              {jobCard && (
                <div className="card">
                  <div className="card-header">
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase' }}>
                        Workshop Floor Inspection
                      </span>
                      <h3 className="card-title" style={{ marginTop: '0.25rem' }}>
                        Job Card: {jobCard.jobCardNumber}
                      </h3>
                    </div>
                    <StatusBadge status={jobCard.status} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>
                        Diagnosis / Technician Findings:
                      </h4>
                      <p style={{ fontSize: '0.9rem', color: '#475569', background: '#f8fafc', padding: '0.75rem', borderRadius: '6px' }}>
                        {jobCard.diagnosis || 'Initial inspection underway.'}
                      </p>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>
                        Work Performed:
                      </h4>
                      <p style={{ fontSize: '0.9rem', color: '#475569', background: '#f8fafc', padding: '0.75rem', borderRadius: '6px' }}>
                        {jobCard.workDone || 'Pending diagnosis completion.'}
                      </p>
                    </div>
                  </div>

                  {/* Spare parts logged */}
                  {jobCard.parts && jobCard.parts.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
                        Genuine Parts Replaced / Consumed:
                      </h4>
                      <div className="table-wrapper">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Part Description</th>
                              <th>Part SKU</th>
                              <th>Quantity</th>
                              <th>Unit Price</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {jobCard.parts.map(p => (
                              <tr key={p.id}>
                                <td>{p.partName}</td>
                                <td><code>{p.partNumber}</code></td>
                                <td>{p.quantity}</td>
                                <td>₹{p.unitPrice}</td>
                                <td><strong>₹{p.totalPrice}</strong></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackingPage;

