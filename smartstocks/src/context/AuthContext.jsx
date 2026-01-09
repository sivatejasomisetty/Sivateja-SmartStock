//------------ New version----------------------
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios"; // ✅ use shared axios instance

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/api/me");
      setUser(res.data);
    } catch (err) {
      console.error("AUTH LOAD ERROR:", err);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    // ❌ DO NOT touch loading here
  };

  return (
    <AuthContext.Provider value={{ user, loading, loadUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
