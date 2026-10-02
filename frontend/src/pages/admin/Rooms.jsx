import { useEffect, useState } from "react";

import adminService from "../../services/adminService";
import AdminSidebar from "../../components/AdminSidebar";

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [hostels, setHostels] = useState([]);

    const [hostelId, setHostelId] = useState("");
    const [roomNumber, setRoomNumber] = useState("");
    const [capacity, setCapacity] = useState("");

    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =========================================
    // FETCH ROOMS AND HOSTELS
    // =========================================

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [roomsData, hostelsData] =
                await Promise.all([
                    adminService.getAllRooms(),
                    adminService.getAllHostels()
                ]);

            setRooms(roomsData.rooms);
            setHostels(hostelsData.hostels);

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

    useEffect(() => {
        fetchData();
    }, []);


    // =========================================
    // CREATE ROOM
    // =========================================

    const handleCreateRoom = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (
            !hostelId ||
            !roomNumber.trim() ||
            !capacity
        ) {
            setError(
                "Hostel, room number and capacity are required"
            );

            return;
        }

        if (Number(capacity) <= 0) {
            setError(
                "Capacity must be greater than 0"
            );

            return;
        }

        try {

            setCreating(true);

            const data =
                await adminService.createRoom(
                    hostelId,
                    roomNumber,
                    Number(capacity)
                );

            setSuccess(
                data.message
            );

            setHostelId("");
            setRoomNumber("");
            setCapacity("");

            await fetchData();

        } catch (error) {

            console.error(
                "Failed to create room:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to create room"
            );

        } finally {
            setCreating(false);
        }
    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {
        return (
            <div className="student-layout">

                <AdminSidebar />

                <main className="dashboard-content">

                    <h2>
                        Loading rooms...
                    </h2>

                </main>

            </div>
        );
    }


    // =========================================
    // PAGE
    // =========================================

    return (
        <div className="student-layout">

            <AdminSidebar />

            <main className="dashboard-content">

                <div className="dashboard-header">

                    <h1>
                        Rooms
                    </h1>

                    <p>
                        Manage hostel rooms and
                        their occupancy.
                    </p>

                </div>


                {/* ================================= */}
                {/* CREATE ROOM */}
                {/* ================================= */}

                <section className="dashboard-section">

                    <h2>
                        Create Room
                    </h2>

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="success-message">
                            {success}
                        </div>
                    )}

                    {hostels.length === 0 ? (

                        <p>
                            No hostels available.
                            Create a hostel first.
                        </p>

                    ) : (

                        <form
                            className="complaint-form"
                            onSubmit={
                                handleCreateRoom
                            }
                        >

                            <div className="form-group">

                                <label>
                                    Hostel
                                </label>

                                <select
                                    value={hostelId}
                                    onChange={(event) =>
                                        setHostelId(
                                            event.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select Hostel
                                    </option>

                                    {hostels.map(
                                        (hostel) => (

                                            <option
                                                key={
                                                    hostel.id
                                                }
                                                value={
                                                    hostel.id
                                                }
                                            >
                                                {
                                                    hostel.name
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            <div className="form-group">

                                <label>
                                    Room Number
                                </label>

                                <input
                                    type="text"
                                    value={roomNumber}
                                    onChange={(event) =>
                                        setRoomNumber(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Example: 201"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Capacity
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    value={capacity}
                                    onChange={(event) =>
                                        setCapacity(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Example: 4"
                                />

                            </div>


                            <button
                                type="submit"
                                className="primary-button"
                                disabled={creating}
                            >
                                {creating
                                    ? "Creating..."
                                    : "Create Room"}
                            </button>

                        </form>

                    )}

                </section>


                {/* ================================= */}
                {/* ROOM LIST */}
                {/* ================================= */}

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
                                            ID
                                        </th>

                                        <th>
                                            Hostel
                                        </th>

                                        <th>
                                            Room
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
                                                room.capacity -
                                                room.occupied_count;

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

                                                        {available ===
                                                        0 ? (
                                                            <span className="status-rejected">
                                                                Full
                                                            </span>
                                                        ) : (
                                                            <span className="status-active">
                                                                Available
                                                            </span>
                                                        )}

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