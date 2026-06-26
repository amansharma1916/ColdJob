import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCurrentUser, logout as logoutApi } from '@/api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('cc_token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await getCurrentUser();
        const user = response.data?.data?.user || response.data;
        setUser(user);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('cc_token');
        localStorage.removeItem('cc_user');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback((userData, token) => {
    localStorage.setItem('cc_token', token);
    localStorage.setItem('cc_user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // Proceed with local logout even if API fails
    } finally {
      localStorage.removeItem('cc_token');
      localStorage.removeItem('cc_user');
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}