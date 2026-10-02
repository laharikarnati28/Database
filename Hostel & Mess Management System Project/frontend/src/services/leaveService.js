import api from "./api";


// =========================================
// GET MY LEAVE REQUESTS
// =========================================

const getMyLeaveRequests = async () => {

    const response = await api.get(
        "/leaves/my"
    );

    return response.data;
};


// =========================================
// CREATE LEAVE REQUEST
// =========================================

const createLeaveRequest = async (
    start_date,
    end_date,
    reason
) => {

    const response = await api.post(
        "/leaves",
        {
            start_date,
            end_date,
            reason
        }
    );

    return response.data;
};


// =========================================
// EXPORT
// =========================================

const leaveService = {
    getMyLeaveRequests,
    createLeaveRequest
};

export default leaveService;