import { useEffect, useState } from "react";

import notificationService from "../services/notificationService";

const Notifications = () => {

    const [notifications, setNotifications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =========================================
    // FETCH NOTIFICATIONS
    // =========================================

    const fetchNotifications = async () => {

        try {

            const data =
                await notificationService
                    .getMyNotifications();

            setNotifications(
                data.notifications || []
            );

        } catch (error) {

            console.error(
                "Failed to fetch notifications:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load notifications"
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        fetchNotifications();

    }, []);


    // =========================================
    // MARK ONE AS READ
    // =========================================

    const handleMarkAsRead = async (
        notificationId
    ) => {

        try {

            await notificationService
                .markNotificationAsRead(
                    notificationId
                );

            setNotifications(
                (currentNotifications) =>
                    currentNotifications.map(
                        (notification) =>
                            notification.id ===
                            notificationId
                                ? {
                                    ...notification,
                                    is_read: 1
                                }
                                : notification
                    )
            );

        } catch (error) {

            console.error(
                "Failed to mark notification as read:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to update notification"
            );
        }
    };


    // =========================================
    // MARK ALL AS READ
    // =========================================

    const handleMarkAllAsRead = async () => {

        try {

            await notificationService
                .markAllNotificationsAsRead();

            setNotifications(
                (currentNotifications) =>
                    currentNotifications.map(
                        (notification) => ({
                            ...notification,
                            is_read: 1
                        })
                    )
            );

        } catch (error) {

            console.error(
                "Failed to mark all notifications as read:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to update notifications"
            );
        }
    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (
            <section className="dashboard-section">

                <h2>
                    Notifications
                </h2>

                <p>
                    Loading notifications...
                </p>

            </section>
        );
    }


    // =========================================
    // NOTIFICATION COUNT
    // =========================================

    const unreadCount =
        notifications.filter(
            (notification) =>
                Number(notification.is_read) === 0
        ).length;


    // =========================================
    // UI
    // =========================================

    return (
        <section className="dashboard-section">

            <div className="notifications-header">

                <div>

                    <h2>
                        Notifications
                    </h2>

                    <p>
                        You have {unreadCount} unread
                        notification
                        {unreadCount !== 1 ? "s" : ""}.
                    </p>

                </div>


                {unreadCount > 0 && (

                    <button
                        className="primary-button notification-button"
                        onClick={
                            handleMarkAllAsRead
                        }
                    >
                        Mark All as Read
                    </button>

                )}

            </div>


            {error && (

                <div className="login-error">
                    {error}
                </div>

            )}


            {notifications.length === 0 ? (

                <p>
                    No notifications yet.
                </p>

            ) : (

                <div className="notifications-list">

                    {notifications.map(
                        (notification) => (

                            <div
                                key={
                                    notification.id
                                }
                                className={
                                    Number(
                                        notification.is_read
                                    ) === 0
                                        ? "notification-item unread"
                                        : "notification-item"
                                }
                            >

                                <div className="notification-content">

                                    <h3>
                                        {
                                            notification.title
                                        }
                                    </h3>

                                    <p>
                                        {
                                            notification.message
                                        }
                                    </p>

                                    <small>
                                        {
                                            new Date(
                                                notification.created_at
                                            ).toLocaleString()
                                        }
                                    </small>

                                </div>


                                {
                                    Number(
                                        notification.is_read
                                    ) === 0 && (

                                        <button
                                            className="notification-read-button"
                                            onClick={() =>
                                                handleMarkAsRead(
                                                    notification.id
                                                )
                                            }
                                        >
                                            Mark as Read
                                        </button>

                                    )
                                }

                            </div>

                        )
                    )}

                </div>

            )}

        </section>
    );
};

export default Notifications;