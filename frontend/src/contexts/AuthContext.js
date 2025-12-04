// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import AuthService from "../services/AuthService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Error parseando usuario en localStorage", e);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await AuthService.login(email, password);
    const loggedUser = data.user || data;

    setUser(loggedUser);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(loggedUser));

    return loggedUser;
  };

  const register = async (formData) => {
    const data = await AuthService.register(formData);
    // si el backend devuelve user, también lo guardamos
    if (data && data.user) {
      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    return data;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};