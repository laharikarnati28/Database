import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token to requests if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Format responses and handle unauthorized errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error.response?.data || { message: error.message });
  }
);

// 1. Authentication Endpoints
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me')
};

// 2. Customer Endpoints
export const customersAPI = {
  getAll: () => api.get('/customers'),
  getById: (id) => api.get(`/customers/${id}`)
};

// 3. Vehicles Endpoints
export const vehiclesAPI = {
  getAll: (userId) => api.get('/vehicles', { params: userId ? { userId } : {} }),
  getById: (id) => api.get(`/vehicles/${id}`),
  create: (data) => api.post('/vehicles', data),
  update: (id, data) => api.put(`/vehicles/${id}`, data),
  delete: (id) => api.delete(`/vehicles/${id}`)
};

// 4. Services Catalog Endpoints
export const servicesAPI = {
  getAll: (all = false) => api.get('/services', { params: { all } }),
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`)
};

// 5. Technicians Endpoints
export const techniciansAPI = {
  getAll: (availableOnly = false) => api.get('/technicians', { params: { availableOnly } }),
  getById: (id) => api.get(`/technicians/${id}`),
  create: (data) => api.post('/technicians', data),
  update: (id, data) => api.put(`/technicians/${id}`, data),
  setAvailability: (id, available) => api.put(`/technicians/${id}/availability`, null, { params: { available } })
};

// 6. Bookings Endpoints
export const bookingsAPI = {
  getAll: (userId) => api.get('/bookings', { params: userId ? { userId } : {} }),
  getMy: () => api.get('/bookings/my'),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  assignTechnician: (id, technicianId) => api.post(`/bookings/${id}/assign-technician`, { technicianId }),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`)
};

// 7. Job Cards Endpoints
export const jobCardsAPI = {
  getAll: () => api.get('/job-cards'),
  getById: (id) => api.get(`/job-cards/${id}`),
  getByBookingId: (bookingId) => api.get(`/job-cards/booking/${bookingId}`),
  create: (data) => api.post('/job-cards', data),
  update: (id, data) => api.put(`/job-cards/${id}`, data),
  addPart: (id, data) => api.post(`/job-cards/${id}/parts`, data)
};

// 8. Spare Parts Inventory Endpoints
export const sparePartsAPI = {
  getAll: () => api.get('/spare-parts'),
  getLowStock: () => api.get('/spare-parts/low-stock'),
  getById: (id) => api.get(`/spare-parts/${id}`),
  create: (data) => api.post('/spare-parts', data),
  update: (id, data) => api.put(`/spare-parts/${id}`, data),
  adjustStock: (id, delta) => api.patch(`/spare-parts/${id}/stock`, null, { params: { delta } })
};

// 9. Invoices Endpoints
export const invoicesAPI = {
  getAll: () => api.get('/invoices'),
  getById: (id) => api.get(`/invoices/${id}`),
  getByBookingId: (bookingId) => api.get(`/invoices/booking/${bookingId}`),
  generate: (data) => api.post('/invoices', data),
  markPaid: (id) => api.put(`/invoices/${id}/pay`)
};

// 10. Payments Endpoints
export const paymentsAPI = {
  record: (data) => api.post('/payments', data),
  getById: (id) => api.get(`/payments/${id}`),
  getByInvoiceId: (invoiceId) => api.get(`/payments/invoice/${invoiceId}`)
};

// 11. Dashboard Endpoints
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats')
};

export default api;

