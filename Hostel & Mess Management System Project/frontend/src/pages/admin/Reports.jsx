import { useEffect, useState } from "react";

import adminService from "../../services/adminService";
import AdminSidebar from "../../components/AdminSidebar";

const Reports = () => {
    const [reports, setReports] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const data =
                    await adminService.getReports();

                setReports(data.reports);

            } catch (error) {
                console.error(
                    "Failed to fetch reports:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load reports"
                );

            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (loading) {
        return (
            <div className="student-layout">

                <AdminSidebar />

                <main className="dashboard-content">

                    <h2>
                        Loading reports...
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
                        Reports
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

                {/* ========================= */}
                {/* HEADER */}
                {/* ========================= */}

                <div className="dashboard-header">

                    <h1>
                        Reports
                    </h1>

                    <p>
                        Overview of hostel management
                        system statistics.
                    </p>

                </div>


                {/* ========================= */}
                {/* BASIC STATISTICS */}
                {/* ========================= */}

                <section className="dashboard-section">

                    <h2>
                        Basic Statistics
                    </h2>

                    <div className="info-grid">

                        <div className="info-card">

                            <h3>
                                Total Students
                            </h3>

                            <p>
                                {reports.students.total}
                            </p>

                        </div>


                        <div className="info-card">

                            <h3>
                                Total Wardens
                            </h3>

                            <p>
                                {reports.wardens.total}
                            </p>

                        </div>


                        <div className="info-card">

                            <h3>
                                Total Hostels
                            </h3>

                            <p>
                                {reports.hostels.total}
                            </p>

                        </div>


                        <div className="info-card">

                            <h3>
                                Total Rooms
                            </h3>

                            <p>
                                {reports.rooms.total}
                            </p>

                        </div>

                    </div>

                </section>


                {/* ========================= */}
                {/* ROOM OCCUPANCY */}
                {/* ========================= */}

                <section className="dashboard-section">

                    <h2>
                        Room Occupancy
                    </h2>

                    <div className="info-grid">

                        <div className="info-card">

                            <h3>
                                Total Bed Capacity
                            </h3>

                            <p>
                                {reports.occupancy.total_capacity}
                            </p>

                        </div>


                        <div className="info-card">

                            <h3>
                                Occupied Beds
                            </h3>

                            <p>
                                {reports.occupancy.occupied_beds}
                            </p>

                        </div>


                        <div className="info-card">

                            <h3>
                                Available Beds
                            </h3>

                            <p>
                                {reports.occupancy.available_beds}
                            </p>

                        </div>

                    </div>

                </section>


                {/* ========================= */}
                {/* COMPLAINT REPORT */}
                {/* ========================= */}

                <section className="dashboard-section">

                    <h2>
                        Complaint Report
                    </h2>

                    <div className="info-grid">

                        <div className="info-card">

                            <h3>
                                Total Complaints
                            </h3>

                            <p>
                                {reports.complaints.total}
                            </p>

                        </div>


                        <div className="info-card">

                            <h3>
                                Pending
                            </h3>

                            <p>
                                {reports.complaints.pending}
                            </p>

                        </div>


                        <div className="info-card">

                            <h3>
                                In Progress
                            </h3>

                            <p>
                                {reports.complaints.in_progress}
                            </p>

                        </div>


                        <div className="info-card">

                            <h3>
                                Resolved
                            </h3>

                            <p>
                                {reports.complaints.resolved}
                            </p>

                        </div>

                    </div>

                </section>


                {/* ========================= */}
                {/* LEAVE REPORT */}
                {/* ========================= */}

                <section className="dashboard-section">

                    <h2>
                        Leave Request Report
                    </h2>

                    <div className="info-grid">

                        <div className="info-card">

                            <h3>
                                Total Requests
                            </h3>

                            <p>
                                {reports.leaves.total}
                            </p>

                        </div>


                        <div className="info-card">

                            <h3>
                                Pending
                            </h3>

                            <p>
                                {reports.leaves.pending}
                            </p>

                        </div>


                        <div className="info-card">

                            <h3>
                                Approved
                            </h3>

                            <p>
                                {reports.leaves.approved}
                            </p>

                        </div>


                        <div className="info-card">

                            <h3>
                                Rejected
                            </h3>

                            <p>
                                {reports.leaves.rejected}
                            </p>

                        </div>

                    </div>

                </section>


                {/* ========================= */}
                {/* PAYMENT REPORT */}
                {/* ========================= */}

                <section className="dashboard-section">

                    <h2>
                        Payment Report
                    </h2>

                    <div className="info-grid">

                        <div className="info-card">

                            <h3>
                                Total Payments
                            </h3>

                            <p>
                                {reports.payments.total}
                            </p>

                        </div>


                        <div className="info-card">

                            <h3>
                                Total Amount
                            </h3>

                            <p>
                                ₹{reports.payments.total_amount}
                            </p>

                        </div>


                        <div className="info-card">

                            <h3>
                                Paid Amount
                            </h3>

                            <p>
                                ₹{reports.payments.paid_amount}
                            </p>

                        </div>


                        <div className="info-card">

                            <h3>
                                Pending Amount
                            </h3>

                            <p>
                                ₹{reports.payments.pending_amount}
                            </p>

                        </div>


                        <div className="info-card">

                            <h3>
                                Failed Amount
                            </h3>

                            <p>
                                ₹{reports.payments.failed_amount}
                            </p>

                        </div>

                    </div>

                </section>


                {/* ========================= */}
                {/* MESS ATTENDANCE */}
                {/* ========================= */}

                <section className="dashboard-section">

                    <h2>
                        Mess Attendance
                    </h2>

                    <div className="info-grid">

                        <div className="info-card">

                            <h3>
                                Total Records
                            </h3>

                            <p>
                                {
                                    reports
                                        .mess_attendance
                                        .total_records
                                }
                            </p>

                        </div>


                        <div className="info-card">

                            <h3>
                                Present
                            </h3>

                            <p>
                                {
                                    reports
                                        .mess_attendance
                                        .present
                                }
                            </p>

                        </div>


                        <div className="info-card">

                            <h3>
                                Absent
                            </h3>

                            <p>
                                {
                                    reports
                                        .mess_attendance
                                        .absent
                                }
                            </p>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
};

export default Reports;