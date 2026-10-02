import { useEffect, useState } from "react";

import paymentService from "../../services/paymentService";
import Sidebar from "../../components/Sidebar";

const Payments = () => {
    const [payments, setPayments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const data =
                    await paymentService.getMyPayments();

                setPayments(data.payments);

            } catch (error) {
                console.error(
                    "Failed to fetch payments:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load payments"
                );

            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    if (loading) {
        return (
            <div className="student-layout">
                <Sidebar />

                <main className="dashboard-content">
                    <h2>
                        Loading payments...
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
                    <h1>Payments</h1>

                    <div className="login-error">
                        {error}
                    </div>
                </main>
            </div>
        );
    }

    const totalPaid = payments
        .filter(
            (payment) =>
                payment.status === "paid"
        )
        .reduce(
            (total, payment) =>
                total + Number(payment.amount),
            0
        );

    const totalPending = payments
        .filter(
            (payment) =>
                payment.status === "pending"
        )
        .reduce(
            (total, payment) =>
                total + Number(payment.amount),
            0
        );

    return (
        <div className="student-layout">

            <Sidebar />

            <main className="dashboard-content">

                <div className="dashboard-header">

                    <h1>Payments</h1>

                    <p>
                        View your hostel and mess
                        payment records.
                    </p>

                </div>


                {/* Payment Summary */}

                <div className="info-grid">

                    <div className="info-card">

                        <h3>
                            Total Payments
                        </h3>

                        <p>
                            {payments.length}
                        </p>

                    </div>


                    <div className="info-card">

                        <h3>
                            Total Paid
                        </h3>

                        <p>
                            ₹{totalPaid.toFixed(2)}
                        </p>

                    </div>


                    <div className="info-card">

                        <h3>
                            Pending Amount
                        </h3>

                        <p>
                            ₹{totalPending.toFixed(2)}
                        </p>

                    </div>

                </div>


                {/* Payment History */}

                <section className="dashboard-section">

                    <h2>
                        Payment History
                    </h2>

                    {payments.length === 0 ? (
                        <p>
                            No payment records found.
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
                                            Amount
                                        </th>

                                        <th>
                                            Payment Type
                                        </th>

                                        <th>
                                            Payment Date
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
                                                    ₹
                                                    {
                                                        payment.amount
                                                    }
                                                </td>

                                                <td>
                                                    <span className="meal-badge">
                                                        {
                                                            payment.payment_type
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    {
                                                        payment.payment_date
                                                    }
                                                </td>

                                                <td>

                                                    <span
                                                        className={
                                                            payment.status ===
                                                            "paid"
                                                                ? "status-resolved"
                                                                : payment.status ===
                                                                  "pending"
                                                                    ? "status-pending"
                                                                    : "status-rejected"
                                                        }
                                                    >
                                                        {
                                                            payment.status
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

export default Payments;