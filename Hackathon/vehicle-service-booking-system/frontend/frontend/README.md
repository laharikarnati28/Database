# Vehicle Service Booking System - React Frontend

The frontend is a single-page application built with **React 18**, **Vite**, **React Router v6**, **Axios**, and **Lucide React**.

---

## 1. Design & UI Features

- **Branding**: VehicleCare Automobile Workshop.
- **Palette**: Professional Navy Blue (`#0f172a`), Royal Blue (`#2563eb`), Clean White backgrounds, Emerald Green (`#059669`) success accents, and Slate Gray cards.
- **Typography**: Clean system typography with high readability.
- **Components**:
  - `Navbar`: Responsive navigation with role-aware action badges and quick login/logout.
  - `TrackerProgress`: Real-time visual progress stepper for `BOOKED` → `CONFIRMED` → `IN_PROGRESS` → `COMPLETED` / `CANCELLED`.
  - `StatusBadge`: Color-coded status tags for bookings, job cards, and invoices.
  - `Modal`: Reusable modal dialog for forms and printable invoices.
  - `ProtectedRoute`: Role-based route guard for customer, admin, and technician routes.
- **Pages**:
  - `HomePage`: Hero section, service packages, stats, and workflow steps.
  - `ServicesPage`: Full catalog with descriptions, pricing in INR (₹), and one-click booking.
  - `VehiclesPage`: Customer vehicle garage to add, view, and delete vehicles.
  - `BookingPage`: Multi-step validated booking form with vehicle and service selectors.
  - `TrackingPage`: Visual progress tracker with auto-refresh / manual poll for active jobs.
  - `HistoryPage`: Past services and printable invoice viewer.
  - `AdminDashboardPage`: Comprehensive admin management console with 8 management tabs:
    1. Overview (Revenue, bookings, technicians, inventory stats)
    2. Bookings & Technician Assignment
    3. Job Cards & Spare Parts Allocation
    4. Spare Parts Inventory & Stock Adjustment
    5. Invoices & Billing
    6. Services Catalog Management
    7. Technicians Directory
    8. Customer Registry
  - `LoginPage` & `RegisterPage`: Clean auth forms with one-click demo credentials filling.

---

## 2. Directory Structure

```
frontend/
├── public/
├── src/
│   ├── components/       # Reusable UI elements (Navbar, Footer, StatusBadge, Modal, etc.)
│   ├── context/          # AuthContext (JWT, active user, login/logout handlers)
│   ├── pages/            # Page views (Home, Services, Vehicles, Booking, Tracking, Admin, etc.)
│   ├── services/         # Axios API client (auth, bookings, vehicles, admin endpoints)
│   ├── App.css           # Modern stylesheet with CSS custom properties
│   ├── App.jsx           # Route definitions & layout shell
│   └── main.jsx          # React DOM entry point
├── .env                  # Frontend environment variables
├── index.html            # Single Page Application HTML host
├── package.json          # Node dependencies and scripts
└── vite.config.js        # Vite configuration with proxy to backend
```

---

## 3. Getting Started

### Prerequisites
- Node.js 18.x or 20.x+ (`node -v`)
- npm 9.x+ (`npm -v`)

### Install Dependencies
```powershell
cd d:\DBMSE\Vechile_Service_Management\vehicle-service-booking-system\frontend
cmd /c npm install
```

### Start Development Server
```powershell
cmd /c npm run dev
```
The application will launch on [http://localhost:5173](http://localhost:5173).

### Production Build
```powershell
cmd /c npm run build
```
Creates an optimized production bundle in `dist/`.

---

## 4. API Integration & Proxy

In `vite.config.js`, requests starting with `/api` are automatically proxied to the Spring Boot backend at `http://localhost:8080`:

```javascript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false
    }
  }
}
```

Axios automatically attaches the JWT token from `localStorage` in the `Authorization: Bearer <token>` header for all authenticated requests via interceptors.

