const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const studentRoutes = require("./routes/studentRoutes");
const hostelRoutes = require("./routes/hostelRoutes");
const roomAllocationRoutes = require("./routes/roomAllocationRoutes");
const messRoutes = require("./routes/messRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const wardenRoutes = require("./routes/wardenRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();


// =========================================
// MIDDLEWARE
// =========================================

app.use(cors());

app.use(express.json());


// =========================================
// ROOT ROUTE
// =========================================

app.get("/", (req, res) => {

    res.json({
        message:
            "Hostel Management Backend is running!"
    });

});


// =========================================
// DATABASE TEST
// =========================================

app.get("/api/test-db", async (req, res) => {

    try {

        const [rows] =
            await pool.query(
                "SELECT 1 AS result"
            );

        res.json({

            message:
                "Database connected successfully!",

            result:
                rows[0].result

        });

    } catch (error) {

        console.error(
            "Database error:",
            error
        );

        res.status(500).json({

            message:
                "Database connection failed"

        });

    }

});


// =========================================
// API ROUTES
// =========================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/test",
    testRoutes
);

app.use(
    "/api/students",
    studentRoutes
);

app.use(
    "/api/hostels",
    hostelRoutes
);

app.use(
    "/api/room-allocations",
    roomAllocationRoutes
);

app.use(
    "/api/mess",
    messRoutes
);

app.use(
    "/api/complaints",
    complaintRoutes
);

app.use(
    "/api/leaves",
    leaveRoutes
);

app.use(
    "/api/payments",
    paymentRoutes
);

app.use(
    "/api/warden",
    wardenRoutes
);

app.use(
    "/api/admin",
    adminRoutes
);

app.use(
    "/api/notifications",
    notificationRoutes
);


// =========================================
// START SERVER
// =========================================

const PORT =
    process.env.PORT || 5002;

app.listen(
    PORT,
    () => {

        console.log(
            `Server running on http://localhost:${PORT}`
        );

    }
);