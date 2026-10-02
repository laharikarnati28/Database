import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminSidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <aside className="sidebar">

            <h2 className="sidebar-title">
                Hostel Management
            </h2>

            <nav className="sidebar-nav">

                <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) =>
                        isActive
                            ? "sidebar-link active"
                            : "sidebar-link"
                    }
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/admin/students"
                    className={({ isActive }) =>
                        isActive
                            ? "sidebar-link active"
                            : "sidebar-link"
                    }
                >
                    Students
                </NavLink>

                <NavLink
                    to="/admin/wardens"
                    className={({ isActive }) =>
                        isActive
                            ? "sidebar-link active"
                            : "sidebar-link"
                    }
                >
                    Wardens
                </NavLink>

                <NavLink
                    to="/admin/hostels"
                    className={({ isActive }) =>
                        isActive
                            ? "sidebar-link active"
                            : "sidebar-link"
                    }
                >
                    Hostels
                </NavLink>

                <NavLink
                    to="/admin/rooms"
                    className={({ isActive }) =>
                        isActive
                            ? "sidebar-link active"
                            : "sidebar-link"
                    }
                >
                    Rooms
                </NavLink>

                <NavLink
                    to="/admin/mess"
                    className={({ isActive }) =>
                        isActive
                            ? "sidebar-link active"
                            : "sidebar-link"
                    }
                >
                    Mess
                </NavLink>

                <NavLink
                    to="/admin/payments"
                    className={({ isActive }) =>
                        isActive
                            ? "sidebar-link active"
                            : "sidebar-link"
                    }
                >
                    Payments
                </NavLink>

                <NavLink
                    to="/admin/reports"
                    className={({ isActive }) =>
                        isActive
                            ? "sidebar-link active"
                            : "sidebar-link"
                    }
                >
                    Reports
                </NavLink>

            </nav>

            <button
                className="logout-button"
                onClick={handleLogout}
            >
                Logout
            </button>

        </aside>
    );
};

export default AdminSidebar;