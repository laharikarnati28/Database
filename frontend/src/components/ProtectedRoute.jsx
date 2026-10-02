import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useAuth();

    // User is not logged in
    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    // Route does not specify roles
    // so any logged-in user can access it
    if (!allowedRoles) {
        return <Outlet />;
    }

    // User is logged in but does not
    // have permission for this section
    if (!allowedRoles.includes(user.role)) {
        if (user.role === "student") {
            return (
                <Navigate
                    to="/student"
                    replace
                />
            );
        }

        if (user.role === "warden") {
            return (
                <Navigate
                    to="/warden"
                    replace
                />
            );
        }

        if (user.role === "admin") {
            return (
                <Navigate
                    to="/admin"
                    replace
                />
            );
        }

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return <Outlet />;
};

export default ProtectedRoute;