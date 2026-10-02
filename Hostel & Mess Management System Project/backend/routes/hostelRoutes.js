const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getAllHostels,
    getAllRooms,
    createHostel,
    createRoom
} = require("../controllers/hostelController");

const router = express.Router();


// =========================================
// GET ALL HOSTELS
// STUDENT / WARDEN / ADMIN
// =========================================

router.get(
    "/",
    protect,
    authorizeRoles("student", "warden", "admin"),
    getAllHostels
);


// =========================================
// GET ALL ROOMS
// STUDENT / WARDEN / ADMIN
// =========================================

router.get(
    "/rooms",
    protect,
    authorizeRoles("student", "warden", "admin"),
    getAllRooms
);


// =========================================
// CREATE HOSTEL
// ADMIN ONLY
// =========================================

router.post(
    "/",
    protect,
    authorizeRoles("admin"),
    createHostel
);


// =========================================
// CREATE ROOM
// ADMIN OR WARDEN
// =========================================

router.post(
    "/rooms",
    protect,
    authorizeRoles("admin", "warden"),
    createRoom
);


module.exports = router;