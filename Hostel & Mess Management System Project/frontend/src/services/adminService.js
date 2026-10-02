import api from "./api";


// =========================================
// ADMIN DASHBOARD
// =========================================

const getDashboardSummary = async () => {

    const response = await api.get(
        "/admin/dashboard"
    );

    return response.data;
};


// =========================================
// STUDENTS
// =========================================

const getAllStudents = async () => {

    const response = await api.get(
        "/admin/students"
    );

    return response.data;
};


// =========================================
// WARDENS
// =========================================

const getAllWardens = async () => {

    const response = await api.get(
        "/admin/wardens"
    );

    return response.data;
};


const createWarden = async (
    name,
    email,
    password,
    employee_id
) => {

    const response = await api.post(
        "/admin/wardens",
        {
            name,
            email,
            password,
            employee_id
        }
    );

    return response.data;
};


// =========================================
// HOSTELS
// =========================================

const getAllHostels = async () => {

    const response = await api.get(
        "/hostels"
    );

    return response.data;
};


const createHostel = async (
    name,
    location
) => {

    const response = await api.post(
        "/hostels",
        {
            name,
            location
        }
    );

    return response.data;
};


// =========================================
// ROOMS
// =========================================

const getAllRooms = async () => {

    const response = await api.get(
        "/hostels/rooms"
    );

    return response.data;
};


const createRoom = async (
    hostel_id,
    room_number,
    capacity
) => {

    const response = await api.post(
        "/hostels/rooms",
        {
            hostel_id,
            room_number,
            capacity
        }
    );

    return response.data;
};


// =========================================
// MESS MENU
// =========================================

const getMenu = async () => {

    const response = await api.get(
        "/mess/menu"
    );

    return response.data;
};


const createMenu = async (
    menu_date,
    meal_type,
    food_items
) => {

    const response = await api.post(
        "/mess/menu",
        {
            menu_date,
            meal_type,
            food_items
        }
    );

    return response.data;
};


// =========================================
// PAYMENTS
// =========================================

const getAllPayments = async () => {

    const response = await api.get(
        "/admin/payments"
    );

    return response.data;
};


const createPayment = async (
    student_id,
    amount,
    payment_type
) => {

    const response = await api.post(
        "/payments",
        {
            student_id,
            amount,
            payment_type
        }
    );

    return response.data;
};


const updatePaymentStatus = async (
    paymentId,
    status
) => {

    const response = await api.patch(
        `/payments/${paymentId}/status`,
        {
            status
        }
    );

    return response.data;
};


// =========================================
// REPORTS
// =========================================

const getReports = async () => {

    const response = await api.get(
        "/admin/reports"
    );

    return response.data;
};


// =========================================
// EXPORT
// =========================================

const adminService = {

    getDashboardSummary,

    getAllStudents,

    getAllWardens,
    createWarden,

    getAllHostels,
    createHostel,

    getAllRooms,
    createRoom,

    getMenu,
    createMenu,

    getAllPayments,
    createPayment,
    updatePaymentStatus,

    getReports
};

export default adminService;