import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, loginUser } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (payload) => {
    const data = await loginUser(payload);
    localStorage.setItem("access_token", data.access_token);
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    return currentUser;
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setUser(null);
        return;
      }
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      localStorage.removeItem("access_token");
      setUser(null);
    }
  };

  useEffect(() => {
    const init = async () => {
      await refreshUser();
      setLoading(false);
    };
    init();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);