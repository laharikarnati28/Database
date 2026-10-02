const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    createLeaveRequest,
    getMyLeaveRequests,
    getAllLeaveRequests,
    updateLeaveStatus
} = require("../controllers/leaveController");

const router = express.Router();


// =========================================
// CREATE LEAVE REQUEST
// STUDENT
// =========================================

router.post(
    "/",
    protect,
    authorizeRoles("student"),
    createLeaveRequest
);


// =========================================
// GET MY LEAVE REQUESTS
// STUDENT
// =========================================

router.get(
    "/my",
    protect,
    authorizeRoles("student"),
    getMyLeaveRequests
);


// =========================================
// GET ALL LEAVE REQUESTS
// WARDEN / ADMIN
// =========================================

router.get(
    "/",
    protect,
    authorizeRoles("warden", "admin"),
    getAllLeaveRequests
);


// =========================================
// UPDATE LEAVE STATUS
// WARDEN / ADMIN
// =========================================

router.patch(
    "/:id/status",
    protect,
    authorizeRoles("warden", "admin"),
    updateLeaveStatus
);


module.exports = router;