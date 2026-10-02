import { useEffect, useState } from "react";

import studentService from "../../services/studentService";
import Sidebar from "../../components/Sidebar";

const Profile = () => {
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
                    "Failed to load profile"
                );

            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="student-layout">
                <Sidebar />

                <main className="dashboard-content">
                    <h2>Loading profile...</h2>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="student-layout">
                <Sidebar />

                <main className="dashboard-content">
                    <div className="login-error">
                        {error}
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="student-layout">
            <Sidebar />

            <main className="dashboard-content">

                <div className="dashboard-header">
                    <h1>My Profile</h1>
                    <p>
                        View your student information
                    </p>
                </div>

                <section className="dashboard-section">
                    <h2>Personal Information</h2>

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

                <section className="dashboard-section">
                    <h2>Room Information</h2>

                    {student.room ? (
                        <div className="detail-grid">

                            <div className="detail-item">
                                <span>Hostel</span>
                                <strong>
                                    {student.room.hostel_name}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Location</span>
                                <strong>
                                    {student.room.hostel_location}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Room Number</span>
                                <strong>
                                    {student.room.room_number}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Room Capacity</span>
                                <strong>
                                    {student.room.capacity}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Occupied Beds</span>
                                <strong>
                                    {student.room.occupied_count}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Allocation Status</span>
                                <strong className="status-active">
                                    {student.room.status}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Start Date</span>
                                <strong>
                                    {student.room.start_date}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>End Date</span>
                                <strong>
                                    {student.room.end_date || "Not specified"}
                                </strong>
                            </div>

                        </div>
                    ) : (
                        <p>
                            No room has been allocated yet.
                        </p>
                    )}
                </section>

            </main>
        </div>
    );
};

export default Profile;