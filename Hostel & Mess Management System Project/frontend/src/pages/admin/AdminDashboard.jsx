import { useEffect, useState } from "react";

import adminService from "../../services/adminService";
import AdminSidebar from "../../components/AdminSidebar";

const AdminDashboard = () => {
    const [summary, setSummary] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const data =
                    await adminService.getDashboardSummary();

                setSummary(data.summary);

            } catch (error) {
                console.error(
                    "Failed to fetch admin dashboard:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load admin dashboard"
                );

            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="student-layout">

                <AdminSidebar />

                <main className="dashboard-content">

                    <h2>
                        Loading admin dashboard...
                    </h2>

                </main>

            </div>
        );
    }

    if (error) {
        return (
            <div className="student-layout">

                <AdminSidebar />

                <main className="dashboard-content">

                    <h1>
                        Admin Dashboard
                    </h1>

                    <div className="login-error">
                        {error}
                    </div>

                </main>

            </div>
        );
    }

    return (
        <div className="student-layout">

            <AdminSidebar />

            <main className="dashboard-content">

                <div className="dashboard-header">

                    <h1>
                        Admin Dashboard
                    </h1>

                    <p>
                        Overview of the hostel
                        management system.
                    </p>

                </div>

                <div className="info-grid">

                    <div className="info-card">
                        <h3>
                            Total Students
                        </h3>

                        <p>
                            {summary.total_students}
                        </p>
                    </div>

                    <div className="info-card">
                        <h3>
                            Total Wardens
                        </h3>

                        <p>
                            {summary.total_wardens}
                        </p>
                    </div>

                    <div className="info-card">
                        <h3>
                            Total Hostels
                        </h3>

                        <p>
                            {summary.total_hostels}
                        </p>
                    </div>

                    <div className="info-card">
                        <h3>
                            Total Rooms
                        </h3>

                        <p>
                            {summary.total_rooms}
                        </p>
                    </div>

                    <div className="info-card">
                        <h3>
                            Pending Complaints
                        </h3>

                        <p>
                            {summary.pending_complaints}
                        </p>
                    </div>

                    <div className="info-card">
                        <h3>
                            Pending Leaves
                        </h3>

                        <p>
                            {summary.pending_leaves}
                        </p>
                    </div>

                </div>

                <section className="dashboard-section">

                    <h2>
                        System Overview
                    </h2>

                    <p>
                        The dashboard displays live
                        information retrieved from
                        the hostel management database.
                    </p>

                </section>

            </main>

        </div>
    );
};

export default AdminDashboard;