import React, { useState, useEffect } from 'react';
import {
  dashboardAPI,
  bookingsAPI,
  techniciansAPI,
  servicesAPI,
  sparePartsAPI,
  jobCardsAPI,
  invoicesAPI,
  paymentsAPI,
  customersAPI
} from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import {
  BarChart3,
  Calendar,
  Users,
  Wrench,
  Package,
  FileText,
  DollarSign,
  AlertTriangle,
  Plus,
  CheckCircle,
  RefreshCw,
  Edit,
  Trash2,
  ShieldCheck,
  CreditCard
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('bookings');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Tab Data States
  const [bookings, setBookings] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [services, setServices] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [jobCards, setJobCards] = useState([]);
  const [invoices, setInvoices] = useState([]);

  // Modal States
  const [assignModal, setAssignModal] = useState({ open: false, bookingId: null, technicianId: '' });
  const [statusModal, setStatusModal] = useState({ open: false, bookingId: null, status: 'CONFIRMED' });
  const [techModal, setTechModal] = useState({ open: false, data: { name: '', email: '', phone: '', specialization: '', experienceYears: 3 } });
  const [serviceModal, setServiceModal] = useState({ open: false, editingId: null, data: { serviceName: '', description: '', price: '', estimatedTime: 60, category: 'General' } });
  const [partModal, setPartModal] = useState({ open: false, data: { partName: '', partNumber: '', quantity: 10, price: '', category: 'Mechanical', minStockLevel: 5 } });
  const [stockDeltaModal, setStockDeltaModal] = useState({ open: false, partId: null, delta: 5 });
  const [addPartToJcModal, setAddPartToJcModal] = useState({ open: false, jobCardId: null, partId: '', quantity: 1 });
  const [paymentModal, setPaymentModal] = useState({ open: false, invoiceId: null, amount: '', paymentMethod: 'UPI', transactionReference: '' });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [
        statsRes,
        bookingsRes,
        techsRes,
        servicesRes,
        partsRes,
        jcRes,
        invRes
      ] = await Promise.all([
        dashboardAPI.getStats(),
        bookingsAPI.getAll(),
        techniciansAPI.getAll(),
        servicesAPI.getAll(true),
        sparePartsAPI.getAll(),
        jobCardsAPI.getAll(),
        invoicesAPI.getAll()
      ]);

      if (statsRes.data) setStats(statsRes.data);
      if (bookingsRes.data) setBookings(bookingsRes.data);
      if (techsRes.data) setTechnicians(techsRes.data);
      if (servicesRes.data) setServices(servicesRes.data);
      if (partsRes.data) setSpareParts(partsRes.data);
      if (jcRes.data) setJobCards(jcRes.data);
      if (invRes.data) setInvoices(invRes.data);
    } catch (err) {
      setError(err.message || 'Failed to refresh admin workshop data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handlers for Operations
  const handleAssignTechnician = async (e) => {
    e.preventDefault();
    try {
      await bookingsAPI.assignTechnician(assignModal.bookingId, assignModal.technicianId);
      setSuccess('Technician assigned and booking confirmed!');
      setAssignModal({ open: false, bookingId: null, technicianId: '' });
      fetchDashboardData();
    } catch (err) {
      setError(err.message || 'Failed to assign technician');
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await bookingsAPI.updateStatus(statusModal.bookingId, statusModal.status);
      setSuccess(`Booking #${statusModal.bookingId} status updated to ${statusModal.status}`);
      setStatusModal({ open: false, bookingId: null, status: 'CONFIRMED' });
      fetchDashboardData();
    } catch (err) {
      setError(err.message || 'Failed to update booking status');
    }
  };

  const handleSaveTechnician = async (e) => {
    e.preventDefault();
    try {
      await techniciansAPI.create(techModal.data);
      setSuccess('New technician registered successfully!');
      setTechModal({ open: false, data: { name: '', email: '', phone: '', specialization: '', experienceYears: 3 } });
      fetchDashboardData();
    } catch (err) {
      setError(err.message || 'Failed to save technician');
    }
  };

  const handleToggleTechAvailability = async (id, currentAvailable) => {
    try {
      await techniciansAPI.setAvailability(id, !currentAvailable);
      fetchDashboardData();
    } catch (err) {
      setError(err.message || 'Failed to toggle availability');
    }
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    try {
      if (serviceModal.editingId) {
        await servicesAPI.update(serviceModal.editingId, serviceModal.data);
        setSuccess('Service package updated!');
      } else {
        await servicesAPI.create(serviceModal.data);
        setSuccess('New service package created!');
      }
      setServiceModal({ open: false, editingId: null, data: { serviceName: '', description: '', price: '', estimatedTime: 60, category: 'General' } });
      fetchDashboardData();
    } catch (err) {
      setError(err.message || 'Failed to save service package');
    }
  };

  const handleSaveSparePart = async (e) => {
    e.preventDefault();
    try {
      await sparePartsAPI.create(partModal.data);
      setSuccess('Spare part added to inventory!');
      setPartModal({ open: false, data: { partName: '', partNumber: '', quantity: 10, price: '', category: 'Mechanical', minStockLevel: 5 } });
      fetchDashboardData();
    } catch (err) {
      setError(err.message || 'Failed to create spare part');
    }
  };

  const handleAdjustStock = async (e) => {
    e.preventDefault();
    try {
      await sparePartsAPI.adjustStock(stockDeltaModal.partId, stockDeltaModal.delta);
      setSuccess('Inventory stock adjusted successfully!');
      setStockDeltaModal({ open: false, partId: null, delta: 5 });
      fetchDashboardData();
    } catch (err) {
      setError(err.message || 'Failed to adjust stock');
    }
  };

  const handleAddPartToJobCard = async (e) => {
    e.preventDefault();
    try {
      await jobCardsAPI.addPart(addPartToJcModal.jobCardId, {
        partId: Number(addPartToJcModal.partId),
        quantity: Number(addPartToJcModal.quantity)
      });
      setSuccess('Spare part consumed, added to job card, and stock deducted!');
      setAddPartToJcModal({ open: false, jobCardId: null, partId: '', quantity: 1 });
      fetchDashboardData();
    } catch (err) {
      setError(err.message || 'Failed to add part to job card');
    }
  };

  const handleGenerateInvoice = async (bookingId) => {
    try {
      await invoicesAPI.generate({ bookingId, taxPercentage: 18.0 });
      setSuccess(`Tax invoice generated for booking #${bookingId}!`);
      fetchDashboardData();
    } catch (err) {
      setError(err.message || 'Failed to generate invoice');
    }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    try {
      await paymentsAPI.record({
        invoiceId: paymentModal.invoiceId,
        amount: paymentModal.amount,
        paymentMethod: paymentModal.paymentMethod,
        transactionReference: paymentModal.transactionReference
      });
      setSuccess('Payment recorded and settled! Invoice marked as PAID.');
      setPaymentModal({ open: false, invoiceId: null, amount: '', paymentMethod: 'UPI', transactionReference: '' });
      fetchDashboardData();
    } catch (err) {
      setError(err.message || 'Failed to record payment');
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="section-title">Workshop Administration Hub</h1>
          <p className="section-subtitle">Database Systems Engineering &amp; Distributed Backend Control Center</p>
        </div>
        <button onClick={fetchDashboardData} className="btn btn-secondary btn-sm">
          <RefreshCw size={15} /> Refresh All Datasets
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* KPI Stats Cards */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2563eb' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>TOTAL BOOKINGS</span>
              <Calendar size={20} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', marginTop: '0.5rem', color: '#0f172a' }}>{stats.totalBookings}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
              Pending: <strong>{stats.pendingBookings}</strong> • Active: <strong>{stats.inProgressServices}</strong>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>TOTAL REVENUE</span>
              <DollarSign size={20} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', marginTop: '0.5rem', color: '#10b981' }}>₹{stats.totalRevenue}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
              Completed: <strong>{stats.completedServices} services</strong>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6366f1' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>REGISTERED CUSTOMERS</span>
              <Users size={20} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', marginTop: '0.5rem', color: '#0f172a' }}>{stats.totalCustomers}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
              Active Technicians: <strong>{stats.totalTechnicians}</strong>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: stats.lowStockPartsCount > 0 ? '#ef4444' : '#10b981' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>INVENTORY ALERTS</span>
              <AlertTriangle size={20} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', marginTop: '0.5rem', color: stats.lowStockPartsCount > 0 ? '#ef4444' : '#0f172a' }}>
              {stats.lowStockPartsCount}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
              Low Stock Spare Part SKUs
            </div>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="tabs-nav">
        <button className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
          <Calendar size={18} /> Bookings ({bookings.length})
        </button>
        <button className={`tab-btn ${activeTab === 'technicians' ? 'active' : ''}`} onClick={() => setActiveTab('technicians')}>
          <Users size={18} /> Technicians ({technicians.length})
        </button>
        <button className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>
          <Wrench size={18} /> Service Catalog ({services.length})
        </button>
        <button className={`tab-btn ${activeTab === 'parts' ? 'active' : ''}`} onClick={() => setActiveTab('parts')}>
          <Package size={18} /> Spare Parts ({spareParts.length})
        </button>
        <button className={`tab-btn ${activeTab === 'jobCards' ? 'active' : ''}`} onClick={() => setActiveTab('jobCards')}>
          <FileText size={18} /> Job Cards ({jobCards.length})
        </button>
        <button className={`tab-btn ${activeTab === 'invoices' ? 'active' : ''}`} onClick={() => setActiveTab('invoices')}>
          <CreditCard size={18} /> Invoices &amp; Payments ({invoices.length})
        </button>
      </div>

      {/* TAB 1: BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Ref ID</th>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Service</th>
                <th>Date &amp; Time</th>
                <th>Technician</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.bookingId}>
                  <td><strong>#{b.bookingId}</strong></td>
                  <td>
                    {b.customerName}
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{b.customerPhone}</div>
                  </td>
                  <td>
                    <strong>{b.vehicleNumber}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{b.vehicleBrand} {b.vehicleModel}</div>
                  </td>
                  <td>{b.serviceName}</td>
                  <td>{b.bookingDate} {b.bookingTime}</td>
                  <td>
                    {b.technicianName ? (
                      <span style={{ fontWeight: '600', color: '#0f172a' }}>{b.technicianName}</span>
                    ) : (
                      <span style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: '600' }}>Unassigned</span>
                    )}
                  </td>
                  <td><StatusBadge status={b.status} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setAssignModal({ open: true, bookingId: b.bookingId, technicianId: b.technicianId || '' })}
                        className="btn btn-secondary btn-sm"
                        title="Assign or Reallocate Technician"
                      >
                        Assign
                      </button>
                      <button
                        onClick={() => setStatusModal({ open: true, bookingId: b.bookingId, status: b.status })}
                        className="btn btn-primary btn-sm"
                        title="Update Lifecycle Status"
                      >
                        Status
                      </button>
                      <button
                        onClick={() => handleGenerateInvoice(b.bookingId)}
                        className="btn btn-secondary btn-sm"
                        title="Generate Tax Invoice"
                      >
                        Invoice
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: TECHNICIANS */}
      {activeTab === 'technicians' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button onClick={() => setTechModal({ ...techModal, open: true })} className="btn btn-primary btn-sm">
              <Plus size={16} /> Add Technician
            </button>
          </div>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Specialization</th>
                  <th>Experience</th>
                  <th>Availability</th>
                  <th>Toggle</th>
                </tr>
              </thead>
              <tbody>
                {technicians.map(t => (
                  <tr key={t.technicianId}>
                    <td><strong>#{t.technicianId}</strong></td>
                    <td><strong>{t.name}</strong></td>
                    <td>{t.phone}</td>
                    <td>{t.specialization}</td>
                    <td>{t.experienceYears} Years</td>
                    <td>
                      <span className={`badge ${t.available ? 'badge-completed' : 'badge-cancelled'}`}>
                        {t.available ? 'Available' : 'Busy / Off-duty'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleTechAvailability(t.technicianId, t.available)}
                        className="btn btn-secondary btn-sm"
                      >
                        {t.available ? 'Mark Busy' : 'Mark Available'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SERVICES CATALOG */}
      {activeTab === 'services' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button
              onClick={() => setServiceModal({
                open: true,
                editingId: null,
                data: { serviceName: '', description: '', price: '', estimatedTime: 60, category: 'General' }
              })}
              className="btn btn-primary btn-sm"
            >
              <Plus size={16} /> Add Service Package
            </button>
          </div>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Service Name</th>
                  <th>Category</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map(s => (
                  <tr key={s.serviceId}>
                    <td><strong>#{s.serviceId}</strong></td>
                    <td><strong>{s.serviceName}</strong></td>
                    <td>{s.category}</td>
                    <td>{s.estimatedTime} mins</td>
                    <td><strong>₹{s.price}</strong></td>
                    <td>
                      <span className={`badge ${s.isActive ? 'badge-completed' : 'badge-cancelled'}`}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => setServiceModal({
                          open: true,
                          editingId: s.serviceId,
                          data: {
                            serviceName: s.serviceName,
                            description: s.description,
                            price: s.price,
                            estimatedTime: s.estimatedTime,
                            category: s.category || 'General'
                          }
                        })}
                        className="btn btn-secondary btn-sm"
                      >
                        <Edit size={14} /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SPARE PARTS INVENTORY */}
      {activeTab === 'parts' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button onClick={() => setPartModal({ ...partModal, open: true })} className="btn btn-primary btn-sm">
              <Plus size={16} /> Add Spare Part SKU
            </button>
          </div>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Part Description</th>
                  <th>SKU / Part Number</th>
                  <th>Category</th>
                  <th>Stock Quantity</th>
                  <th>Unit Price</th>
                  <th>Status</th>
                  <th>Stock Adjustment</th>
                </tr>
              </thead>
              <tbody>
                {spareParts.map(p => (
                  <tr key={p.partId}>
                    <td><strong>#{p.partId}</strong></td>
                    <td><strong>{p.partName}</strong></td>
                    <td><code>{p.partNumber}</code></td>
                    <td>{p.category}</td>
                    <td><strong style={{ fontSize: '1.05rem' }}>{p.quantity}</strong></td>
                    <td>₹{p.price}</td>
                    <td>
                      {p.quantity <= p.minStockLevel ? (
                        <span className="badge badge-cancelled">Low Stock Alert ({p.quantity})</span>
                      ) : (
                        <span className="badge badge-completed">In Stock</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => setStockDeltaModal({ open: true, partId: p.partId, delta: 10 })}
                          className="btn btn-secondary btn-sm"
                          title="Restock part (+10)"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => setStockDeltaModal({ open: true, partId: p.partId, delta: -1 })}
                          disabled={p.quantity <= 0}
                          className="btn btn-secondary btn-sm"
                          title="Manual audit reduction (-1)"
                        >
                          -1
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: JOB CARDS */}
      {activeTab === 'jobCards' && (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Job Card No</th>
                <th>Booking Ref</th>
                <th>Vehicle</th>
                <th>Assigned Tech</th>
                <th>Diagnosis</th>
                <th>Parts Used</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobCards.map(jc => (
                <tr key={jc.jobCardId}>
                  <td><strong>{jc.jobCardNumber}</strong></td>
                  <td>#{jc.bookingId}</td>
                  <td><strong>{jc.vehicleNumber}</strong></td>
                  <td>{jc.technicianName || 'Unassigned'}</td>
                  <td><div style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{jc.diagnosis || jc.problemDescription}</div></td>
                  <td>
                    {jc.parts && jc.parts.length > 0 ? (
                      <span className="badge badge-confirmed">{jc.parts.length} parts logged</span>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No parts logged</span>
                    )}
                  </td>
                  <td><StatusBadge status={jc.status} /></td>
                  <td>
                    <button
                      onClick={() => setAddPartToJcModal({ open: true, jobCardId: jc.jobCardId, partId: spareParts[0]?.partId || '', quantity: 1 })}
                      className="btn btn-secondary btn-sm"
                    >
                      <Plus size={14} /> Log Part
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 6: INVOICES & PAYMENTS */}
      {activeTab === 'invoices' && (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Booking Ref</th>
                <th>Customer</th>
                <th>Service Amt</th>
                <th>Parts Amt</th>
                <th>Total Bill</th>
                <th>Payment Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.invoiceId}>
                  <td><strong>{inv.invoiceNumber}</strong></td>
                  <td>#{inv.bookingId}</td>
                  <td>{inv.customerName}</td>
                  <td>₹{inv.serviceAmount}</td>
                  <td>₹{inv.partsAmount}</td>
                  <td><strong style={{ color: '#2563eb', fontSize: '1rem' }}>₹{inv.totalAmount}</strong></td>
                  <td><StatusBadge status={inv.paymentStatus} /></td>
                  <td>
                    {inv.paymentStatus !== 'PAID' ? (
                      <button
                        onClick={() => setPaymentModal({
                          open: true,
                          invoiceId: inv.invoiceId,
                          amount: inv.totalAmount,
                          paymentMethod: 'UPI',
                          transactionReference: ''
                        })}
                        className="btn btn-success btn-sm"
                      >
                        <CreditCard size={14} /> Record Payment
                      </button>
                    ) : (
                      <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <CheckCircle size={15} /> Settled
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 1. Modal: Assign Technician */}
      <Modal
        isOpen={assignModal.open}
        onClose={() => setAssignModal({ open: false, bookingId: null, technicianId: '' })}
        title="Assign Specialist Technician"
      >
        <form onSubmit={handleAssignTechnician}>
          <div className="form-group">
            <label className="form-label">Select Technician for Booking #{assignModal.bookingId}</label>
            <select
              className="form-control"
              required
              value={assignModal.technicianId}
              onChange={(e) => setAssignModal({ ...assignModal, technicianId: e.target.value })}
            >
              <option value="">-- Choose Available Specialist --</option>
              {technicians.map(t => (
                <option key={t.technicianId} value={t.technicianId}>
                  {t.name} • {t.specialization} ({t.available ? 'Available' : 'Busy'})
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setAssignModal({ open: false, bookingId: null, technicianId: '' })} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Assign &amp; Confirm Booking
            </button>
          </div>
        </form>
      </Modal>

      {/* 2. Modal: Update Status */}
      <Modal
        isOpen={statusModal.open}
        onClose={() => setStatusModal({ open: false, bookingId: null, status: 'CONFIRMED' })}
        title="Update Booking Lifecycle Status"
      >
        <form onSubmit={handleUpdateStatus}>
          <div className="form-group">
            <label className="form-label">Set New Status for Booking #{statusModal.bookingId}</label>
            <select
              className="form-control"
              value={statusModal.status}
              onChange={(e) => setStatusModal({ ...statusModal, status: e.target.value })}
            >
              <option value="CONFIRMED">CONFIRMED (Appointment approved)</option>
              <option value="IN_PROGRESS">IN_PROGRESS (Vehicle in bay)</option>
              <option value="COMPLETED">COMPLETED (Diagnostics &amp; repairs done)</option>
              <option value="CANCELLED">CANCELLED (Cancel appointment)</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setStatusModal({ open: false, bookingId: null, status: 'CONFIRMED' })} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Status Transition
            </button>
          </div>
        </form>
      </Modal>

      {/* 3. Modal: Add Technician */}
      <Modal
        isOpen={techModal.open}
        onClose={() => setTechModal({ ...techModal, open: false })}
        title="Register New Garage Technician"
      >
        <form onSubmit={handleSaveTechnician}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              required
              className="form-control"
              value={techModal.data.name}
              onChange={(e) => setTechModal({ ...techModal, data: { ...techModal.data, name: e.target.value } })}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                required
                className="form-control"
                value={techModal.data.phone}
                onChange={(e) => setTechModal({ ...techModal, data: { ...techModal.data, phone: e.target.value } })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Experience (Years)</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={techModal.data.experienceYears}
                onChange={(e) => setTechModal({ ...techModal, data: { ...techModal.data, experienceYears: parseInt(e.target.value) || 0 } })}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Specialization / Expertise</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Engine &amp; Transmission, Brakes, AC &amp; Electrical"
              value={techModal.data.specialization}
              onChange={(e) => setTechModal({ ...techModal, data: { ...techModal.data, specialization: e.target.value } })}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setTechModal({ ...techModal, open: false })} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Save Technician</button>
          </div>
        </form>
      </Modal>

      {/* 4. Modal: Add/Edit Service */}
      <Modal
        isOpen={serviceModal.open}
        onClose={() => setServiceModal({ ...serviceModal, open: false })}
        title={serviceModal.editingId ? 'Edit Service Package' : 'Create Service Package'}
      >
        <form onSubmit={handleSaveService}>
          <div className="form-group">
            <label className="form-label">Service Package Name</label>
            <input
              type="text"
              required
              className="form-control"
              value={serviceModal.data.serviceName}
              onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, serviceName: e.target.value } })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="2"
              value={serviceModal.data.description}
              onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, description: e.target.value } })}
            ></textarea>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Price (₹)</label>
              <input
                type="number"
                step="0.01"
                required
                className="form-control"
                value={serviceModal.data.price}
                onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, price: e.target.value } })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Estimated Duration (Mins)</label>
              <input
                type="number"
                min="15"
                required
                className="form-control"
                value={serviceModal.data.estimatedTime}
                onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, estimatedTime: parseInt(e.target.value) || 60 } })}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <input
              type="text"
              className="form-control"
              value={serviceModal.data.category}
              onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, category: e.target.value } })}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setServiceModal({ ...serviceModal, open: false })} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Save Package</button>
          </div>
        </form>
      </Modal>

      {/* 5. Modal: Add Spare Part SKU */}
      <Modal
        isOpen={partModal.open}
        onClose={() => setPartModal({ ...partModal, open: false })}
        title="Add Spare Part to Inventory"
      >
        <form onSubmit={handleSaveSparePart}>
          <div className="form-group">
            <label className="form-label">Part Name</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Ceramic Front Brake Pads"
              value={partModal.data.partName}
              onChange={(e) => setPartModal({ ...partModal, data: { ...partModal.data, partName: e.target.value } })}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Part Number / SKU</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="SP-BRK-001"
                value={partModal.data.partNumber}
                onChange={(e) => setPartModal({ ...partModal, data: { ...partModal.data, partNumber: e.target.value.toUpperCase() } })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-control"
                value={partModal.data.category}
                onChange={(e) => setPartModal({ ...partModal, data: { ...partModal.data, category: e.target.value } })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Opening Quantity</label>
              <input
                type="number"
                min="0"
                required
                className="form-control"
                value={partModal.data.quantity}
                onChange={(e) => setPartModal({ ...partModal, data: { ...partModal.data, quantity: parseInt(e.target.value) || 0 } })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Unit Price (₹)</label>
              <input
                type="number"
                step="0.01"
                required
                className="form-control"
                value={partModal.data.price}
                onChange={(e) => setPartModal({ ...partModal, data: { ...partModal.data, price: e.target.value } })}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setPartModal({ ...partModal, open: false })} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Add SKU</button>
          </div>
        </form>
      </Modal>

      {/* 6. Modal: Quick Stock Adjustment */}
      <Modal
        isOpen={stockDeltaModal.open}
        onClose={() => setStockDeltaModal({ open: false, partId: null, delta: 5 })}
        title="Adjust Inventory Stock Quantity"
      >
        <form onSubmit={handleAdjustStock}>
          <div className="form-group">
            <label className="form-label">Adjustment Delta (Positive to Restock, Negative to Deduct)</label>
            <input
              type="number"
              className="form-control"
              required
              value={stockDeltaModal.delta}
              onChange={(e) => setStockDeltaModal({ ...stockDeltaModal, delta: parseInt(e.target.value) || 0 })}
            />
            <span style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
              Backend will validate that stock does not fall below 0.
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setStockDeltaModal({ open: false, partId: null, delta: 5 })} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Apply Stock Adjustment</button>
          </div>
        </form>
      </Modal>

      {/* 7. Modal: Add Part to Job Card */}
      <Modal
        isOpen={addPartToJcModal.open}
        onClose={() => setAddPartToJcModal({ open: false, jobCardId: null, partId: '', quantity: 1 })}
        title="Log Spare Part to Job Card"
      >
        <form onSubmit={handleAddPartToJobCard}>
          <div className="form-group">
            <label className="form-label">Select Spare Part from Stock</label>
            <select
              className="form-control"
              required
              value={addPartToJcModal.partId}
              onChange={(e) => setAddPartToJcModal({ ...addPartToJcModal, partId: e.target.value })}
            >
              <option value="">-- Choose Spare Part --</option>
              {spareParts.map(p => (
                <option key={p.partId} value={p.partId} disabled={p.quantity <= 0}>
                  {p.partName} ({p.partNumber}) - ₹{p.price} [Available: {p.quantity}]
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Quantity to Consume</label>
            <input
              type="number"
              min="1"
              required
              className="form-control"
              value={addPartToJcModal.quantity}
              onChange={(e) => setAddPartToJcModal({ ...addPartToJcModal, quantity: parseInt(e.target.value) || 1 })}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setAddPartToJcModal({ open: false, jobCardId: null, partId: '', quantity: 1 })} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Attach Part &amp; Deduct Stock</button>
          </div>
        </form>
      </Modal>

      {/* 8. Modal: Record Payment */}
      <Modal
        isOpen={paymentModal.open}
        onClose={() => setPaymentModal({ open: false, invoiceId: null, amount: '', paymentMethod: 'UPI', transactionReference: '' })}
        title="Record Invoice Settlement &amp; Payment"
      >
        <form onSubmit={handleRecordPayment}>
          <div className="form-group">
            <label className="form-label">Settlement Amount (₹)</label>
            <input
              type="number"
              step="0.01"
              required
              className="form-control"
              value={paymentModal.amount}
              onChange={(e) => setPaymentModal({ ...paymentModal, amount: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <select
              className="form-control"
              value={paymentModal.paymentMethod}
              onChange={(e) => setPaymentModal({ ...paymentModal, paymentMethod: e.target.value })}
            >
              <option value="UPI">UPI / Google Pay / PhonePe</option>
              <option value="CARD">Credit / Debit Card POS</option>
              <option value="CASH">Cash at Counter</option>
              <option value="NET_BANKING">Net Banking / IMPS</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Transaction Reference (Optional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. UPI-TXN-98721345"
              value={paymentModal.transactionReference}
              onChange={(e) => setPaymentModal({ ...paymentModal, transactionReference: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setPaymentModal({ open: false, invoiceId: null, amount: '', paymentMethod: 'UPI', transactionReference: '' })} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-success">Verify &amp; Confirm Settlement</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboardPage;

