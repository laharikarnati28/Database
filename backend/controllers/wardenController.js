const pool = require("../config/db");


// =========================================
// GET WARDEN DASHBOARD SUMMARY
// WARDEN ONLY
// =========================================

const getDashboardSummary = async (req, res) => {
    try {

        // -------------------------------
        // TOTAL STUDENTS
        // -------------------------------

        const [studentRows] =
            await pool.query(
                `
                SELECT COUNT(*) AS total_students
                FROM students
                `
            );


        // -------------------------------
        // ROOM INFORMATION
        // -------------------------------

        const [roomRows] =
            await pool.query(
                `
                SELECT
                    COUNT(*) AS total_rooms,

                    COALESCE(
                        SUM(capacity),
                        0
                    ) AS total_capacity,

                    COALESCE(
                        SUM(occupied_count),
                        0
                    ) AS occupied_beds

                FROM rooms
                `
            );


        // -------------------------------
        // PENDING COMPLAINTS
        // -------------------------------

        const [complaintRows] =
            await pool.query(
                `
                SELECT COUNT(*) AS pending_complaints
                FROM complaints
                WHERE status = 'pending'
                `
            );


        // -------------------------------
        // PENDING LEAVE REQUESTS
        // -------------------------------

        const [leaveRows] =
            await pool.query(
                `
                SELECT COUNT(*) AS pending_leaves
                FROM leave_requests
                WHERE status = 'pending'
                `
            );


        // -------------------------------
        // CALCULATE AVAILABLE BEDS
        // -------------------------------

        const totalCapacity =
            Number(
                roomRows[0].total_capacity
            );

        const occupiedBeds =
            Number(
                roomRows[0].occupied_beds
            );

        const availableBeds =
            totalCapacity -
            occupiedBeds;


        // -------------------------------
        // RESPONSE
        // -------------------------------

        res.json({

            message:
                "Warden dashboard summary retrieved successfully",

            summary: {

                total_students:
                    studentRows[0]
                        .total_students,

                total_rooms:
                    roomRows[0]
                        .total_rooms,

                total_capacity:
                    totalCapacity,

                occupied_beds:
                    occupiedBeds,

                available_beds:
                    availableBeds,

                pending_complaints:
                    complaintRows[0]
                        .pending_complaints,

                pending_leaves:
                    leaveRows[0]
                        .pending_leaves
            }
        });

    } catch (error) {

        console.error(
            "Get warden dashboard error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// GET ALL STUDENTS
// WARDEN / ADMIN
// =========================================

const getAllStudents = async (req, res) => {
    try {

        const [students] =
            await pool.query(
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
                    ON students.user_id =
                       users.id

                LEFT JOIN room_allocations
                    ON students.id =
                       room_allocations.student_id

                    AND room_allocations.status =
                        'active'

                LEFT JOIN rooms
                    ON room_allocations.room_id =
                       rooms.id

                LEFT JOIN hostels
                    ON rooms.hostel_id =
                       hostels.id

                ORDER BY students.id
                `
            );

        res.json({

            message:
                "Students retrieved successfully",

            students
        });

    } catch (error) {

        console.error(
            "Get all students error:",
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
    getAllStudents
};