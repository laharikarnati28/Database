const pool = require("../config/db");


// =========================================
// CREATE LEAVE REQUEST
// STUDENT
// =========================================

const createLeaveRequest = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {
            start_date,
            end_date,
            reason
        } = req.body;


        // =========================================
        // VALIDATE INPUT
        // =========================================

        if (!start_date || !end_date || !reason) {
            return res.status(400).json({
                message: "Start date, end date and reason are required"
            });
        }


        // =========================================
        // VALIDATE DATE ORDER
        // =========================================

        if (end_date < start_date) {
            return res.status(400).json({
                message: "End date cannot be before start date"
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
        // CREATE LEAVE REQUEST
        // =========================================

        const [result] = await pool.query(
            `
            INSERT INTO leave_requests
            (
                student_id,
                start_date,
                end_date,
                reason,
                status
            )
            VALUES (?, ?, ?, ?, 'pending')
            `,
            [
                studentId,
                start_date,
                end_date,
                reason
            ]
        );


        res.status(201).json({
            message: "Leave request submitted successfully",
            leave_request: {
                id: result.insertId,
                student_id: studentId,
                start_date,
                end_date,
                reason,
                status: "pending"
            }
        });

    } catch (error) {

        console.error(
            "Create leave request error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// GET MY LEAVE REQUESTS
// STUDENT
// =========================================

const getMyLeaveRequests = async (req, res) => {
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
        // GET LEAVE REQUESTS
        // =========================================

        const [requests] = await pool.query(
            `
            SELECT
                id,
                start_date,
                end_date,
                reason,
                status,
                created_at
            FROM leave_requests
            WHERE student_id = ?
            ORDER BY created_at DESC
            `,
            [studentId]
        );


        res.json({
            message: "Leave requests retrieved successfully",
            leave_requests: requests
        });

    } catch (error) {

        console.error(
            "Get leave requests error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// GET ALL LEAVE REQUESTS
// WARDEN / ADMIN
// =========================================

const getAllLeaveRequests = async (req, res) => {
    try {

        const [requests] = await pool.query(
            `
            SELECT
                leave_requests.id,
                leave_requests.start_date,
                leave_requests.end_date,
                leave_requests.reason,
                leave_requests.status,
                leave_requests.created_at,

                students.id AS student_id,
                students.roll_number,

                users.name AS student_name,
                users.email AS student_email

            FROM leave_requests

            INNER JOIN students
                ON leave_requests.student_id = students.id

            INNER JOIN users
                ON students.user_id = users.id

            ORDER BY leave_requests.created_at DESC
            `
        );


        res.json({
            message: "Leave requests retrieved successfully",
            leave_requests: requests
        });

    } catch (error) {

        console.error(
            "Get all leave requests error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// UPDATE LEAVE REQUEST STATUS
// WARDEN / ADMIN
// =========================================

const updateLeaveStatus = async (req, res) => {
    try {

        const leaveId = req.params.id;

        const {
            status
        } = req.body;


        // =========================================
        // VALIDATE STATUS
        // =========================================

        const validStatuses = [
            "pending",
            "approved",
            "rejected"
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid leave status"
            });
        }


        // =========================================
        // GET REQUEST + STUDENT USER ID
        // =========================================

        const [requests] = await pool.query(
            `
            SELECT
                leave_requests.id,
                leave_requests.start_date,
                leave_requests.end_date,
                leave_requests.status,
                students.user_id
            FROM leave_requests

            INNER JOIN students
                ON leave_requests.student_id =
                   students.id

            WHERE leave_requests.id = ?
            `,
            [leaveId]
        );

        if (requests.length === 0) {
            return res.status(404).json({
                message: "Leave request not found"
            });
        }

        const leaveRequest = requests[0];


        // =========================================
        // UPDATE STATUS
        // =========================================

        await pool.query(
            `
            UPDATE leave_requests
            SET status = ?
            WHERE id = ?
            `,
            [
                status,
                leaveId
            ]
        );


        // =========================================
        // CREATE NOTIFICATION
        // ONLY FOR APPROVED / REJECTED
        // =========================================

        if (
            status === "approved" ||
            status === "rejected"
        ) {

            const title =
                status === "approved"
                    ? "Leave Request Approved"
                    : "Leave Request Rejected";

            const message =
                status === "approved"
                    ? `Your leave request from ${leaveRequest.start_date} to ${leaveRequest.end_date} has been approved.`
                    : `Your leave request from ${leaveRequest.start_date} to ${leaveRequest.end_date} has been rejected.`;


            await pool.query(
                `
                INSERT INTO notifications
                (
                    user_id,
                    title,
                    message
                )
                VALUES (?, ?, ?)
                `,
                [
                    leaveRequest.user_id,
                    title,
                    message
                ]
            );
        }


        res.json({
            message: "Leave request status updated successfully",
            leave_request: {
                id: Number(leaveId),
                status
            }
        });

    } catch (error) {

        console.error(
            "Update leave status error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createLeaveRequest,
    getMyLeaveRequests,
    getAllLeaveRequests,
    updateLeaveStatus
};