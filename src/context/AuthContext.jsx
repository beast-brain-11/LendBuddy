import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState(null);

    // Set auth token in axios headers
    if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
    } else {
        delete axios.defaults.headers.common['x-auth-token'];
    }

    // Load user if token exists
    useEffect(() => {
        const loadUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get('/api/users/me');
                setUser(res.data);
                setUserRole(res.data.role);
                setIsAuthenticated(true);
            } catch (err) {
                console.error('Error loading user:', err.response?.data || err.message);
                localStorage.removeItem('token');
                setToken(null);
                setIsAuthenticated(false);
                setUser(null);
                setUserRole(null);
            }
            setLoading(false);
        };

        loadUser();
    }, [token]);

    // Register user
    const register = async (formData) => {
        try {
            setError(null);
            const res = await axios.post('/api/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            setUserRole(res.data.role || formData.role);
            setIsAuthenticated(true);
            return true;
        } catch (err) {
            setError(err.response?.data?.errors?.[0]?.msg || 'Registration failed');
            return false;
        }
    };

    // Login user
    const login = async (email, password) => {
        try {
            setError(null);
            const res = await axios.post('/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            setUserRole(res.data.role);
            setIsAuthenticated(true);
            return true;
        } catch (err) {
            setError(err.response?.data?.errors?.[0]?.msg || 'Invalid credentials');
            return false;
        }
    };

    // Logout user
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    // Update user profile
    const updateProfile = async (formData) => {
        try {
            setError(null);
            const res = await axios.put('/api/users/profile', formData);
            setUser(res.data);
            return true;
        } catch (err) {
            setError(err.response?.data?.errors?.[0]?.msg || 'Failed to update profile');
            return false;
        }
    };

    // Guest login
    const guestLogin = async () => {
        try {
            setError(null);
            const res = await axios.post('/api/auth/guest');
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            return true;
        } catch (err) {
            setError(err.response?.data?.errors?.[0]?.msg || 'Guest login failed');
            return false;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                isAuthenticated,
                loading,
                user,
                error,
                userRole,
                register,
                login,
                logout,
                updateProfile,
                guestLogin
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};