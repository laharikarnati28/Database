import { useEffect, useState } from "react";

import wardenService from "../../services/wardenService";
import WardenSidebar from "../../components/WardenSidebar";

const Complaints = () => {

    const [complaints, setComplaints] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [updatingId, setUpdatingId] = useState(null);


    // =========================================
    // FETCH COMPLAINTS
    // =========================================

    const fetchComplaints = async () => {

        try {

            const data =
                await wardenService
                    .getAllComplaints();

            setComplaints(
                data.complaints || []
            );

        } catch (error) {

            console.error(
                "Failed to fetch complaints:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load complaints"
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        fetchComplaints();

    }, []);


    // =========================================
    // UPDATE COMPLAINT STATUS
    // =========================================

    const handleStatusChange = async (
        complaintId,
        status
    ) => {

        try {

            setUpdatingId(
                complaintId
            );

            await wardenService
                .updateComplaintStatus(
                    complaintId,
                    status
                );

            await fetchComplaints();

        } catch (error) {

            console.error(
                "Failed to update complaint:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update complaint"
            );

        } finally {

            setUpdatingId(null);
        }
    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (
            <div className="student-layout">

                <WardenSidebar />

                <main className="dashboard-content">

                    <h2>
                        Loading complaints...
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
                        Complaints
                    </h1>

                    <div className="login-error">
                        {error}
                    </div>

                </main>

            </div>
        );
    }


    // =========================================
    // COMPLAINT STATISTICS
    // =========================================

    const pendingCount =
        complaints.filter(
            (complaint) =>
                complaint.status === "pending"
        ).length;

    const inProgressCount =
        complaints.filter(
            (complaint) =>
                complaint.status === "in_progress"
        ).length;

    const resolvedCount =
        complaints.filter(
            (complaint) =>
                complaint.status === "resolved"
        ).length;


    // =========================================
    // COMPLAINTS PAGE
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
                        Complaints
                    </h1>

                    <p>
                        Review student complaints and
                        update their status.
                    </p>

                </div>


                {/* ========================= */}
                {/* STATISTICS */}
                {/* ========================= */}

                <div className="info-grid">

                    <div className="info-card">

                        <h3>
                            Total Complaints
                        </h3>

                        <p>
                            {complaints.length}
                        </p>

                    </div>


                    <div className="info-card">

                        <h3>
                            Pending
                        </h3>

                        <p>
                            {pendingCount}
                        </p>

                    </div>


                    <div className="info-card">

                        <h3>
                            In Progress
                        </h3>

                        <p>
                            {inProgressCount}
                        </p>

                    </div>


                    <div className="info-card">

                        <h3>
                            Resolved
                        </h3>

                        <p>
                            {resolvedCount}
                        </p>

                    </div>

                </div>


                {/* ========================= */}
                {/* COMPLAINT TABLE */}
                {/* ========================= */}

                <section className="dashboard-section">

                    <h2>
                        Complaint List
                    </h2>

                    {complaints.length === 0 ? (

                        <p>
                            No complaints found.
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
                                            Student
                                        </th>

                                        <th>
                                            Roll Number
                                        </th>

                                        <th>
                                            Category
                                        </th>

                                        <th>
                                            Description
                                        </th>

                                        <th>
                                            Created
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {complaints.map(
                                        (complaint) => (

                                            <tr
                                                key={
                                                    complaint.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        complaint.id
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        complaint.student_name
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        complaint.roll_number
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        complaint.category
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        complaint.description
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        complaint.created_at
                                                    }
                                                </td>

                                                <td>

                                                    <span
                                                        className={
                                                            complaint.status ===
                                                            "pending"
                                                                ? "status-pending"
                                                                : complaint.status ===
                                                                  "in_progress"
                                                                    ? "status-progress"
                                                                    : "status-resolved"
                                                        }
                                                    >
                                                        {
                                                            complaint.status
                                                        }
                                                    </span>

                                                </td>

                                                <td>

                                                    <select
                                                        value={
                                                            complaint.status
                                                        }
                                                        disabled={
                                                            updatingId ===
                                                            complaint.id
                                                        }
                                                        onChange={(event) =>
                                                            handleStatusChange(
                                                                complaint.id,
                                                                event.target.value
                                                            )
                                                        }
                                                    >

                                                        <option value="pending">
                                                            Pending
                                                        </option>

                                                        <option value="in_progress">
                                                            In Progress
                                                        </option>

                                                        <option value="resolved">
                                                            Resolved
                                                        </option>

                                                    </select>

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

export default Complaints;