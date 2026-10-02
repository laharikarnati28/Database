import api from "./api";

const login = async (email, password) => {
    const response = await api.post("/auth/login", {
        email,
        password
    });

    const { token, user } = response.data;

    // Store login information in the browser
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return response.data;
};

const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

const getToken = () => {
    return localStorage.getItem("token");
};

const getUser = () => {
    const user = localStorage.getItem("user");

    if (!user) {
        return null;
    }

    return JSON.parse(user);
};

const isLoggedIn = () => {
    return !!getToken();
};

const authService = {
    login,
    logout,
    getToken,
    getUser,
    isLoggedIn
};

export default authService;