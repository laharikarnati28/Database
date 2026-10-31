import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const res = await authAPI.me();
          const profile = res?.data || res;
          if (profile && (profile.email || profile.userId)) {
            setUser(profile);
            localStorage.setItem('user', JSON.stringify(profile));
          }
        } catch (err) {
          console.warn('Session verification check:', err);
          // Only clear session if token is explicitly invalid or expired (401)
          if (err?.status === 401 || err?.response?.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    verifySession();
  }, []);

  const login = (authData) => {
    const { token: jwtToken, userId, name, email, role } = authData;
    const userData = { userId, name, email, role };
    setToken(jwtToken);
    setUser(userData);
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const role = user?.role || null;
  const isAdmin = role === 'ADMIN';
  const isTechnician = role === 'TECHNICIAN';
  const isCustomer = role === 'CUSTOMER';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        role,
        isAdmin,
        isTechnician,
        isCustomer,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

