import { useEffect, useState } from "react";

import adminService from "../../services/adminService";
import AdminSidebar from "../../components/AdminSidebar";

const Students = () => {
    const [students, setStudents] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const data =
                    await adminService.getAllStudents();

                setStudents(data.students);

            } catch (error) {
                console.error(
                    "Failed to fetch admin students:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load students"
                );

            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    if (loading) {
        return (
            <div className="student-layout">

                <AdminSidebar />

                <main className="dashboard-content">

                    <h2>
                        Loading students...
                    </h2>

                </main>

            </div>
        );
    }

    if (error) {
        return (
            <div className="student-layout">

                <AdminSidebar />

                <main className="dashboard-content">

                    <h1>
                        Students
                    </h1>

                    <div className="login-error">
                        {error}
                    </div>

                </main>

            </div>
        );
    }

    return (
        <div className="student-layout">

            <AdminSidebar />

            <main className="dashboard-content">

                <div className="dashboard-header">

                    <h1>
                        Students
                    </h1>

                    <p>
                        View all registered students
                        in the hostel system.
                    </p>

                </div>

                <section className="dashboard-section">

                    <h2>
                        Student List
                    </h2>

                    {students.length === 0 ? (

                        <p>
                            No students found.
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
                                            Roll Number
                                        </th>

                                        <th>
                                            Email
                                        </th>

                                        <th>
                                            Department
                                        </th>

                                        <th>
                                            Year
                                        </th>

                                        <th>
                                            Hostel
                                        </th>

                                        <th>
                                            Room
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {students.map(
                                        (student) => (

                                            <tr
                                                key={
                                                    student.student_id
                                                }
                                            >

                                                <td>
                                                    {
                                                        student.student_id
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        student.name
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        student.roll_number
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        student.email
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        student.department
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        student.year
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        student.hostel_name ||
                                                        "Not Assigned"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        student.room_number ||
                                                        "Not Assigned"
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

export default Students;