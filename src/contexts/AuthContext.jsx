import React, { createContext, useContext, useState, useEffect } from 'react';
import { TokenManager, UserManager, FRAuth } from '@forgerock/javascript-sdk';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const tokens = await TokenManager.getTokens();
      if (tokens && tokens.accessToken) {
        const userInfo = await UserManager.getCurrentUser();
        setUser(userInfo);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log('Not authenticated');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      // Redirect to ForgeRock login
      await FRAuth.login();
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await FRAuth.logout();
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
