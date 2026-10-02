import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";

// STUDENT
import StudentDashboard from "./pages/student/StudentDashboard";
import Profile from "./pages/student/Profile";
import Room from "./pages/student/Room";
import Payments from "./pages/student/Payments";
import Mess from "./pages/student/Mess";
import Complaints from "./pages/student/Complaints";
import LeaveRequests from "./pages/student/LeaveRequests";

// WARDEN
import WardenDashboard from "./pages/warden/WardenDashboard";
import WardenStudents from "./pages/warden/Students";
import WardenRooms from "./pages/warden/Rooms";
import WardenAllocations from "./pages/warden/Allocations";
import WardenComplaints from "./pages/warden/Complaints";
import WardenLeaveRequests from "./pages/warden/LeaveRequests";

// ADMIN
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/Students";
import AdminWardens from "./pages/admin/Wardens";
import AdminHostels from "./pages/admin/Hostels";
import AdminRooms from "./pages/admin/Rooms";
import AdminMess from "./pages/admin/Mess";
import AdminPayments from "./pages/admin/Payments";
import AdminReports from "./pages/admin/Reports";

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    {/* ================= STUDENT ================= */}

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={["student"]}
                            />
                        }
                    >
                        <Route
                            path="/student"
                            element={<StudentDashboard />}
                        />

                        <Route
                            path="/student/profile"
                            element={<Profile />}
                        />

                        <Route
                            path="/student/room"
                            element={<Room />}
                        />

                        <Route
                            path="/student/mess"
                            element={<Mess />}
                        />

                        <Route
                            path="/student/complaints"
                            element={<Complaints />}
                        />

                        <Route
                            path="/student/leaves"
                            element={<LeaveRequests />}
                        />

                        <Route
                            path="/student/payments"
                            element={<Payments />}
                        />
                    </Route>

                    {/* ================= WARDEN ================= */}

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={["warden"]}
                            />
                        }
                    >
                        <Route
                            path="/warden"
                            element={<WardenDashboard />}
                        />

                        <Route
                            path="/warden/students"
                            element={<WardenStudents />}
                        />

                        <Route
                            path="/warden/rooms"
                            element={<WardenRooms />}
                        />

                        <Route
                            path="/warden/allocations"
                            element={<WardenAllocations />}
                        />

                        <Route
                            path="/warden/complaints"
                            element={<WardenComplaints />}
                        />

                        <Route
                            path="/warden/leaves"
                            element={<WardenLeaveRequests />}
                        />
                    </Route>

                    {/* ================= ADMIN ================= */}

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={["admin"]}
                            />
                        }
                    >
                        <Route
                            path="/admin"
                            element={<AdminDashboard />}
                        />

                        <Route
                            path="/admin/students"
                            element={<AdminStudents />}
                        />

                        <Route
                            path="/admin/wardens"
                            element={<AdminWardens />}
                        />

                        <Route
                            path="/admin/hostels"
                            element={<AdminHostels />}
                        />

                        <Route
                            path="/admin/rooms"
                            element={<AdminRooms />}
                        />

                        <Route
                            path="/admin/mess"
                            element={<AdminMess />}
                        />

                        <Route
                            path="/admin/payments"
                            element={<AdminPayments />}
                        />

                        <Route
                            path="/admin/reports"
                            element={<AdminReports />}
                        />
                    </Route>

                    {/* ================= FALLBACK ================= */}

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/login"
                                replace
                            />
                        }
                    />

                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;