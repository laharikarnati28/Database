import { useEffect, useState } from "react";

import wardenService from "../../services/wardenService";
import WardenSidebar from "../../components/WardenSidebar";

const WardenDashboard = () => {
    const [summary, setSummary] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================================
    // FETCH DASHBOARD DATA
    // =========================================

    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                const data =
                    await wardenService
                        .getDashboardSummary();

                setSummary(
                    data.summary
                );

            } catch (error) {

                console.error(
                    "Failed to fetch warden dashboard:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load warden dashboard"
                );

            } finally {

                setLoading(false);
            }
        };


        fetchDashboard();

    }, []);


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (
            <div className="student-layout">

                <WardenSidebar />

                <main className="dashboard-content">

                    <h2>
                        Loading warden dashboard...
                    </h2>

                </main>

            </div>
        );
    }


    // =========================================
    // ERROR
    // =========================================

    if (error) {

        return (
            <div className="student-layout">

                <WardenSidebar />

                <main className="dashboard-content">

                    <h1>
                        Warden Dashboard
                    </h1>

                    <div className="login-error">
                        {error}
                    </div>

                </main>

            </div>
        );
    }


    // =========================================
    // DASHBOARD
    // =========================================

    return (
        <div className="student-layout">

            <WardenSidebar />

            <main className="dashboard-content">

                {/* ========================= */}
                {/* HEADER */}
                {/* ========================= */}

                <div className="dashboard-header">

                    <h1>
                        Warden Dashboard
                    </h1>

                    <p>
                        Overview of current hostel
                        operations.
                    </p>

                </div>


                {/* ========================= */}
                {/* BASIC STATISTICS */}
                {/* ========================= */}

                <div className="info-grid">

                    <div className="info-card">

                        <h3>
                            Total Students
                        </h3>

                        <p>
                            {
                                summary.total_students
                            }
                        </p>

                    </div>


                    <div className="info-card">

                        <h3>
                            Total Rooms
                        </h3>

                        <p>
                            {
                                summary.total_rooms
                            }
                        </p>

                    </div>


                    <div className="info-card">

                        <h3>
                            Total Bed Capacity
                        </h3>

                        <p>
                            {
                                summary.total_capacity
                            }
                        </p>

                    </div>


                    <div className="info-card">

                        <h3>
                            Occupied Beds
                        </h3>

                        <p>
                            {
                                summary.occupied_beds
                            }
                        </p>

                    </div>


                    <div className="info-card">

                        <h3>
                            Available Beds
                        </h3>

                        <p>
                            {
                                summary.available_beds
                            }
                        </p>

                    </div>


                    <div className="info-card">

                        <h3>
                            Pending Complaints
                        </h3>

                        <p>
                            {
                                summary.pending_complaints
                            }
                        </p>

                    </div>


                    <div className="info-card">

                        <h3>
                            Pending Leave Requests
                        </h3>

                        <p>
                            {
                                summary.pending_leaves
                            }
                        </p>

                    </div>

                </div>


                {/* ========================= */}
                {/* ROOM OVERVIEW */}
                {/* ========================= */}

                <section className="dashboard-section">

                    <h2>
                        Room Overview
                    </h2>

                    <div className="detail-grid">

                        <div className="detail-item">

                            <span>
                                Total Rooms
                            </span>

                            <strong>
                                {
                                    summary.total_rooms
                                }
                            </strong>

                        </div>


                        <div className="detail-item">

                            <span>
                                Total Bed Capacity
                            </span>

                            <strong>
                                {
                                    summary.total_capacity
                                }
                            </strong>

                        </div>


                        <div className="detail-item">

                            <span>
                                Occupied Beds
                            </span>

                            <strong>
                                {
                                    summary.occupied_beds
                                }
                            </strong>

                        </div>


                        <div className="detail-item">

                            <span>
                                Available Beds
                            </span>

                            <strong>
                                {
                                    summary.available_beds
                                }
                            </strong>

                        </div>

                    </div>

                </section>


                {/* ========================= */}
                {/* PENDING ACTIONS */}
                {/* ========================= */}

                <section className="dashboard-section">

                    <h2>
                        Pending Actions
                    </h2>

                    <div className="detail-grid">

                        <div className="detail-item">

                            <span>
                                Pending Complaints
                            </span>

                            <strong>
                                {
                                    summary.pending_complaints
                                }
                            </strong>

                        </div>


                        <div className="detail-item">

                            <span>
                                Pending Leave Requests
                            </span>

                            <strong>
                                {
                                    summary.pending_leaves
                                }
                            </strong>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
};

export default WardenDashboard;