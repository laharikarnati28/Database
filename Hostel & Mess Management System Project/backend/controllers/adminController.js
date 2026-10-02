const bcrypt = require("bcryptjs");
const pool = require("../config/db");

// =========================================
// GET ADMIN DASHBOARD SUMMARY
// ADMIN ONLY
// =========================================

const getDashboardSummary = async (req, res) => {
    try {

        const [studentRows] = await pool.query(
            `
            SELECT COUNT(*) AS total_students
            FROM students
            `
        );

        const [wardenRows] = await pool.query(
            `
            SELECT COUNT(*) AS total_wardens
            FROM wardens
            `
        );

        const [hostelRows] = await pool.query(
            `
            SELECT COUNT(*) AS total_hostels
            FROM hostels
            `
        );

        const [roomRows] = await pool.query(
            `
            SELECT COUNT(*) AS total_rooms
            FROM rooms
            `
        );

        const [complaintRows] = await pool.query(
            `
            SELECT COUNT(*) AS pending_complaints
            FROM complaints
            WHERE status = 'pending'
            `
        );

        const [leaveRows] = await pool.query(
            `
            SELECT COUNT(*) AS pending_leaves
            FROM leave_requests
            WHERE status = 'pending'
            `
        );

        res.json({
            message:
                "Admin dashboard summary retrieved successfully",

            summary: {
                total_students:
                    studentRows[0].total_students,

                total_wardens:
                    wardenRows[0].total_wardens,

                total_hostels:
                    hostelRows[0].total_hostels,

                total_rooms:
                    roomRows[0].total_rooms,

                pending_complaints:
                    complaintRows[0].pending_complaints,

                pending_leaves:
                    leaveRows[0].pending_leaves
            }
        });

    } catch (error) {

        console.error(
            "Get admin dashboard error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// GET ALL STUDENTS
// ADMIN ONLY
// =========================================

const getAllStudents = async (req, res) => {
    try {

        const [students] = await pool.query(
            `
            SELECT
                students.id AS student_id,
                students.roll_number,
                students.department,
                students.year,

                users.id AS user_id,
                users.name,
                users.email,

                rooms.id AS room_id,
                rooms.room_number,

                hostels.id AS hostel_id,
                hostels.name AS hostel_name

            FROM students

            INNER JOIN users
                ON students.user_id = users.id

            LEFT JOIN room_allocations
                ON students.id = room_allocations.student_id
                AND room_allocations.status = 'active'

            LEFT JOIN rooms
                ON room_allocations.room_id = rooms.id

            LEFT JOIN hostels
                ON rooms.hostel_id = hostels.id

            ORDER BY students.id
            `
        );

        res.json({
            message:
                "Admin students retrieved successfully",

            students
        });

    } catch (error) {

        console.error(
            "Get admin students error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// GET ALL WARDENS
// ADMIN ONLY
// =========================================

const getAllWardens = async (req, res) => {
    try {

        const [wardens] = await pool.query(
            `
            SELECT
                wardens.id AS warden_id,
                wardens.employee_id,

                users.id AS user_id,
                users.name,
                users.email,
                users.created_at

            FROM wardens

            INNER JOIN users
                ON wardens.user_id = users.id

            ORDER BY wardens.id
            `
        );

        res.json({
            message:
                "Admin wardens retrieved successfully",

            wardens
        });

    } catch (error) {

        console.error(
            "Get admin wardens error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// CREATE WARDEN
// ADMIN ONLY
// =========================================

const createWarden = async (req, res) => {
    const connection = await pool.getConnection();

    try {

        const {
            name,
            email,
            password,
            employee_id
        } = req.body;

        if (
            !name ||
            !email ||
            !password ||
            !employee_id
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const [existingUsers] =
            await connection.query(
                `
                SELECT id
                FROM users
                WHERE email = ?
                `,
                [email]
            );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const [existingWardens] =
            await connection.query(
                `
                SELECT id
                FROM wardens
                WHERE employee_id = ?
                `,
                [employee_id]
            );

        if (existingWardens.length > 0) {
            return res.status(400).json({
                message: "Employee ID already registered"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        await connection.beginTransaction();

        const [userResult] =
            await connection.query(
                `
                INSERT INTO users
                (
                    name,
                    email,
                    password,
                    role
                )
                VALUES (?, ?, ?, 'warden')
                `,
                [
                    name,
                    email,
                    hashedPassword
                ]
            );

        const userId =
            userResult.insertId;

        const [wardenResult] =
            await connection.query(
                `
                INSERT INTO wardens
                (
                    user_id,
                    employee_id
                )
                VALUES (?, ?)
                `,
                [
                    userId,
                    employee_id
                ]
            );

        await connection.commit();

        res.status(201).json({
            message:
                "Warden created successfully",

            warden: {
                warden_id:
                    wardenResult.insertId,

                user_id:
                    userId,

                name,
                email,
                employee_id,
                role: "warden"
            }
        });

    } catch (error) {

        await connection.rollback();

        console.error(
            "Create warden error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });

    } finally {

        connection.release();
    }
};


// =========================================
// GET ALL PAYMENTS
// ADMIN ONLY
// =========================================

const getAllPayments = async (req, res) => {
    try {

        const [payments] = await pool.query(
            `
            SELECT
                payments.id,
                payments.amount,
                payments.payment_type,
                payments.payment_date,
                payments.status,

                students.id AS student_id,
                students.roll_number,

                users.name AS student_name,
                users.email AS student_email

            FROM payments

            INNER JOIN students
                ON payments.student_id = students.id

            INNER JOIN users
                ON students.user_id = users.id

            ORDER BY payments.id DESC
            `
        );

        res.json({
            message:
                "Admin payments retrieved successfully",

            payments
        });

    } catch (error) {

        console.error(
            "Get admin payments error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// GET ADMIN REPORTS
// ADMIN ONLY
// =========================================

const getReports = async (req, res) => {
    try {

        // -------------------------------
        // BASIC COUNTS
        // -------------------------------

        const [studentRows] = await pool.query(
            `
            SELECT COUNT(*) AS total_students
            FROM students
            `
        );

        const [wardenRows] = await pool.query(
            `
            SELECT COUNT(*) AS total_wardens
            FROM wardens
            `
        );

        const [hostelRows] = await pool.query(
            `
            SELECT COUNT(*) AS total_hostels
            FROM hostels
            `
        );

        const [roomRows] = await pool.query(
            `
            SELECT
                COUNT(*) AS total_rooms,
                COALESCE(SUM(capacity), 0) AS total_capacity,
                COALESCE(SUM(occupied_count), 0) AS total_occupied
            FROM rooms
            `
        );


        // -------------------------------
        // ROOM OCCUPANCY
        // -------------------------------

        const [roomOccupancyRows] =
            await pool.query(
                `
                SELECT
                    COALESCE(SUM(capacity), 0)
                        AS total_capacity,

                    COALESCE(
                        SUM(occupied_count),
                        0
                    ) AS occupied_beds,

                    COALESCE(
                        SUM(capacity - occupied_count),
                        0
                    ) AS available_beds
                FROM rooms
                `
            );


        // -------------------------------
        // COMPLAINT COUNTS
        // -------------------------------

        const [complaintRows] =
            await pool.query(
                `
                SELECT
                    COUNT(*) AS total_complaints,

                    SUM(
                        CASE
                            WHEN status = 'pending'
                            THEN 1
                            ELSE 0
                        END
                    ) AS pending_complaints,

                    SUM(
                        CASE
                            WHEN status = 'in_progress'
                            THEN 1
                            ELSE 0
                        END
                    ) AS in_progress_complaints,

                    SUM(
                        CASE
                            WHEN status = 'resolved'
                            THEN 1
                            ELSE 0
                        END
                    ) AS resolved_complaints

                FROM complaints
                `
            );


        // -------------------------------
        // LEAVE REQUEST COUNTS
        // -------------------------------

        const [leaveRows] =
            await pool.query(
                `
                SELECT
                    COUNT(*) AS total_leaves,

                    SUM(
                        CASE
                            WHEN status = 'pending'
                            THEN 1
                            ELSE 0
                        END
                    ) AS pending_leaves,

                    SUM(
                        CASE
                            WHEN status = 'approved'
                            THEN 1
                            ELSE 0
                        END
                    ) AS approved_leaves,

                    SUM(
                        CASE
                            WHEN status = 'rejected'
                            THEN 1
                            ELSE 0
                        END
                    ) AS rejected_leaves

                FROM leave_requests
                `
            );


        // -------------------------------
        // PAYMENT REPORT
        // -------------------------------

        const [paymentRows] =
            await pool.query(
                `
                SELECT
                    COUNT(*) AS total_payments,

                    COALESCE(
                        SUM(amount),
                        0
                    ) AS total_amount,

                    COALESCE(
                        SUM(
                            CASE
                                WHEN status = 'paid'
                                THEN amount
                                ELSE 0
                            END
                        ),
                        0
                    ) AS paid_amount,

                    COALESCE(
                        SUM(
                            CASE
                                WHEN status = 'pending'
                                THEN amount
                                ELSE 0
                            END
                        ),
                        0
                    ) AS pending_amount,

                    COALESCE(
                        SUM(
                            CASE
                                WHEN status = 'failed'
                                THEN amount
                                ELSE 0
                            END
                        ),
                        0
                    ) AS failed_amount

                FROM payments
                `
            );


        // -------------------------------
        // MESS ATTENDANCE
        // -------------------------------

        const [attendanceRows] =
            await pool.query(
                `
                SELECT
                    COUNT(*) AS total_attendance_records,

                    SUM(
                        CASE
                            WHEN status = 'present'
                            THEN 1
                            ELSE 0
                        END
                    ) AS present_count,

                    SUM(
                        CASE
                            WHEN status = 'absent'
                            THEN 1
                            ELSE 0
                        END
                    ) AS absent_count

                FROM mess_attendance
                `
            );


        // -------------------------------
        // RESPONSE
        // -------------------------------

        res.json({

            message:
                "Admin reports retrieved successfully",

            reports: {

                students: {
                    total:
                        studentRows[0].total_students
                },

                wardens: {
                    total:
                        wardenRows[0].total_wardens
                },

                hostels: {
                    total:
                        hostelRows[0].total_hostels
                },

                rooms: {
                    total:
                        roomRows[0].total_rooms,

                    total_capacity:
                        roomRows[0].total_capacity,

                    total_occupied:
                        roomRows[0].total_occupied,

                    available_beds:
                        roomOccupancyRows[0]
                            .available_beds
                },

                occupancy: {
                    total_capacity:
                        roomOccupancyRows[0]
                            .total_capacity,

                    occupied_beds:
                        roomOccupancyRows[0]
                            .occupied_beds,

                    available_beds:
                        roomOccupancyRows[0]
                            .available_beds
                },

                complaints: {
                    total:
                        complaintRows[0]
                            .total_complaints,

                    pending:
                        complaintRows[0]
                            .pending_complaints,

                    in_progress:
                        complaintRows[0]
                            .in_progress_complaints,

                    resolved:
                        complaintRows[0]
                            .resolved_complaints
                },

                leaves: {
                    total:
                        leaveRows[0]
                            .total_leaves,

                    pending:
                        leaveRows[0]
                            .pending_leaves,

                    approved:
                        leaveRows[0]
                            .approved_leaves,

                    rejected:
                        leaveRows[0]
                            .rejected_leaves
                },

                payments: {
                    total:
                        paymentRows[0]
                            .total_payments,

                    total_amount:
                        paymentRows[0]
                            .total_amount,

                    paid_amount:
                        paymentRows[0]
                            .paid_amount,

                    pending_amount:
                        paymentRows[0]
                            .pending_amount,

                    failed_amount:
                        paymentRows[0]
                            .failed_amount
                },

                mess_attendance: {
                    total_records:
                        attendanceRows[0]
                            .total_attendance_records,

                    present:
                        attendanceRows[0]
                            .present_count,

                    absent:
                        attendanceRows[0]
                            .absent_count
                }
            }
        });

    } catch (error) {

        console.error(
            "Get admin reports error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// EXPORT
// =========================================

module.exports = {
    getDashboardSummary,
    getAllStudents,
    getAllWardens,
    createWarden,
    getAllPayments,
    getReports
};