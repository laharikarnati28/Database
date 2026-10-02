const pool = require("../config/db");


// =========================================
// CREATE COMPLAINT
// STUDENT
// =========================================

const createComplaint = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {
            category,
            description
        } = req.body;

        if (!category || !description) {
            return res.status(400).json({
                message: "Category and description are required"
            });
        }


        // =========================================
        // FIND STUDENT
        // =========================================

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


        // =========================================
        // CREATE COMPLAINT
        // =========================================

        const [result] = await pool.query(
            `
            INSERT INTO complaints
            (
                student_id,
                category,
                description,
                status
            )
            VALUES (?, ?, ?, 'pending')
            `,
            [
                studentId,
                category,
                description
            ]
        );


        res.status(201).json({
            message: "Complaint submitted successfully",
            complaint: {
                id: result.insertId,
                student_id: studentId,
                category,
                description,
                status: "pending"
            }
        });

    } catch (error) {

        console.error(
            "Create complaint error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// GET MY COMPLAINTS
// STUDENT
// =========================================

const getMyComplaints = async (req, res) => {
    try {
        const userId = req.user.userId;


        // =========================================
        // FIND STUDENT
        // =========================================

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


        // =========================================
        // GET COMPLAINTS
        // =========================================

        const [complaints] = await pool.query(
            `
            SELECT
                id,
                category,
                description,
                status,
                created_at,
                resolved_at
            FROM complaints
            WHERE student_id = ?
            ORDER BY created_at DESC
            `,
            [studentId]
        );


        res.json({
            message: "Complaints retrieved successfully",
            complaints
        });

    } catch (error) {

        console.error(
            "Get complaints error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// GET ALL COMPLAINTS
// WARDEN / ADMIN
// =========================================

const getAllComplaints = async (req, res) => {
    try {

        const [complaints] = await pool.query(
            `
            SELECT
                complaints.id,
                complaints.category,
                complaints.description,
                complaints.status,
                complaints.created_at,
                complaints.resolved_at,

                students.id AS student_id,
                students.roll_number,

                users.name AS student_name,
                users.email AS student_email

            FROM complaints

            INNER JOIN students
                ON complaints.student_id = students.id

            INNER JOIN users
                ON students.user_id = users.id

            ORDER BY complaints.created_at DESC
            `
        );


        res.json({
            message: "Complaints retrieved successfully",
            complaints
        });

    } catch (error) {

        console.error(
            "Get all complaints error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// UPDATE COMPLAINT STATUS
// WARDEN / ADMIN
// =========================================

const updateComplaintStatus = async (req, res) => {
    try {

        const complaintId = req.params.id;

        const {
            status
        } = req.body;


        // =========================================
        // VALIDATE STATUS
        // =========================================

        const validStatuses = [
            "pending",
            "in_progress",
            "resolved"
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid complaint status"
            });
        }


        // =========================================
        // CHECK COMPLAINT
        // =========================================

        const [complaints] = await pool.query(
            `
            SELECT id
            FROM complaints
            WHERE id = ?
            `,
            [complaintId]
        );

        if (complaints.length === 0) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }


        // =========================================
        // UPDATE STATUS
        // =========================================

        if (status === "resolved") {

            await pool.query(
                `
                UPDATE complaints
                SET
                    status = ?,
                    resolved_at = CURRENT_TIMESTAMP
                WHERE id = ?
                `,
                [
                    status,
                    complaintId
                ]
            );

        } else {

            await pool.query(
                `
                UPDATE complaints
                SET
                    status = ?,
                    resolved_at = NULL
                WHERE id = ?
                `,
                [
                    status,
                    complaintId
                ]
            );
        }


        res.json({
            message: "Complaint status updated successfully",
            complaint: {
                id: Number(complaintId),
                status
            }
        });

    } catch (error) {

        console.error(
            "Update complaint status error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createComplaint,
    getMyComplaints,
    getAllComplaints,
    updateComplaintStatus
};