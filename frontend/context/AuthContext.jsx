"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, authToken } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(null);

  // Session timeout duration: 10 minutes
  const SESSION_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

  // Save user data to localStorage
  const saveUserToStorage = (userData) => {
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('sessionStart', Date.now().toString());
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('sessionStart');
      localStorage.removeItem('authToken');
    }
  };

  // Load user data from localStorage
  const loadUserFromStorage = () => {
    try {
      const storedUser = localStorage.getItem('user');
      const sessionStart = localStorage.getItem('sessionStart');
      const storedToken = localStorage.getItem('authToken');
      
      if (storedUser && sessionStart && storedToken) {
        const sessionAge = Date.now() - parseInt(sessionStart);
        if (sessionAge < SESSION_DURATION) {
          // Restore the token
          authToken.set(storedToken);
          return JSON.parse(storedUser);
        } else {
          // Session expired, clear storage
          localStorage.removeItem('user');
          localStorage.removeItem('sessionStart');
          localStorage.removeItem('authToken');
          authToken.clear();
        }
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('sessionStart');
      localStorage.removeItem('authToken');
      authToken.clear();
    }
    return null;
  };

  // Reset session timeout
  const resetSessionTimeout = useCallback(() => {
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
    }
    
    const timeout = setTimeout(() => {
      console.log('Session expired due to inactivity');
      logout();
    }, SESSION_DURATION);
    
    setSessionTimeout(timeout);
  }, [sessionTimeout]);

  // Activity detection
  useEffect(() => {
    const handleActivity = () => {
      if (user) {
        resetSessionTimeout();
      }
    };

    // Listen for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [user, resetSessionTimeout]);

  const fetchUser = async () => {
    try {
      // First try to load from localStorage
      const storedUser = loadUserFromStorage();
      if (storedUser) {
        setUser(storedUser);
        setLoading(false);
        resetSessionTimeout();
        return;
      }

      // Always try to fetch from server (handles both JWT and Google OAuth sessions)
      const res = await api.me();
      const userData = res.user || null;
      setUser(userData);
      saveUserToStorage(userData);
      
      if (userData) {
        resetSessionTimeout();
      }
    } catch (error) {
      console.log('Auth check failed:', error.message);
      // Only clear token if it's a JWT-related error
      if (error.message.includes('Invalid token') || error.message.includes('401')) {
        authToken.clear();
        localStorage.removeItem('authToken');
      }
      setUser(null);
      saveUserToStorage(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      saveUserToStorage(null);
      authToken.clear();
      
      // Clear all auth-related localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('sessionStart');
      localStorage.removeItem('authToken');
      
      if (sessionTimeout) {
        clearTimeout(sessionTimeout);
        setSessionTimeout(null);
      }
      window.location.href = "/";
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.login({ email, password });
      const userData = res.user || null;
      setUser(userData);
      saveUserToStorage(userData);
      
      // Save token to localStorage
      if (res.token) {
        localStorage.setItem('authToken', res.token);
      }
      
      if (userData) {
        resetSessionTimeout();
      }
      
      return res;
    } catch (error) {
      console.error('Login error:', error);
      // Provide more specific error messages
      if (error.message.includes('Invalid credentials') || error.message.includes('401')) {
        throw new Error('Invalid email or password');
      } else if (error.message.includes('Network error')) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      } else {
        throw new Error(error.message || 'Login failed. Please try again.');
      }
    }
  }

  const register = async (name, email, password) => {
    try {
      const res = await api.register({ name, email, password });
      const userData = res.user || null;
      setUser(userData);
      saveUserToStorage(userData);
      
      // Save token to localStorage
      if (res.token) {
        localStorage.setItem('authToken', res.token);
      }
      
      if (userData) {
        resetSessionTimeout();
      }
      
      return res;
    } catch (error) {
      console.error('Registration error:', error);
      // Provide more specific error messages
      if (error.message.includes('Email already in use') || error.message.includes('409')) {
        throw new Error('Email already in use. Please try logging in instead.');
      } else if (error.message.includes('Network error')) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      } else {
        throw new Error(error.message || 'Registration failed. Please try again.');
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading, login, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);