import api from "./api";


// =========================================
// GET STUDENT PROFILE
// =========================================

const getProfile = async () => {

    const response = await api.get(
        "/students/profile"
    );

    return response.data;
};


// =========================================
// EXPORT
// =========================================

const studentService = {
    getProfile
};

export default studentService;