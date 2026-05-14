import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoadingAuth(false);
  }, []);

  const register = async ({ name, email, password }) => {
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      const registeredUser = response.data.user;
      const authToken = response.data.token;

      setUser(registeredUser);
      setToken(authToken);

      localStorage.setItem("user", JSON.stringify(registeredUser));
      localStorage.setItem("token", authToken);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Kayıt başarısız.",
      };
    }
  };

  const login = async ({ email, password }) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const loggedInUser = response.data.user;
      const authToken = response.data.token;

      setUser(loggedInUser);
      setToken(authToken);

      localStorage.setItem("user", JSON.stringify(loggedInUser));
      localStorage.setItem("token", authToken);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Giriş başarısız.",
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const isAuthenticated = Boolean(token);
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loadingAuth,
        isAuthenticated,
        isAdmin,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};