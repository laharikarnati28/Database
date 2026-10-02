import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const WardenSidebar = () => {
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
                    to="/warden"
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
                    to="/warden/students"
                    className={({ isActive }) =>
                        isActive
                            ? "sidebar-link active"
                            : "sidebar-link"
                    }
                >
                    Students
                </NavLink>

                <NavLink
                    to="/warden/rooms"
                    className={({ isActive }) =>
                        isActive
                            ? "sidebar-link active"
                            : "sidebar-link"
                    }
                >
                    Rooms
                </NavLink>

                <NavLink
                    to="/warden/allocations"
                    className={({ isActive }) =>
                        isActive
                            ? "sidebar-link active"
                            : "sidebar-link"
                    }
                >
                    Room Allocations
                </NavLink>

                <NavLink
                    to="/warden/complaints"
                    className={({ isActive }) =>
                        isActive
                            ? "sidebar-link active"
                            : "sidebar-link"
                    }
                >
                    Complaints
                </NavLink>

                <NavLink
                    to="/warden/leaves"
                    className={({ isActive }) =>
                        isActive
                            ? "sidebar-link active"
                            : "sidebar-link"
                    }
                >
                    Leave Requests
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

export default WardenSidebar;