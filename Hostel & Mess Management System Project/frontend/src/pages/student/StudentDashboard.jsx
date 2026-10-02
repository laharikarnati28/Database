import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import studentService from "../../services/studentService";
import Sidebar from "../../components/Sidebar";
import Notifications from "../../components/Notifications";

const StudentDashboard = () => {
    const { logout } = useAuth();

    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data =
                    await studentService.getProfile();

                setStudent(data.student);

            } catch (error) {
                console.error(
                    "Failed to fetch student profile:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load student profile"
                );

            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <h2>Loading student profile...</h2>
        );
    }

    if (error) {
        return (
            <div>
                <h2>Error</h2>

                <p>{error}</p>

                <button onClick={logout}>
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div className="student-layout">

            <Sidebar />

            <main className="dashboard-content">

                <div className="dashboard-header">

                    <h1>
                        Student Dashboard
                    </h1>

                    <p>
                        Welcome back, {student.name}
                    </p>

                </div>


                {/* Summary Cards */}

                <div className="info-grid">

                    <div className="info-card">
                        <h3>Hostel</h3>

                        <p>
                            {student.room
                                ? student.room.hostel_name
                                : "Not Assigned"}
                        </p>
                    </div>

                    <div className="info-card">
                        <h3>Room</h3>

                        <p>
                            {student.room
                                ? student.room.room_number
                                : "Not Assigned"}
                        </p>
                    </div>

                    <div className="info-card">
                        <h3>Room Status</h3>

                        <p
                            className={
                                student.room
                                    ? "status-active"
                                    : ""
                            }
                        >
                            {student.room
                                ? student.room.status
                                : "Not Assigned"}
                        </p>
                    </div>

                </div>


                {/* Student Information */}

                <section className="dashboard-section">

                    <h2>
                        Student Information
                    </h2>

                    <div className="detail-grid">

                        <div className="detail-item">
                            <span>Name</span>

                            <strong>
                                {student.name}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Email</span>

                            <strong>
                                {student.email}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Roll Number</span>

                            <strong>
                                {student.roll_number}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Department</span>

                            <strong>
                                {student.department}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Year</span>

                            <strong>
                                {student.year}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Role</span>

                            <strong>
                                {student.role}
                            </strong>
                        </div>

                    </div>

                </section>


                {/* Room Information */}

                <section className="dashboard-section">

                    <h2>
                        Room Information
                    </h2>

                    {student.room ? (

                        <div className="detail-grid">

                            <div className="detail-item">
                                <span>Hostel</span>

                                <strong>
                                    {
                                        student.room
                                            .hostel_name
                                    }
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Location</span>

                                <strong>
                                    {
                                        student.room
                                            .hostel_location
                                    }
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Room Number</span>

                                <strong>
                                    {
                                        student.room
                                            .room_number
                                    }
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Capacity</span>

                                <strong>
                                    {
                                        student.room
                                            .capacity
                                    }
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Occupied</span>

                                <strong>
                                    {
                                        student.room
                                            .occupied_count
                                    }
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Start Date</span>

                                <strong>
                                    {
                                        student.room
                                            .start_date
                                    }
                                </strong>
                            </div>

                        </div>

                    ) : (

                        <p>
                            No room has been allocated yet.
                        </p>

                    )}

                </section>


                {/* Notifications */}

                <Notifications />

            </main>

        </div>
    );
};

export default StudentDashboard;