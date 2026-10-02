import api from "./api";


// =========================================
// GET MY PAYMENTS
// =========================================

const getMyPayments = async () => {

    const response = await api.get(
        "/payments/my"
    );

    return response.data;
};


// =========================================
// EXPORT
// =========================================

const paymentService = {
    getMyPayments
};

export default paymentService;