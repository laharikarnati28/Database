import { useEffect, useState } from "react";

import leaveService from "../../services/leaveService";
import Sidebar from "../../components/Sidebar";

const LeaveRequests = () => {
    const [leaveRequests, setLeaveRequests] =
        useState([]);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchLeaveRequests = async () => {
        try {
            setError("");

            const data =
                await leaveService.getMyLeaveRequests();

            setLeaveRequests(
                data.leave_requests
            );

        } catch (error) {
            console.error(
                "Failed to fetch leave requests:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load leave requests"
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaveRequests();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!startDate || !endDate || !reason) {
            setError(
                "Start date, end date and reason are required"
            );
            return;
        }

        if (endDate < startDate) {
            setError(
                "End date cannot be before start date"
            );
            return;
        }

        try {
            setSubmitting(true);

            await leaveService.createLeaveRequest(
                startDate,
                endDate,
                reason
            );

            setStartDate("");
            setEndDate("");
            setReason("");

            setSuccess(
                "Leave request submitted successfully"
            );

            await fetchLeaveRequests();

        } catch (error) {
            console.error(
                "Failed to submit leave request:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to submit leave request"
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
                        Loading leave requests...
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

                    <h1>Leave Requests</h1>

                    <p>
                        Apply for leave and track
                        your requests.
                    </p>

                </div>


                {/* Submit Leave */}

                <section className="dashboard-section">

                    <h2>
                        Submit Leave Request
                    </h2>

                    <form
                        className="complaint-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-group">

                            <label htmlFor="startDate">
                                Start Date
                            </label>

                            <input
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={(event) =>
                                    setStartDate(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="form-group">

                            <label htmlFor="endDate">
                                End Date
                            </label>

                            <input
                                id="endDate"
                                type="date"
                                value={endDate}
                                onChange={(event) =>
                                    setEndDate(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="form-group">

                            <label htmlFor="reason">
                                Reason
                            </label>

                            <textarea
                                id="reason"
                                value={reason}
                                onChange={(event) =>
                                    setReason(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter reason for leave"
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
                                : "Submit Leave Request"}
                        </button>

                    </form>

                </section>


                {/* Leave History */}

                <section className="dashboard-section">

                    <h2>
                        Leave History
                    </h2>

                    {leaveRequests.length === 0 ? (
                        <p>
                            No leave requests found.
                        </p>
                    ) : (
                        <div className="table-container">

                            <table className="data-table">

                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Reason</th>
                                        <th>Status</th>
                                        <th>Created At</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {leaveRequests.map(
                                        (request) => (
                                            <tr
                                                key={
                                                    request.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        request.id
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        request.start_date
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        request.end_date
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        request.reason
                                                    }
                                                </td>

                                                <td>

                                                    <span
                                                        className={
                                                            request.status ===
                                                            "approved"
                                                                ? "status-resolved"
                                                                : request.status ===
                                                                  "pending"
                                                                    ? "status-pending"
                                                                    : "status-rejected"
                                                        }
                                                    >
                                                        {
                                                            request.status
                                                        }
                                                    </span>

                                                </td>

                                                <td>
                                                    {
                                                        request.created_at
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

export default LeaveRequests;