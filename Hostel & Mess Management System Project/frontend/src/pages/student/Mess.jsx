import { useEffect, useState } from "react";

import messService from "../../services/messService";
import Sidebar from "../../components/Sidebar";

const Mess = () => {
    const [menus, setMenus] = useState([]);
    const [attendance, setAttendance] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMessData = async () => {
            try {
                const [menuData, attendanceData] =
                    await Promise.all([
                        messService.getMenu(),
                        messService.getMyAttendance()
                    ]);

                setMenus(menuData.menus);
                setAttendance(
                    attendanceData.attendance
                );

            } catch (error) {
                console.error(
                    "Failed to fetch mess data:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load mess information"
                );

            } finally {
                setLoading(false);
            }
        };

        fetchMessData();
    }, []);

    if (loading) {
        return (
            <div className="student-layout">
                <Sidebar />

                <main className="dashboard-content">
                    <h2>
                        Loading mess information...
                    </h2>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="student-layout">
                <Sidebar />

                <main className="dashboard-content">
                    <h1>Mess</h1>

                    <p className="login-error">
                        {error}
                    </p>
                </main>
            </div>
        );
    }

    return (
        <div className="student-layout">

            <Sidebar />

            <main className="dashboard-content">

                <div className="dashboard-header">

                    <h1>Mess</h1>

                    <p>
                        View the mess menu and your
                        attendance.
                    </p>

                </div>


                {/* Mess Menu */}

                <section className="dashboard-section">

                    <h2>Mess Menu</h2>

                    {menus.length === 0 ? (
                        <p>
                            No menu available.
                        </p>
                    ) : (
                        <div className="table-container">

                            <table className="data-table">

                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Meal</th>
                                        <th>Food Items</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {menus.map(
                                        (menu) => (
                                            <tr
                                                key={
                                                    menu.id
                                                }
                                            >
                                                <td>
                                                    {
                                                        menu.menu_date
                                                    }
                                                </td>

                                                <td>
                                                    <span className="meal-badge">
                                                        {
                                                            menu.meal_type
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    {
                                                        menu.food_items
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


                {/* Attendance */}

                <section className="dashboard-section">

                    <h2>
                        My Mess Attendance
                    </h2>

                    {attendance.length === 0 ? (
                        <p>
                            No attendance records
                            found.
                        </p>
                    ) : (
                        <div className="table-container">

                            <table className="data-table">

                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Meal</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {attendance.map(
                                        (record) => (
                                            <tr
                                                key={
                                                    record.id
                                                }
                                            >
                                                <td>
                                                    {
                                                        record.attendance_date
                                                    }
                                                </td>

                                                <td>
                                                    <span className="meal-badge">
                                                        {
                                                            record.meal_type
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <span
                                                        className={
                                                            record.status ===
                                                            "present"
                                                                ? "status-active"
                                                                : ""
                                                        }
                                                    >
                                                        {
                                                            record.status
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

export default Mess;