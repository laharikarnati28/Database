import { useEffect, useState } from "react";

import wardenService from "../../services/wardenService";
import WardenSidebar from "../../components/WardenSidebar";

const Rooms = () => {

    const [rooms, setRooms] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================================
    // FETCH ROOMS
    // =========================================

    useEffect(() => {

        const fetchRooms = async () => {

            try {

                const data =
                    await wardenService
                        .getAllRooms();

                setRooms(
                    data.rooms || []
                );

            } catch (error) {

                console.error(
                    "Failed to fetch rooms:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load rooms"
                );

            } finally {

                setLoading(false);
            }
        };


        fetchRooms();

    }, []);


    // =========================================
    // CALCULATE ROOM STATISTICS
    // =========================================

    const totalCapacity =
        rooms.reduce(
            (total, room) =>
                total + Number(room.capacity),
            0
        );

    const occupiedBeds =
        rooms.reduce(
            (total, room) =>
                total + Number(room.occupied_count),
            0
        );

    const availableBeds =
        totalCapacity -
        occupiedBeds;


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (
            <div className="student-layout">

                <WardenSidebar />

                <main className="dashboard-content">

                    <h2>
                        Loading rooms...
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
                        Rooms
                    </h1>

                    <div className="login-error">
                        {error}
                    </div>

                </main>

            </div>
        );
    }


    // =========================================
    // ROOMS PAGE
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
                        Rooms
                    </h1>

                    <p>
                        View hostel rooms and their
                        current occupancy.
                    </p>

                </div>


                {/* ========================= */}
                {/* ROOM STATISTICS */}
                {/* ========================= */}

                <div className="info-grid">

                    <div className="info-card">

                        <h3>
                            Total Rooms
                        </h3>

                        <p>
                            {rooms.length}
                        </p>

                    </div>


                    <div className="info-card">

                        <h3>
                            Total Bed Capacity
                        </h3>

                        <p>
                            {totalCapacity}
                        </p>

                    </div>


                    <div className="info-card">

                        <h3>
                            Occupied Beds
                        </h3>

                        <p>
                            {occupiedBeds}
                        </p>

                    </div>


                    <div className="info-card">

                        <h3>
                            Available Beds
                        </h3>

                        <p>
                            {availableBeds}
                        </p>

                    </div>

                </div>


                {/* ========================= */}
                {/* ROOM TABLE */}
                {/* ========================= */}

                <section className="dashboard-section">

                    <h2>
                        Room List
                    </h2>

                    {rooms.length === 0 ? (

                        <p>
                            No rooms found.
                        </p>

                    ) : (

                        <div className="table-container">

                            <table className="data-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Room ID
                                        </th>

                                        <th>
                                            Hostel
                                        </th>

                                        <th>
                                            Location
                                        </th>

                                        <th>
                                            Room Number
                                        </th>

                                        <th>
                                            Capacity
                                        </th>

                                        <th>
                                            Occupied
                                        </th>

                                        <th>
                                            Available
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {rooms.map(
                                        (room) => {

                                            const available =
                                                Number(
                                                    room.capacity
                                                ) -
                                                Number(
                                                    room.occupied_count
                                                );

                                            const isFull =
                                                available === 0;

                                            return (

                                                <tr
                                                    key={
                                                        room.id
                                                    }
                                                >

                                                    <td>
                                                        {
                                                            room.id
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            room.hostel_name
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            room.location ||
                                                            "Not specified"
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            room.room_number
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            room.capacity
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            room.occupied_count
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            available
                                                        }
                                                    </td>

                                                    <td>

                                                        <span
                                                            className={
                                                                isFull
                                                                    ? "status-rejected"
                                                                    : "status-active"
                                                            }
                                                        >
                                                            {
                                                                isFull
                                                                    ? "Full"
                                                                    : "Available"
                                                            }
                                                        </span>

                                                    </td>

                                                </tr>

                                            );
                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
};

export default Rooms;