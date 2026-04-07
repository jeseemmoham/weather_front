import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Verify token is still valid
          const res = await authAPI.getProfile();
          setUser(res.data.data.user);
          localStorage.setItem('user', JSON.stringify(res.data.data.user));
        } catch (err) {
          console.error('Token validation failed:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Register
  const register = useCallback(async (name, email, password, zipCode) => {
    try {
      setError(null);
      const res = await authAPI.register({ name, email, password, zipCode });
      const { user: userData, token } = res.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    }
  }, []);

  // Login
  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      const res = await authAPI.login({ email, password });
      const { user: userData, token } = res.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  }, []);

  // Update ZIP code
  const updateZipCode = useCallback(async (zipCode) => {
    try {
      setError(null);
      const res = await userAPI.updateZipCode(zipCode);
      const updatedUser = res.data.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update ZIP code';
      setError(message);
      return { success: false, message };
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (data) => {
    try {
      setError(null);
      const res = await userAPI.updateProfile(data);
      const updatedUser = res.data.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile';
      setError(message);
      return { success: false, message };
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateZipCode,
    updateProfile,
    clearError,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
