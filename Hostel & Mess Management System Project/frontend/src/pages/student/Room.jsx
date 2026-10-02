import { useEffect, useState } from "react";

import studentService from "../../services/studentService";
import Sidebar from "../../components/Sidebar";

const Room = () => {
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
                    "Failed to fetch room information:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load room information"
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
                    <h2>Loading room information...</h2>
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

    const room = student?.room;

    return (
        <div className="student-layout">
            <Sidebar />

            <main className="dashboard-content">

                <div className="dashboard-header">
                    <h1>My Room</h1>
                    <p>
                        View your hostel and room allocation
                    </p>
                </div>

                {room ? (
                    <>
                        <div className="info-grid">

                            <div className="info-card">
                                <h3>Hostel</h3>
                                <p>
                                    {room.hostel_name}
                                </p>
                            </div>

                            <div className="info-card">
                                <h3>Room Number</h3>
                                <p>
                                    {room.room_number}
                                </p>
                            </div>

                            <div className="info-card">
                                <h3>Status</h3>
                                <p className="status-active">
                                    {room.status}
                                </p>
                            </div>

                        </div>

                        <section className="dashboard-section">
                            <h2>Room Details</h2>

                            <div className="detail-grid">

                                <div className="detail-item">
                                    <span>
                                        Hostel Name
                                    </span>

                                    <strong>
                                        {room.hostel_name}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>
                                        Hostel Location
                                    </span>

                                    <strong>
                                        {room.hostel_location}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>
                                        Room Number
                                    </span>

                                    <strong>
                                        {room.room_number}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>
                                        Room Capacity
                                    </span>

                                    <strong>
                                        {room.capacity}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>
                                        Occupied Beds
                                    </span>

                                    <strong>
                                        {room.occupied_count}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>
                                        Available Beds
                                    </span>

                                    <strong>
                                        {room.capacity -
                                            room.occupied_count}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>
                                        Allocation Status
                                    </span>

                                    <strong className="status-active">
                                        {room.status}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>
                                        Start Date
                                    </span>

                                    <strong>
                                        {room.start_date}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>
                                        End Date
                                    </span>

                                    <strong>
                                        {room.end_date ||
                                            "Not specified"}
                                    </strong>
                                </div>

                            </div>
                        </section>
                    </>
                ) : (
                    <section className="dashboard-section">
                        <h2>No Room Assigned</h2>

                        <p>
                            You currently do not have a
                            room allocation.
                        </p>
                    </section>
                )}

            </main>
        </div>
    );
};

export default Room;