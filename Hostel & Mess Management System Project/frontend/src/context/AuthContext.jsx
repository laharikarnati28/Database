import { createContext, useContext, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(
        authService.getUser()
    );

    const login = async (email, password) => {
        const data = await authService.login(
            email,
            password
        );

        setUser(data.user);

        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
        isLoggedIn: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};