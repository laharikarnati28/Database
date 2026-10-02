const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
} = require("../controllers/notificationController");

const router = express.Router();


// =========================================
// GET MY NOTIFICATIONS
// =========================================

router.get(
    "/",
    protect,
    getMyNotifications
);


// =========================================
// MARK ONE NOTIFICATION AS READ
// =========================================

router.patch(
    "/:id/read",
    protect,
    markNotificationAsRead
);


// =========================================
// MARK ALL NOTIFICATIONS AS READ
// =========================================

router.patch(
    "/read-all",
    protect,
    markAllNotificationsAsRead
);


module.exports = router;