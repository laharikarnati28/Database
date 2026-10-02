const pool = require("../config/db");


// =========================================
// CREATE PAYMENT
// ADMIN
// =========================================

const createPayment = async (req, res) => {
    try {
        const {
            student_id,
            amount,
            payment_type,
            status
        } = req.body;

        if (
            !student_id ||
            amount === undefined ||
            !payment_type
        ) {
            return res.status(400).json({
                message: "Student, amount and payment type are required"
            });
        }

        const validPaymentTypes = [
            "hostel_fee",
            "mess_fee",
            "other"
        ];

        if (!validPaymentTypes.includes(payment_type)) {
            return res.status(400).json({
                message: "Invalid payment type"
            });
        }

        const validStatuses = [
            "pending",
            "paid",
            "failed"
        ];

        const paymentStatus = status || "pending";

        if (!validStatuses.includes(paymentStatus)) {
            return res.status(400).json({
                message: "Invalid payment status"
            });
        }

        if (Number(amount) <= 0) {
            return res.status(400).json({
                message: "Amount must be greater than zero"
            });
        }

        const [students] = await pool.query(
            `
            SELECT
                students.id,
                students.roll_number,
                users.name
            FROM students
            INNER JOIN users
                ON students.user_id = users.id
            WHERE students.id = ?
            `,
            [student_id]
        );

        if (students.length === 0) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const student = students[0];

        const [result] = await pool.query(
            `
            INSERT INTO payments
            (
                student_id,
                amount,
                payment_type,
                status
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                student_id,
                amount,
                payment_type,
                paymentStatus
            ]
        );

        res.status(201).json({
            message: "Payment record created successfully",
            payment: {
                id: result.insertId,
                student_id,
                student_name: student.name,
                roll_number: student.roll_number,
                amount,
                payment_type,
                status: paymentStatus
            }
        });

    } catch (error) {
        console.error(
            "Create payment error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// GET MY PAYMENTS
// STUDENT
// =========================================

const getMyPayments = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [students] = await pool.query(
            `
            SELECT id
            FROM students
            WHERE user_id = ?
            `,
            [userId]
        );

        if (students.length === 0) {
            return res.status(404).json({
                message: "Student profile not found"
            });
        }

        const studentId = students[0].id;

        const [payments] = await pool.query(
            `
            SELECT
                id,
                amount,
                payment_type,
                payment_date,
                status
            FROM payments
            WHERE student_id = ?
            ORDER BY payment_date DESC
            `,
            [studentId]
        );

        res.json({
            message: "Payments retrieved successfully",
            payments
        });

    } catch (error) {
        console.error(
            "Get my payments error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// UPDATE PAYMENT STATUS
// ADMIN
// =========================================

const updatePaymentStatus = async (req, res) => {
    try {
        const paymentId = req.params.id;

        const {
            status
        } = req.body;

        const validStatuses = [
            "pending",
            "paid",
            "failed"
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid payment status"
            });
        }

        const [payments] = await pool.query(
            `
            SELECT id
            FROM payments
            WHERE id = ?
            `,
            [paymentId]
        );

        if (payments.length === 0) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        await pool.query(
            `
            UPDATE payments
            SET status = ?
            WHERE id = ?
            `,
            [
                status,
                paymentId
            ]
        );

        res.json({
            message: "Payment status updated successfully",
            payment: {
                id: Number(paymentId),
                status
            }
        });

    } catch (error) {
        console.error(
            "Update payment status error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createPayment,
    getMyPayments,
    updatePaymentStatus
};