import { useEffect, useState } from "react";

import wardenService from "../../services/wardenService";
import WardenSidebar from "../../components/WardenSidebar";

const Allocations = () => {

    const [allocations, setAllocations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================================
    // FETCH ALLOCATIONS
    // =========================================

    useEffect(() => {

        const fetchAllocations = async () => {

            try {

                const data =
                    await wardenService
                        .getAllAllocations();

                setAllocations(
                    data.allocations || []
                );

            } catch (error) {

                console.error(
                    "Failed to fetch allocations:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load room allocations"
                );

            } finally {

                setLoading(false);
            }
        };


        fetchAllocations();

    }, []);


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (
            <div className="student-layout">

                <WardenSidebar />

                <main className="dashboard-content">

                    <h2>
                        Loading room allocations...
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
                        Room Allocations
                    </h1>

                    <div className="login-error">
                        {error}
                    </div>

                </main>

            </div>
        );
    }


    // =========================================
    // ALLOCATIONS PAGE
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
                        Room Allocations
                    </h1>

                    <p>
                        View student room allocation
                        records.
                    </p>

                </div>


                {/* ========================= */}
                {/* SUMMARY */}
                {/* ========================= */}

                <div className="info-grid">

                    <div className="info-card">

                        <h3>
                            Total Allocations
                        </h3>

                        <p>
                            {allocations.length}
                        </p>

                    </div>


                    <div className="info-card">

                        <h3>
                            Active Allocations
                        </h3>

                        <p>
                            {
                                allocations.filter(
                                    (allocation) =>
                                        allocation.status ===
                                        "active"
                                ).length
                            }
                        </p>

                    </div>


                    <div className="info-card">

                        <h3>
                            Completed Allocations
                        </h3>

                        <p>
                            {
                                allocations.filter(
                                    (allocation) =>
                                        allocation.status ===
                                        "completed"
                                ).length
                            }
                        </p>

                    </div>

                </div>


                {/* ========================= */}
                {/* ALLOCATION TABLE */}
                {/* ========================= */}

                <section className="dashboard-section">

                    <h2>
                        Allocation Records
                    </h2>

                    {allocations.length === 0 ? (

                        <p>
                            No room allocations found.
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
                                            Hostel
                                        </th>

                                        <th>
                                            Room
                                        </th>

                                        <th>
                                            Start Date
                                        </th>

                                        <th>
                                            End Date
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {allocations.map(
                                        (allocation) => (

                                            <tr
                                                key={
                                                    allocation.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        allocation.id
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        allocation.student_name
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        allocation.roll_number
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        allocation.hostel_name
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        allocation.room_number
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        allocation.start_date
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        allocation.end_date ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>

                                                    <span
                                                        className={
                                                            allocation.status ===
                                                            "active"
                                                                ? "status-active"
                                                                : "status-resolved"
                                                        }
                                                    >
                                                        {
                                                            allocation.status
                                                        }
                                                    </span>

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

export default Allocations;