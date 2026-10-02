import { useEffect, useState } from "react";

import adminService from "../../services/adminService";
import AdminSidebar from "../../components/AdminSidebar";

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [students, setStudents] = useState([]);

    const [studentId, setStudentId] = useState("");
    const [amount, setAmount] = useState("");
    const [paymentType, setPaymentType] = useState("");

    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =========================================
    // FETCH PAYMENTS + STUDENTS
    // =========================================

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                paymentsData,
                studentsData
            ] = await Promise.all([
                adminService.getAllPayments(),
                adminService.getAllStudents()
            ]);

            setPayments(
                paymentsData.payments || []
            );

            setStudents(
                studentsData.students || []
            );

        } catch (error) {

            console.error(
                "Failed to fetch payment data:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load payment data"
            );

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, []);


    // =========================================
    // CREATE PAYMENT
    // =========================================

    const handleCreatePayment = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (
            !studentId ||
            !amount ||
            !paymentType
        ) {
            setError(
                "Student, amount and payment type are required"
            );

            return;
        }

        if (Number(amount) <= 0) {
            setError(
                "Amount must be greater than 0"
            );

            return;
        }

        try {

            setCreating(true);

            const data =
                await adminService.createPayment(
                    Number(studentId),
                    Number(amount),
                    paymentType
                );

            setSuccess(
                data.message
            );

            setStudentId("");
            setAmount("");
            setPaymentType("");

            await fetchData();

        } catch (error) {

            console.error(
                "Failed to create payment:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to create payment"
            );

        } finally {
            setCreating(false);
        }
    };


    // =========================================
    // UPDATE PAYMENT STATUS
    // =========================================

    const handleStatusChange = async (
        paymentId,
        status
    ) => {

        setError("");
        setSuccess("");

        try {

            await adminService.updatePaymentStatus(
                paymentId,
                status
            );

            setSuccess(
                "Payment status updated successfully"
            );

            await fetchData();

        } catch (error) {

            console.error(
                "Failed to update payment status:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to update payment status"
            );
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
                        Loading payments...
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
                        Payments
                    </h1>

                    <p>
                        Manage student hostel and
                        mess payments.
                    </p>

                </div>


                {/* ================================= */}
                {/* CREATE PAYMENT */}
                {/* ================================= */}

                <section className="dashboard-section">

                    <h2>
                        Create Payment
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

                    {students.length === 0 ? (

                        <p>
                            No students available.
                        </p>

                    ) : (

                        <form
                            className="complaint-form"
                            onSubmit={
                                handleCreatePayment
                            }
                        >

                            <div className="form-group">

                                <label>
                                    Student
                                </label>

                                <select
                                    value={studentId}
                                    onChange={(event) =>
                                        setStudentId(
                                            event.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select Student
                                    </option>

                                    {students.map(
                                        (student) => (

                                            <option
                                                key={
                                                    student.student_id
                                                }
                                                value={
                                                    student.student_id
                                                }
                                            >
                                                {
                                                    student.name
                                                }{" "}
                                                (
                                                {
                                                    student.roll_number
                                                }
                                                )
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            <div className="form-group">

                                <label>
                                    Amount
                                </label>

                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={amount}
                                    onChange={(event) =>
                                        setAmount(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Example: 5000"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Payment Type
                                </label>

                                <select
                                    value={paymentType}
                                    onChange={(event) =>
                                        setPaymentType(
                                            event.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select Payment Type
                                    </option>

                                    <option value="hostel_fee">
                                        Hostel Fee
                                    </option>

                                    <option value="mess_fee">
                                        Mess Fee
                                    </option>

                                    <option value="other">
                                        Other
                                    </option>

                                </select>

                            </div>


                            <button
                                type="submit"
                                className="primary-button"
                                disabled={creating}
                            >
                                {creating
                                    ? "Creating..."
                                    : "Create Payment"}
                            </button>

                        </form>

                    )}

                </section>


                {/* ================================= */}
                {/* PAYMENT LIST */}
                {/* ================================= */}

                <section className="dashboard-section">

                    <h2>
                        Payment List
                    </h2>

                    {payments.length === 0 ? (

                        <p>
                            No payments found.
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
                                            Amount
                                        </th>

                                        <th>
                                            Type
                                        </th>

                                        <th>
                                            Date
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {payments.map(
                                        (payment) => (

                                            <tr
                                                key={
                                                    payment.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        payment.id
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        payment.student_name
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        payment.roll_number
                                                    }
                                                </td>

                                                <td>
                                                    ₹
                                                    {
                                                        payment.amount
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        payment.payment_type
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        new Date(
                                                            payment.payment_date
                                                        ).toLocaleString()
                                                    }
                                                </td>

                                                <td>

                                                    <select
                                                        value={
                                                            payment.status
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            handleStatusChange(
                                                                payment.id,
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                    >

                                                        <option value="pending">
                                                            Pending
                                                        </option>

                                                        <option value="paid">
                                                            Paid
                                                        </option>

                                                        <option value="failed">
                                                            Failed
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

export default Payments;