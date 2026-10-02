const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// Any authenticated user
router.get("/profile", protect, (req, res) => {

    res.json({
        message: "You are authenticated!",
        user: req.user
    });

});


// Student only
router.get(
    "/student",
    protect,
    authorizeRoles("student"),
    (req, res) => {

        res.json({
            message: "Welcome Student!",
            user: req.user
        });

    }
);


// Warden only
router.get(
    "/warden",
    protect,
    authorizeRoles("warden"),
    (req, res) => {

        res.json({
            message: "Welcome Warden!",
            user: req.user
        });

    }
);


// Admin only
router.get(
    "/admin",
    protect,
    authorizeRoles("admin"),
    (req, res) => {

        res.json({
            message: "Welcome Admin!",
            user: req.user
        });

    }
);

module.exports = router;