const pool = require("../config/db");


// =========================================
// GET MY NOTIFICATIONS
// =========================================

const getMyNotifications = async (req, res) => {

    try {

        const userId = req.user.userId;

        const [notifications] =
            await pool.query(
                `
                SELECT
                    id,
                    title,
                    message,
                    is_read,
                    created_at
                FROM notifications
                WHERE user_id = ?
                ORDER BY created_at DESC
                `,
                [userId]
            );

        res.json({

            message:
                "Notifications retrieved successfully",

            notifications

        });

    } catch (error) {

        console.error(
            "Get notifications error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// MARK NOTIFICATION AS READ
// =========================================

const markNotificationAsRead = async (
    req,
    res
) => {

    try {

        const userId = req.user.userId;
        const notificationId = req.params.id;

        const [result] =
            await pool.query(
                `
                UPDATE notifications
                SET is_read = TRUE
                WHERE id = ?
                AND user_id = ?
                `,
                [
                    notificationId,
                    userId
                ]
            );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message:
                    "Notification not found"
            });
        }

        res.json({

            message:
                "Notification marked as read"

        });

    } catch (error) {

        console.error(
            "Mark notification read error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// MARK ALL NOTIFICATIONS AS READ
// =========================================

const markAllNotificationsAsRead = async (
    req,
    res
) => {

    try {

        const userId = req.user.userId;

        await pool.query(
            `
            UPDATE notifications
            SET is_read = TRUE
            WHERE user_id = ?
            AND is_read = FALSE
            `,
            [userId]
        );

        res.json({

            message:
                "All notifications marked as read"

        });

    } catch (error) {

        console.error(
            "Mark all notifications read error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// EXPORT
// =========================================

module.exports = {

    getMyNotifications,

    markNotificationAsRead,

    markAllNotificationsAsRead

};