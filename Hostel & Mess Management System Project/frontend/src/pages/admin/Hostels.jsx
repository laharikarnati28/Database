import { useEffect, useState } from "react";

import adminService from "../../services/adminService";
import AdminSidebar from "../../components/AdminSidebar";

const Hostels = () => {
    const [hostels, setHostels] = useState([]);

    const [name, setName] = useState("");
    const [location, setLocation] = useState("");

    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =========================================
    // FETCH HOSTELS
    // =========================================

    const fetchHostels = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await adminService.getAllHostels();

            setHostels(data.hostels);

        } catch (error) {

            console.error(
                "Failed to fetch hostels:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load hostels"
            );

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchHostels();
    }, []);


    // =========================================
    // CREATE HOSTEL
    // =========================================

    const handleCreateHostel = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!name.trim()) {
            setError(
                "Hostel name is required"
            );

            return;
        }

        try {

            setCreating(true);

            const data =
                await adminService.createHostel(
                    name,
                    location
                );

            setSuccess(
                data.message
            );

            setName("");
            setLocation("");

            await fetchHostels();

        } catch (error) {

            console.error(
                "Failed to create hostel:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to create hostel"
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
                        Loading hostels...
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
                        Hostels
                    </h1>

                    <p>
                        Manage hostels in the
                        hostel management system.
                    </p>

                </div>


                {/* ================================= */}
                {/* CREATE HOSTEL */}
                {/* ================================= */}

                <section className="dashboard-section">

                    <h2>
                        Create Hostel
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

                    <form
                        className="complaint-form"
                        onSubmit={
                            handleCreateHostel
                        }
                    >

                        <div className="form-group">

                            <label>
                                Hostel Name
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(
                                        event.target.value
                                    )
                                }
                                placeholder="Example: Block C"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Location
                            </label>

                            <input
                                type="text"
                                value={location}
                                onChange={(event) =>
                                    setLocation(
                                        event.target.value
                                    )
                                }
                                placeholder="Example: Main Campus"
                            />

                        </div>


                        <button
                            type="submit"
                            className="primary-button"
                            disabled={creating}
                        >
                            {creating
                                ? "Creating..."
                                : "Create Hostel"}
                        </button>

                    </form>

                </section>


                {/* ================================= */}
                {/* HOSTEL LIST */}
                {/* ================================= */}

                <section className="dashboard-section">

                    <h2>
                        Hostel List
                    </h2>

                    {hostels.length === 0 ? (

                        <p>
                            No hostels found.
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
                                            Name
                                        </th>

                                        <th>
                                            Location
                                        </th>

                                        <th>
                                            Created
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {hostels.map(
                                        (hostel) => (

                                            <tr
                                                key={
                                                    hostel.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        hostel.id
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        hostel.name
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        hostel.location ||
                                                        "Not specified"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        new Date(
                                                            hostel.created_at
                                                        ).toLocaleString()
                                                    }
                                                </td>

                                            </tr>

                                        )
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

export default Hostels;