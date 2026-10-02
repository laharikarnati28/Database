import { useEffect, useState } from "react";

import adminService from "../../services/adminService";
import AdminSidebar from "../../components/AdminSidebar";

const Wardens = () => {
    const [wardens, setWardens] = useState([]);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [employeeId, setEmployeeId] = useState("");

    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =========================================
    // FETCH WARDENS
    // =========================================

    const fetchWardens = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await adminService.getAllWardens();

            setWardens(data.wardens);

        } catch (error) {

            console.error(
                "Failed to fetch wardens:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load wardens"
            );

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchWardens();
    }, []);


    // =========================================
    // CREATE WARDEN
    // =========================================

    const handleCreateWarden = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (
            !name ||
            !email ||
            !password ||
            !employeeId
        ) {
            setError(
                "All fields are required"
            );

            return;
        }

        try {

            setCreating(true);

            const data =
                await adminService.createWarden(
                    name,
                    email,
                    password,
                    employeeId
                );

            setSuccess(
                data.message
            );

            // Clear form
            setName("");
            setEmail("");
            setPassword("");
            setEmployeeId("");

            // Refresh warden list
            await fetchWardens();

        } catch (error) {

            console.error(
                "Failed to create warden:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to create warden"
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
                        Loading wardens...
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
                        Wardens
                    </h1>

                    <p>
                        Manage hostel wardens
                        in the system.
                    </p>

                </div>


                {/* ================================= */}
                {/* CREATE WARDEN */}
                {/* ================================= */}

                <section className="dashboard-section">

                    <h2>
                        Create Warden
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
                            handleCreateWarden
                        }
                    >

                        <div className="form-group">

                            <label>
                                Name
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter warden name"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter warden email"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter password"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Employee ID
                            </label>

                            <input
                                type="text"
                                value={employeeId}
                                onChange={(event) =>
                                    setEmployeeId(
                                        event.target.value
                                    )
                                }
                                placeholder="Example: WAR003"
                            />

                        </div>


                        <button
                            type="submit"
                            className="primary-button"
                            disabled={creating}
                        >
                            {creating
                                ? "Creating..."
                                : "Create Warden"}
                        </button>

                    </form>

                </section>


                {/* ================================= */}
                {/* WARDEN LIST */}
                {/* ================================= */}

                <section className="dashboard-section">

                    <h2>
                        Warden List
                    </h2>

                    {wardens.length === 0 ? (

                        <p>
                            No wardens found.
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
                                            Employee ID
                                        </th>

                                        <th>
                                            Email
                                        </th>

                                        <th>
                                            Created
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {wardens.map(
                                        (warden) => (

                                            <tr
                                                key={
                                                    warden.warden_id
                                                }
                                            >

                                                <td>
                                                    {
                                                        warden.warden_id
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        warden.name
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        warden.employee_id
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        warden.email
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        new Date(
                                                            warden.created_at
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

export default Wardens;