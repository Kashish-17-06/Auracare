import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { MOCK_MODE } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('auracare_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, password) => {
    if (MOCK_MODE) {
      const mockUser = { name: 'Demo User', email, token: 'mock-token' };
      setUser(mockUser);
      localStorage.setItem('auracare_user', JSON.stringify(mockUser));
      return { success: true };
    }
    try {
      const response = await api.post('/auth/login', { email, password });
      setUser(response.data);
      localStorage.setItem('auracare_user', JSON.stringify(response.data));
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const signup = async (name, email, password) => {
    if (MOCK_MODE) {
      const mockUser = { name, email, token: 'mock-token' };
      setUser(mockUser);
      localStorage.setItem('auracare_user', JSON.stringify(mockUser));
      return { success: true };
    }
    try {
      const response = await api.post('/auth/signup', { name, email, password });
      setUser(response.data);
      localStorage.setItem('auracare_user', JSON.stringify(response.data));
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: error.response?.data?.message || 'Signup failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auracare_user');
  };

  const updateProfile = (data) => {
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('auracare_user', JSON.stringify(updated));
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
