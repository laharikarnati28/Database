const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getDashboardSummary,
    getAllStudents,
    getAllWardens,
    createWarden,
    getAllPayments,
    getReports
} = require("../controllers/adminController");

const router = express.Router();


// =========================================
// ADMIN DASHBOARD
// =========================================

router.get(
    "/dashboard",
    protect,
    authorizeRoles("admin"),
    getDashboardSummary
);


// =========================================
// STUDENTS
// =========================================

router.get(
    "/students",
    protect,
    authorizeRoles("admin"),
    getAllStudents
);


// =========================================
// WARDENS
// =========================================

router.get(
    "/wardens",
    protect,
    authorizeRoles("admin"),
    getAllWardens
);

router.post(
    "/wardens",
    protect,
    authorizeRoles("admin"),
    createWarden
);


// =========================================
// PAYMENTS
// =========================================

router.get(
    "/payments",
    protect,
    authorizeRoles("admin"),
    getAllPayments
);


// =========================================
// REPORTS
// =========================================

router.get(
    "/reports",
    protect,
    authorizeRoles("admin"),
    getReports
);


module.exports = router;