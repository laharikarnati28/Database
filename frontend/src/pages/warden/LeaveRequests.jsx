import { useEffect, useState } from "react";

import wardenService from "../../services/wardenService";
import WardenSidebar from "../../components/WardenSidebar";

const LeaveRequests = () => {

    const [leaveRequests, setLeaveRequests] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [updatingId, setUpdatingId] =
        useState(null);


    // =========================================
    // FETCH LEAVE REQUESTS
    // =========================================

    const fetchLeaveRequests = async () => {

        try {

            const data =
                await wardenService
                    .getAllLeaveRequests();

            setLeaveRequests(
                data.leave_requests || []
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


    // =========================================
    // UPDATE LEAVE STATUS
    // =========================================

    const handleStatusChange = async (
        leaveId,
        status
    ) => {

        try {

            setUpdatingId(leaveId);

            await wardenService
                .updateLeaveStatus(
                    leaveId,
                    status
                );

            await fetchLeaveRequests();

        } catch (error) {

            console.error(
                "Failed to update leave request:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update leave request"
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
                        Loading leave requests...
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
                        Leave Requests
                    </h1>

                    <div className="login-error">
                        {error}
                    </div>

                </main>

            </div>
        );
    }


    // =========================================
    // STATISTICS
    // =========================================

    const pendingCount =
        leaveRequests.filter(
            (request) =>
                request.status === "pending"
        ).length;

    const approvedCount =
        leaveRequests.filter(
            (request) =>
                request.status === "approved"
        ).length;

    const rejectedCount =
        leaveRequests.filter(
            (request) =>
                request.status === "rejected"
        ).length;


    // =========================================
    // LEAVE REQUEST PAGE
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
                        Leave Requests
                    </h1>

                    <p>
                        Review and manage student
                        leave requests.
                    </p>

                </div>


                {/* ========================= */}
                {/* STATISTICS */}
                {/* ========================= */}

                <div className="info-grid">

                    <div className="info-card">

                        <h3>
                            Total Requests
                        </h3>

                        <p>
                            {leaveRequests.length}
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
                            Approved
                        </h3>

                        <p>
                            {approvedCount}
                        </p>

                    </div>


                    <div className="info-card">

                        <h3>
                            Rejected
                        </h3>

                        <p>
                            {rejectedCount}
                        </p>

                    </div>

                </div>


                {/* ========================= */}
                {/* LEAVE REQUEST TABLE */}
                {/* ========================= */}

                <section className="dashboard-section">

                    <h2>
                        Leave Request List
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
                                            Start Date
                                        </th>

                                        <th>
                                            End Date
                                        </th>

                                        <th>
                                            Reason
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
                                                        request.student_name
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        request.roll_number
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
                                                            "pending"
                                                                ? "status-pending"
                                                                : request.status ===
                                                                  "approved"
                                                                    ? "status-active"
                                                                    : "status-rejected"
                                                        }
                                                    >
                                                        {
                                                            request.status
                                                        }
                                                    </span>

                                                </td>

                                                <td>

                                                    <select
                                                        value={
                                                            request.status
                                                        }
                                                        disabled={
                                                            updatingId ===
                                                            request.id
                                                        }
                                                        onChange={(event) =>
                                                            handleStatusChange(
                                                                request.id,
                                                                event.target.value
                                                            )
                                                        }
                                                    >

                                                        <option value="pending">
                                                            Pending
                                                        </option>

                                                        <option value="approved">
                                                            Approved
                                                        </option>

                                                        <option value="rejected">
                                                            Rejected
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

export default LeaveRequests;