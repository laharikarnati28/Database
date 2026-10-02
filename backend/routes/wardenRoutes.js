const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getDashboardSummary,
    getAllStudents
} = require("../controllers/wardenController");

const router = express.Router();


// =========================================
// WARDEN DASHBOARD
// WARDEN ONLY
// =========================================

router.get(
    "/dashboard",
    protect,
    authorizeRoles("warden"),
    getDashboardSummary
);


// =========================================
// GET ALL STUDENTS
// WARDEN / ADMIN
// =========================================

router.get(
    "/students",
    protect,
    authorizeRoles("warden", "admin"),
    getAllStudents
);


module.exports = router;