import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // No automatic retrieval from localStorage

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:4000/api/login', { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    // We can still store it, but we won't load it on start as per "strictly on login"
    localStorage.setItem('token', res.data.token);
  };

  const register = async (userData) => {
    await axios.post('http://localhost:4000/api/register', userData);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
