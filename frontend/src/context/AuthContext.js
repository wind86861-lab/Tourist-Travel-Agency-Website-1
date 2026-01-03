import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Check token validity on mount
    useEffect(() => {
        const verifyToken = async () => {
            if (token) {
                try {
                    const userData = await authAPI.getProfile();
                    setUser(userData);
                } catch (error) {
                    console.error('Token invalid:', error);
                    logout();
                }
            }
            setLoading(false);
        };
        verifyToken();
    }, [token]);

    const login = async (email, password) => {
        const data = await authAPI.login({ email, password });
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const isAdmin = () => {
        return user?.role === 'admin';
    };

    const isAuthenticated = () => {
        return !!token && !!user;
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        isAdmin,
        isAuthenticated
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
