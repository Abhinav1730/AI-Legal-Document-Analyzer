"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { api, authToken } from "@/lib/api";

const AuthContext = createContext(null); // <-- give default value

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // <-- add loading

  const fetchUser = async () => {
    try {
      const res = await api.me();
      setUser(res.user || null);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    await api.logout();
    setUser(null);
    window.location.href = "/";
  };

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    setUser(res.user || null);
    return res;
  }

  const register = async (name, email, password) => {
    const res = await api.register({ name, email, password });
    setUser(res.user || null);
    return res;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading, login, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);