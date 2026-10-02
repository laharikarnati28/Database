import api from "./api";


// =========================================
// GET MESS MENU
// =========================================

const getMenu = async () => {

    const response = await api.get(
        "/mess/menu"
    );

    return response.data;
};


// =========================================
// GET MY MESS ATTENDANCE
// =========================================

const getMyAttendance = async () => {

    const response = await api.get(
        "/mess/attendance/my"
    );

    return response.data;
};


// =========================================
// EXPORT
// =========================================

const messService = {
    getMenu,
    getMyAttendance
};

export default messService;