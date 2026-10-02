import api from "./api";


// =========================================
// WARDEN DASHBOARD
// =========================================

const getDashboardSummary = async () => {

    const response = await api.get(
        "/warden/dashboard"
    );

    return response.data;
};


// =========================================
// STUDENTS
// =========================================

const getAllStudents = async () => {

    const response = await api.get(
        "/warden/students"
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


// =========================================
// ROOM ALLOCATIONS
// =========================================

const getAllAllocations = async () => {

    const response = await api.get(
        "/room-allocations"
    );

    return response.data;
};


// =========================================
// COMPLAINTS
// =========================================

const getAllComplaints = async () => {

    const response = await api.get(
        "/complaints"
    );

    return response.data;
};


const updateComplaintStatus = async (
    complaintId,
    status
) => {

    const response = await api.patch(
        `/complaints/${complaintId}/status`,
        {
            status
        }
    );

    return response.data;
};


// =========================================
// LEAVE REQUESTS
// =========================================

const getAllLeaveRequests = async () => {

    const response = await api.get(
        "/leaves"
    );

    return response.data;
};


const updateLeaveStatus = async (
    leaveId,
    status
) => {

    const response = await api.patch(
        `/leaves/${leaveId}/status`,
        {
            status
        }
    );

    return response.data;
};


// =========================================
// EXPORT
// =========================================

const wardenService = {

    getDashboardSummary,

    getAllStudents,

    getAllRooms,

    getAllAllocations,

    getAllComplaints,
    updateComplaintStatus,

    getAllLeaveRequests,
    updateLeaveStatus
};

export default wardenService;