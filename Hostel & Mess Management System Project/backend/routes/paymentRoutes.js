const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    createPayment,
    getMyPayments,
    updatePaymentStatus
} = require("../controllers/paymentController");

const router = express.Router();


// =========================================
// CREATE PAYMENT
// ADMIN
// =========================================

router.post(
    "/",
    protect,
    authorizeRoles("admin"),
    createPayment
);


// =========================================
// GET MY PAYMENTS
// STUDENT
// =========================================

router.get(
    "/my",
    protect,
    authorizeRoles("student"),
    getMyPayments
);


// =========================================
// UPDATE PAYMENT STATUS
// ADMIN
// =========================================

router.patch(
    "/:id/status",
    protect,
    authorizeRoles("admin"),
    updatePaymentStatus
);


module.exports = router;