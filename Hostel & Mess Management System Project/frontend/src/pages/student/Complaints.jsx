import { useEffect, useState } from "react";

import complaintService from "../../services/complaintService";
import Sidebar from "../../components/Sidebar";

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);

    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchComplaints = async () => {
        try {
            setError("");

            const data =
                await complaintService.getMyComplaints();

            setComplaints(data.complaints);

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

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!category || !description) {
            setError(
                "Category and description are required"
            );
            return;
        }

        try {
            setSubmitting(true);

            await complaintService.createComplaint(
                category,
                description
            );

            setCategory("");
            setDescription("");

            setSuccess(
                "Complaint submitted successfully"
            );

            await fetchComplaints();

        } catch (error) {
            console.error(
                "Failed to submit complaint:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to submit complaint"
            );

        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="student-layout">
                <Sidebar />

                <main className="dashboard-content">
                    <h2>
                        Loading complaints...
                    </h2>
                </main>
            </div>
        );
    }

    return (
        <div className="student-layout">

            <Sidebar />

            <main className="dashboard-content">

                <div className="dashboard-header">

                    <h1>Complaints</h1>

                    <p>
                        Submit and track your hostel
                        complaints.
                    </p>

                </div>


                {/* Submit Complaint */}

                <section className="dashboard-section">

                    <h2>
                        Submit a Complaint
                    </h2>

                    <form
                        className="complaint-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-group">

                            <label htmlFor="category">
                                Category
                            </label>

                            <input
                                id="category"
                                type="text"
                                value={category}
                                onChange={(event) =>
                                    setCategory(
                                        event.target.value
                                    )
                                }
                                placeholder="Example: Room Maintenance"
                            />

                        </div>


                        <div className="form-group">

                            <label htmlFor="description">
                                Description
                            </label>

                            <textarea
                                id="description"
                                value={description}
                                onChange={(event) =>
                                    setDescription(
                                        event.target.value
                                    )
                                }
                                placeholder="Describe your complaint"
                                rows="5"
                            />

                        </div>


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


                        <button
                            className="primary-button"
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting
                                ? "Submitting..."
                                : "Submit Complaint"}
                        </button>

                    </form>

                </section>


                {/* Complaint History */}

                <section className="dashboard-section">

                    <h2>
                        Complaint History
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
                                        <th>ID</th>
                                        <th>Category</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Created At</th>
                                        <th>Resolved At</th>
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
                                                        complaint.category
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        complaint.description
                                                    }
                                                </td>

                                                <td>

                                                    <span
                                                        className={
                                                            complaint.status ===
                                                            "resolved"
                                                                ? "status-resolved"
                                                                : complaint.status ===
                                                                  "pending"
                                                                    ? "status-pending"
                                                                    : "status-progress"
                                                        }
                                                    >
                                                        {
                                                            complaint.status
                                                        }
                                                    </span>

                                                </td>

                                                <td>
                                                    {
                                                        complaint.created_at
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        complaint.resolved_at ||
                                                        "-"
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

export default Complaints;