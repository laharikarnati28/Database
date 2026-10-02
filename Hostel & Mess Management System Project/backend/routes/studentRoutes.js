const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getStudentProfile
} = require("../controllers/studentController");

const router = express.Router();


// =========================================
// GET LOGGED-IN STUDENT PROFILE
// =========================================

router.get(
    "/profile",
    protect,
    authorizeRoles("student"),
    getStudentProfile
);


module.exports = router;