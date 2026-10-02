const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");


// =========================================
// STUDENT REGISTRATION
// =========================================

const register = async (req, res) => {
    try {

        const {
            name,
            email,
            password,
            roll_number,
            department,
            year
        } = req.body;


        // -------------------------------
        // VALIDATION
        // -------------------------------

        if (
            !name ||
            !email ||
            !password ||
            !roll_number ||
            !department ||
            !year
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }


        // -------------------------------
        // CHECK EMAIL
        // -------------------------------

        const [existingUsers] =
            await pool.query(
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


        // -------------------------------
        // CHECK ROLL NUMBER
        // -------------------------------

        const [existingStudents] =
            await pool.query(
                `
                SELECT id
                FROM students
                WHERE roll_number = ?
                `,
                [roll_number]
            );

        if (existingStudents.length > 0) {
            return res.status(400).json({
                message: "Roll number already registered"
            });
        }


        // -------------------------------
        // HASH PASSWORD
        // -------------------------------

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // -------------------------------
        // CREATE USER
        // -------------------------------

        const [userResult] =
            await pool.query(
                `
                INSERT INTO users
                (
                    name,
                    email,
                    password,
                    role
                )
                VALUES (?, ?, ?, 'student')
                `,
                [
                    name,
                    email,
                    hashedPassword
                ]
            );


        const userId =
            userResult.insertId;


        // -------------------------------
        // CREATE STUDENT
        // -------------------------------

        await pool.query(
            `
            INSERT INTO students
            (
                user_id,
                roll_number,
                department,
                year
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                userId,
                roll_number,
                department,
                year
            ]
        );


        // -------------------------------
        // RESPONSE
        // -------------------------------

        res.status(201).json({
            message:
                "Student registered successfully"
        });

    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// LOGIN
// =========================================

const login = async (req, res) => {
    try {

        const {
            email,
            password
        } = req.body;


        // -------------------------------
        // VALIDATION
        // -------------------------------

        if (!email || !password) {
            return res.status(400).json({
                message:
                    "Email and password are required"
            });
        }


        // -------------------------------
        // FIND USER
        // -------------------------------

        const [users] =
            await pool.query(
                `
                SELECT *
                FROM users
                WHERE email = ?
                `,
                [email]
            );


        if (users.length === 0) {
            return res.status(401).json({
                message:
                    "Invalid email or password"
            });
        }


        const user = users[0];


        // -------------------------------
        // CHECK PASSWORD
        // -------------------------------

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {
            return res.status(401).json({
                message:
                    "Invalid email or password"
            });
        }


        // -------------------------------
        // CREATE JWT
        // -------------------------------

        const token =
            jwt.sign(
                {
                    userId: user.id,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            );


        // -------------------------------
        // RESPONSE
        // -------------------------------

        res.json({

            message:
                "Login successful",

            token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }

        });

    } catch (error) {

        console.error(
            "Login error:",
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
    register,
    login
};