import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = useCallback(async () => {
    const currentToken = localStorage.getItem('token');
    if (currentToken) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
      try {
        const response = await apiClient.get('/users/me');
        setUser(response.data);
      } catch (error) {
        console.error("Token invalid, logging out", error);
        logout(); 
      }
    }
  }, [navigate]); // navigate dependency is implicitly used via logout

  useEffect(() => {
    const loadApp = async () => {
      setLoading(true);
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        await fetchUser(); 
      }
      setLoading(false); 
    }
    loadApp();
  }, [fetchUser]);

  const login = async (email, password) => {
    try {
      const formBody = new URLSearchParams();
      formBody.append('username', email);
      formBody.append('password', password);

      // --- THIS IS THE FIX ---
      // We must explicitly set the Content-Type header
      const response = await apiClient.post(
        '/auth/token', 
        formBody,
        { 
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded' 
          }
        }
      );
      // --- END FIX ---
      
      const { access_token } = response.data;
      
      localStorage.setItem('token', access_token);
      setToken(access_token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      await fetchUser(); 
      
      toast.success("Logged in successfully!");
      navigate('/app/dashboard');
      
    } catch (error) {
      console.error("Login failed:", error);
      
      // This logic safely extracts the error message
      let errorMessage = "Login failed. Please check credentials.";
      if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === 'string') {
          errorMessage = error.response.data.detail;
        } else if (Array.isArray(error.response.data.detail) && error.response.data.detail[0]?.msg) {
          errorMessage = error.response.data.detail[0].msg;
        }
      }
      toast.error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete apiClient.defaults.headers.common['Authorization'];
    if(navigate) { 
      navigate('/login');
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    fetchUser, 
    loading,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};