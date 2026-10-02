# Hostel & Mess Management System

A full-stack web application for managing hostel and mess operations through separate dashboards for Students, Wardens, and Admins.

The system replaces manual hostel registers and spreadsheets with a centralized digital platform for room allocation, mess management, complaints, leave requests, payments, notifications, and administrative reporting.

---

## Features

### Student

- Student login using JWT authentication
- Student dashboard
- View personal profile
- View hostel and room allocation
- View mess menu
- Mark mess attendance
- View mess attendance history
- Submit complaints
- Track complaint status
- Submit leave requests
- Track leave request status
- View payment records
- Receive notifications
- Mark notifications as read

### Warden

- Warden login
- Warden dashboard
- View all students
- View hostel rooms
- View room allocations
- Allocate rooms
- Transfer room allocations
- Deallocate rooms
- View and manage complaints
- Update complaint status
- View and manage leave requests
- Approve or reject leave requests
- Create and manage mess menus
- View room occupancy information

### Admin

- Admin login
- Admin dashboard
- View students
- Create and manage wardens
- Create hostels
- Create rooms
- View room information
- Manage mess menus
- Create student payments
- Update payment status
- View all payments
- View system reports
- Monitor hostel occupancy
- Monitor complaints and leave requests

---

## Technology Stack

### Frontend

- React
- Vite
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express.js
- JWT
- bcryptjs
- CORS
- dotenv

### Database

- MySQL
- mysql2

### Development Tools

- Git
- GitHub
- Thunder Client

---

## Project Architecture

```text
                    ┌─────────────────────┐
                    │      React UI       │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │    Node.js /        │
                    │    Express Backend  │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
             ┌─────────────┐       ┌─────────────┐
             │ JWT / Auth  │       │   MySQL     │
             │ Middleware  │       │  Database   │
             └─────────────┘       └─────────────┘