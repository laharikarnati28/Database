import api from "./api";


// =========================================
// GET MY COMPLAINTS
// =========================================

const getMyComplaints = async () => {

    const response = await api.get(
        "/complaints/my"
    );

    return response.data;
};


// =========================================
// CREATE COMPLAINT
// =========================================

const createComplaint = async (
    category,
    description
) => {

    const response = await api.post(
        "/complaints",
        {
            category,
            description
        }
    );

    return response.data;
};


// =========================================
// EXPORT
// =========================================

const complaintService = {
    getMyComplaints,
    createComplaint
};

export default complaintService;