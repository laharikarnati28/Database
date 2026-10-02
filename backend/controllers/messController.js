const pool = require("../config/db");


// =========================================
// CREATE MESS MENU
// ADMIN / WARDEN
// =========================================

const createMenu = async (req, res) => {
    try {
        const {
            menu_date,
            meal_type,
            food_items
        } = req.body;

        if (!menu_date || !meal_type || !food_items) {
            return res.status(400).json({
                message: "Menu date, meal type and food items are required"
            });
        }

        const validMealTypes = [
            "breakfast",
            "lunch",
            "snacks",
            "dinner"
        ];

        if (!validMealTypes.includes(meal_type)) {
            return res.status(400).json({
                message: "Invalid meal type"
            });
        }

        const [existingMenu] = await pool.query(
            `
            SELECT id
            FROM mess_menu
            WHERE menu_date = ?
            AND meal_type = ?
            `,
            [menu_date, meal_type]
        );

        if (existingMenu.length > 0) {
            return res.status(400).json({
                message: "Menu already exists for this meal"
            });
        }

        const [result] = await pool.query(
            `
            INSERT INTO mess_menu
            (menu_date, meal_type, food_items)
            VALUES (?, ?, ?)
            `,
            [
                menu_date,
                meal_type,
                food_items
            ]
        );

        res.status(201).json({
            message: "Mess menu created successfully",
            menu: {
                id: result.insertId,
                menu_date,
                meal_type,
                food_items
            }
        });

    } catch (error) {

        console.error(
            "Create menu error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// GET MESS MENU
// STUDENT / WARDEN / ADMIN
// =========================================

const getMenu = async (req, res) => {
    try {

        const [menus] = await pool.query(
            `
            SELECT
                id,
                menu_date,
                meal_type,
                food_items
            FROM mess_menu
            ORDER BY menu_date DESC,
                     FIELD(
                         meal_type,
                         'breakfast',
                         'lunch',
                         'snacks',
                         'dinner'
                     )
            `
        );

        res.json({
            message: "Mess menu retrieved successfully",
            menus
        });

    } catch (error) {

        console.error(
            "Get menu error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// MARK MESS ATTENDANCE
// STUDENT
// =========================================

const markAttendance = async (req, res) => {
    try {

        const userId = req.user.userId;

        const {
            attendance_date,
            meal_type,
            status
        } = req.body;


        // =========================================
        // VALIDATE INPUT
        // =========================================

        if (
            !attendance_date ||
            !meal_type ||
            !status
        ) {
            return res.status(400).json({
                message: "Attendance date, meal type and status are required"
            });
        }


        // =========================================
        // VALIDATE MEAL TYPE
        // =========================================

        const validMealTypes = [
            "breakfast",
            "lunch",
            "snacks",
            "dinner"
        ];

        if (!validMealTypes.includes(meal_type)) {
            return res.status(400).json({
                message: "Invalid meal type"
            });
        }


        // =========================================
        // VALIDATE STATUS
        // =========================================

        const validStatuses = [
            "present",
            "absent"
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid attendance status"
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
        // CHECK EXISTING ATTENDANCE
        // =========================================

        const [existingAttendance] = await pool.query(
            `
            SELECT id
            FROM mess_attendance
            WHERE student_id = ?
            AND attendance_date = ?
            AND meal_type = ?
            `,
            [
                studentId,
                attendance_date,
                meal_type
            ]
        );

        if (existingAttendance.length > 0) {
            return res.status(400).json({
                message: "Attendance already marked for this meal"
            });
        }


        // =========================================
        // INSERT ATTENDANCE
        // =========================================

        const [result] = await pool.query(
            `
            INSERT INTO mess_attendance
            (
                student_id,
                attendance_date,
                meal_type,
                status
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                studentId,
                attendance_date,
                meal_type,
                status
            ]
        );


        res.status(201).json({
            message: "Mess attendance marked successfully",
            attendance: {
                id: result.insertId,
                student_id: studentId,
                attendance_date,
                meal_type,
                status
            }
        });

    } catch (error) {

        console.error(
            "Mark attendance error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// GET MY MESS ATTENDANCE
// STUDENT
// =========================================

const getMyAttendance = async (req, res) => {
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
        // GET ATTENDANCE
        // =========================================

        const [attendance] = await pool.query(
            `
            SELECT
                id,
                attendance_date,
                meal_type,
                status
            FROM mess_attendance
            WHERE student_id = ?
            ORDER BY attendance_date DESC,
                     FIELD(
                         meal_type,
                         'breakfast',
                         'lunch',
                         'snacks',
                         'dinner'
                     )
            `,
            [studentId]
        );


        res.json({
            message: "Mess attendance retrieved successfully",
            attendance
        });

    } catch (error) {

        console.error(
            "Get attendance error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createMenu,
    getMenu,
    markAttendance,
    getMyAttendance
};