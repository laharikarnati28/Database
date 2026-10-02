const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    createMenu,
    getMenu,
    markAttendance,
    getMyAttendance
} = require("../controllers/messController");

const router = express.Router();


// =========================================
// CREATE MENU
// ADMIN / WARDEN
// =========================================

router.post(
    "/menu",
    protect,
    authorizeRoles("admin", "warden"),
    createMenu
);


// =========================================
// GET MENU
// STUDENT / WARDEN / ADMIN
// =========================================

router.get(
    "/menu",
    protect,
    authorizeRoles("student", "warden", "admin"),
    getMenu
);


// =========================================
// MARK ATTENDANCE
// STUDENT
// =========================================

router.post(
    "/attendance",
    protect,
    authorizeRoles("student"),
    markAttendance
);


// =========================================
// GET MY ATTENDANCE
// STUDENT
// =========================================

router.get(
    "/attendance/my",
    protect,
    authorizeRoles("student"),
    getMyAttendance
);


module.exports = router;