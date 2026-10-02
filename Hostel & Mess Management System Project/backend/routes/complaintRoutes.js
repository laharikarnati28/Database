const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    createComplaint,
    getMyComplaints,
    getAllComplaints,
    updateComplaintStatus
} = require("../controllers/complaintController");

const router = express.Router();


// =========================================
// CREATE COMPLAINT
// STUDENT
// =========================================

router.post(
    "/",
    protect,
    authorizeRoles("student"),
    createComplaint
);


// =========================================
// GET MY COMPLAINTS
// STUDENT
// =========================================

router.get(
    "/my",
    protect,
    authorizeRoles("student"),
    getMyComplaints
);


// =========================================
// GET ALL COMPLAINTS
// WARDEN / ADMIN
// =========================================

router.get(
    "/",
    protect,
    authorizeRoles("warden", "admin"),
    getAllComplaints
);


// =========================================
// UPDATE COMPLAINT STATUS
// WARDEN / ADMIN
// =========================================

router.patch(
    "/:id/status",
    protect,
    authorizeRoles("warden", "admin"),
    updateComplaintStatus
);


module.exports = router;