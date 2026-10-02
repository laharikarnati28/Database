const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    allocateRoom,
    getAllAllocations,
    deallocateRoom,
    transferRoom
} = require("../controllers/roomAllocationController");

const router = express.Router();


// =========================================
// ALLOCATE ROOM
// ADMIN / WARDEN
// =========================================

router.post(
    "/",
    protect,
    authorizeRoles("admin", "warden"),
    allocateRoom
);


// =========================================
// GET ALL ALLOCATIONS
// ADMIN / WARDEN
// =========================================

router.get(
    "/",
    protect,
    authorizeRoles("admin", "warden"),
    getAllAllocations
);


// =========================================
// DEALLOCATE ROOM
// ADMIN / WARDEN
// =========================================

router.patch(
    "/:id/deallocate",
    protect,
    authorizeRoles("admin", "warden"),
    deallocateRoom
);


// =========================================
// TRANSFER ROOM
// ADMIN / WARDEN
// =========================================

router.patch(
    "/:id/transfer",
    protect,
    authorizeRoles("admin", "warden"),
    transferRoom
);


module.exports = router;