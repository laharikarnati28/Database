const pool = require("../config/db");

// =========================================
// GET LOGGED-IN STUDENT PROFILE
// =========================================

const getStudentProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [students] = await pool.query(
            `
            SELECT
                users.id AS user_id,
                users.name,
                users.email,
                users.role,

                students.id AS student_id,
                students.roll_number,
                students.department,
                students.year,

                rooms.id AS room_id,
                rooms.room_number,
                rooms.capacity,
                rooms.occupied_count,

                hostels.id AS hostel_id,
                hostels.name AS hostel_name,
                hostels.location AS hostel_location,

                room_allocations.start_date,
                room_allocations.end_date,
                room_allocations.status AS allocation_status

            FROM users

            INNER JOIN students
                ON users.id = students.user_id

            LEFT JOIN room_allocations
                ON students.id = room_allocations.student_id
                AND room_allocations.status = 'active'

            LEFT JOIN rooms
                ON room_allocations.room_id = rooms.id

            LEFT JOIN hostels
                ON rooms.hostel_id = hostels.id

            WHERE users.id = ?
            `,
            [userId]
        );

        if (students.length === 0) {
            return res.status(404).json({
                message: "Student profile not found"
            });
        }

        const student = students[0];

        res.json({
            message: "Student profile retrieved successfully",

            student: {
                user_id: student.user_id,
                name: student.name,
                email: student.email,
                role: student.role,

                student_id: student.student_id,
                roll_number: student.roll_number,
                department: student.department,
                year: student.year,

                room: student.room_id
                    ? {
                        room_id: student.room_id,
                        room_number: student.room_number,
                        capacity: student.capacity,
                        occupied_count: student.occupied_count,

                        hostel_id: student.hostel_id,
                        hostel_name: student.hostel_name,
                        hostel_location: student.hostel_location,

                        start_date: student.start_date,
                        end_date: student.end_date,
                        status: student.allocation_status
                    }
                    : null
            }
        });

    } catch (error) {

        console.error(
            "Get student profile error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    getStudentProfile
};