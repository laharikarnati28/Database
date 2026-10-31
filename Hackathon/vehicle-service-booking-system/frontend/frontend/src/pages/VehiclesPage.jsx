import React, { useState, useEffect } from 'react';
import { vehiclesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import { Car, Plus, Edit2, Trash2, Fuel, Calendar, Tag, AlertCircle } from 'lucide-react';

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [formData, setFormData] = useState({
    vehicleNumber: '',
    brand: '',
    model: '',
    vehicleType: 'SEDAN',
    year: new Date().getFullYear(),
    fuelType: 'PETROL'
  });

  const { user } = useAuth();

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await vehiclesAPI.getAll();
      const list = res?.data || res;
      if (Array.isArray(list)) {
        setVehicles(list);
      }
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
      setError(err?.message || 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const openCreateModal = () => {
    setEditingVehicle(null);
    setFormData({
      vehicleNumber: '',
      brand: '',
      model: '',
      vehicleType: 'SEDAN',
      year: 2022,
      fuelType: 'PETROL'
    });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      vehicleNumber: vehicle.vehicleNumber,
      brand: vehicle.brand,
      model: vehicle.model,
      vehicleType: vehicle.vehicleType,
      year: vehicle.year,
      fuelType: vehicle.fuelType || 'PETROL'
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingVehicle) {
        await vehiclesAPI.update(editingVehicle.vehicleId, formData);
        setSuccess('Vehicle updated successfully!');
      } else {
        await vehiclesAPI.create(formData);
        setSuccess('Vehicle registered successfully!');
      }
      setIsModalOpen(false);
      await fetchVehicles();
    } catch (err) {
      setError(err?.message || 'Failed to save vehicle');
    }
  };

  const handleDelete = async (vehicleId, vehicleNumber) => {
    if (!window.confirm(`Are you sure you want to remove vehicle ${vehicleNumber}?`)) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      await vehiclesAPI.delete(vehicleId);
      setSuccess(`Vehicle ${vehicleNumber} removed successfully!`);
      fetchVehicles();
    } catch (err) {
      setError(err.message || 'Cannot delete vehicle. Dependent service booking records exist.');
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="section-title">My Registered Vehicles</h1>
          <p className="section-subtitle">Manage your garage profile for quick appointment scheduling</p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} /> Add New Vehicle
        </button>
      </div>

      {error && <div className="alert alert-error"><AlertCircle size={18} /> {error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your vehicles...</p>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="empty-state">
          <Car size={56} className="empty-state-icon" />
          <h3>No vehicles registered yet</h3>
          <p>Add your car or motorcycle to start booking maintenance services.</p>
          <button onClick={openCreateModal} className="btn btn-primary" style={{ marginTop: '1rem' }}>
            <Plus size={16} /> Add Your First Vehicle
          </button>
        </div>
      ) : (
        <div className="cards-grid">
          {vehicles.map(v => (
            <div key={v.vehicleId} className="card">
              <div className="card-header">
                <div>
                  <span style={{
                    display: 'inline-block',
                    background: '#1e3a8a',
                    color: '#ffffff',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    letterSpacing: '0.05em'
                  }}>
                    {v.vehicleNumber}
                  </span>
                  <h3 className="card-title" style={{ marginTop: '0.5rem' }}>
                    {v.brand} {v.model}
                  </h3>
                </div>
                <span className="badge badge-booked">{v.vehicleType}</span>
              </div>

              <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: '1.8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={16} /> <strong>Model Year:</strong> {v.year}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Fuel size={16} /> <strong>Fuel Type:</strong> {v.fuelType}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Tag size={16} /> <strong>Category:</strong> {v.vehicleType}
                </div>
              </div>

              <div className="card-footer">
                <button onClick={() => openEditModal(v)} className="btn btn-secondary btn-sm">
                  <Edit2 size={15} /> Edit
                </button>
                <button onClick={() => handleDelete(v.vehicleId, v.vehicleNumber)} className="btn btn-danger btn-sm">
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Vehicle Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingVehicle ? 'Edit Vehicle Details' : 'Register New Vehicle'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Registration Number (e.g., TS09EA1234)</label>
            <input
              type="text"
              className="form-control"
              required
              value={formData.vehicleNumber}
              onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
              placeholder="TS09EA1234"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Brand / Make</label>
              <input
                type="text"
                className="form-control"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Honda, Hyundai, Tata..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">Model</label>
              <input
                type="text"
                className="form-control"
                required
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="City ZX, Creta, Nexon..."
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Vehicle Type</label>
              <select
                className="form-control"
                value={formData.vehicleType}
                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
              >
                <option value="SEDAN">SEDAN</option>
                <option value="SUV">SUV</option>
                <option value="HATCHBACK">HATCHBACK</option>
                <option value="BIKE">BIKE</option>
                <option value="LUXURY">LUXURY</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Manufacturing Year</label>
              <input
                type="number"
                min="1990"
                max={new Date().getFullYear() + 1}
                className="form-control"
                required
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2022 })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Fuel Type</label>
            <select
              className="form-control"
              value={formData.fuelType}
              onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
            >
              <option value="PETROL">PETROL</option>
              <option value="DIESEL">DIESEL</option>
              <option value="CNG">CNG</option>
              <option value="ELECTRIC">ELECTRIC</option>
              <option value="HYBRID">HYBRID</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingVehicle ? 'Update Vehicle' : 'Save Vehicle'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VehiclesPage;

