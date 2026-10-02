import api from "./api";


// =========================================
// GET MY NOTIFICATIONS
// =========================================

const getMyNotifications = async () => {

    const response = await api.get(
        "/notifications"
    );

    return response.data;
};


// =========================================
// MARK ONE NOTIFICATION AS READ
// =========================================

const markNotificationAsRead = async (
    notificationId
) => {

    const response = await api.patch(
        `/notifications/${notificationId}/read`
    );

    return response.data;
};


// =========================================
// MARK ALL NOTIFICATIONS AS READ
// =========================================

const markAllNotificationsAsRead = async () => {

    const response = await api.patch(
        "/notifications/read-all"
    );

    return response.data;
};


// =========================================
// EXPORT
// =========================================

const notificationService = {

    getMyNotifications,

    markNotificationAsRead,

    markAllNotificationsAsRead

};

export default notificationService;