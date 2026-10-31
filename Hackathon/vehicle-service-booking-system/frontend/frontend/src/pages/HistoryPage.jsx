import React, { useState, useEffect } from 'react';
import { bookingsAPI, invoicesAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { FileText, Printer, CheckCircle, Calendar, Car, AlertCircle } from 'lucide-react';

const HistoryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await bookingsAPI.getMy();
      if (res.data) {
        setBookings(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load service history records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleViewInvoice = async (bookingId) => {
    try {
      setInvoiceLoading(true);
      const res = await invoicesAPI.getByBookingId(bookingId);
      if (res.data) {
        setSelectedInvoice(res.data);
        setIsInvoiceModalOpen(true);
      }
    } catch {
      alert('No invoice generated for this booking yet. Invoices are generated once service diagnostics and repairs are completed.');
    } finally {
      setInvoiceLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      <div className="section-header" style={{ margin: '0 0 2rem' }}>
        <h1 className="section-title">Service History &amp; Invoices</h1>
        <p className="section-subtitle">Complete record of your previous vehicle maintenance logs and tax invoices</p>
      </div>

      {error && <div className="alert alert-error"><AlertCircle size={18} /> {error}</div>}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading historical records...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <Calendar size={56} className="empty-state-icon" />
          <h3>No Service History Yet</h3>
          <p>Book your first maintenance service to start building your vehicle's digital logbook.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Date &amp; Time</th>
                <th>Vehicle</th>
                <th>Service Name</th>
                <th>Status</th>
                <th>Technician</th>
                <th>Amount</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.bookingId}>
                  <td>
                    <strong>#{b.bookingId}</strong>
                  </td>
                  <td>
                    {b.bookingDate}
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{b.bookingTime}</div>
                  </td>
                  <td>
                    <strong>{b.vehicleBrand} {b.vehicleModel}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{b.vehicleNumber}</div>
                  </td>
                  <td>{b.serviceName}</td>
                  <td><StatusBadge status={b.status} /></td>
                  <td>{b.technicianName || <span style={{ color: '#94a3b8' }}>-</span>}</td>
                  <td><strong>₹{b.totalAmount}</strong></td>
                  <td>
                    <button
                      onClick={() => handleViewInvoice(b.bookingId)}
                      disabled={invoiceLoading}
                      className="btn btn-secondary btn-sm"
                      title="View Digital Tax Invoice"
                    >
                      <FileText size={15} /> Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Invoice Modal & Printable View */}
      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title="Tax Invoice"
        maxWidth="750px"
      >
        {selectedInvoice && (
          <div className="invoice-container" style={{ margin: 0, padding: '1rem', border: 'none', boxShadow: 'none' }}>
            <div className="invoice-header">
              <div>
                <h2 className="invoice-title">VehicleCare Workshop</h2>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Plot 42, Workshop Central, Tech Park, Hyderabad<br />
                  GSTIN: 36AAACB1234F1Z5 | Phone: +91 98765 00000
                </div>
              </div>
              <div className="invoice-meta">
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>
                  {selectedInvoice.invoiceNumber}
                </div>
                <div>Invoice Date: <strong>{selectedInvoice.invoiceDate}</strong></div>
                <div style={{ marginTop: '0.35rem' }}>
                  Payment Status: <StatusBadge status={selectedInvoice.paymentStatus} />
                </div>
              </div>
            </div>

            <div className="invoice-bill-to">
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>
                  Billed To:
                </span>
                <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#0f172a' }}>{selectedInvoice.customerName}</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {selectedInvoice.customerEmail}<br />
                  Phone: {selectedInvoice.customerPhone}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>
                  Vehicle Serviced:
                </span>
                <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#0f172a' }}>
                  {selectedInvoice.vehicleBrand} {selectedInvoice.vehicleModel}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Reg No: <strong>{selectedInvoice.vehicleNumber}</strong><br />
                  Booking Ref: #{selectedInvoice.bookingId}
                </div>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="table-wrapper" style={{ marginBottom: '1.5rem' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th>Category</th>
                    <th style={{ textAlign: 'right' }}>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>{selectedInvoice.serviceName}</strong>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Scheduled labor and workshop multi-point diagnostic check</div>
                    </td>
                    <td>Service Labor</td>
                    <td style={{ textAlign: 'right' }}>₹{selectedInvoice.serviceAmount}</td>
                  </tr>
                  {selectedInvoice.partsAmount > 0 && (
                    <tr>
                      <td>
                        <strong>Workshop Replacement Parts</strong>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>OEM Spare parts utilized from job card</div>
                      </td>
                      <td>Materials &amp; Parts</td>
                      <td style={{ textAlign: 'right' }}>₹{selectedInvoice.partsAmount}</td>
                    </tr>
                  )}
                  <tr>
                    <td>
                      <strong>Goods &amp; Services Tax (GST 18%)</strong>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>CGST 9% + SGST 9% on services and components</div>
                    </td>
                    <td>Tax</td>
                    <td style={{ textAlign: 'right' }}>₹{selectedInvoice.taxAmount}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
              <div style={{ width: '280px', lineHeight: '2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #0f172a', paddingTop: '0.5rem' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>Total Amount:</span>
                  <span style={{ fontSize: '1.35rem', fontWeight: '800', color: '#2563eb' }}>
                    ₹{selectedInvoice.totalAmount}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Computer generated invoice. No physical signature required.
              </span>
              <button onClick={handlePrint} className="btn btn-primary btn-sm">
                <Printer size={16} /> Print / Save PDF
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HistoryPage;

