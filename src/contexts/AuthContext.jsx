import React, { createContext, useContext, useState, useEffect } from 'react';
import { TokenManager, UserManager, FRAuth, TokenStorage } from '@forgerock/javascript-sdk';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
    // Handle OAuth callback (implicit flow returns tokens in URL hash)
    handleCallback();
  }, []);

  const handleCallback = async () => {
    // Check if we're returning from OAuth (tokens in URL hash)
    if (window.location.hash) {
      try {
        // Parse tokens from URL hash
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        const idToken = params.get('id_token');
        
        if (accessToken && idToken) {
          // Store tokens
          TokenStorage.set({
            accessToken,
            idToken,
          });
          
          // Clean URL
          window.history.replaceState(null, '', window.location.pathname);
          
          // Get user info
          await checkAuth();
        }
      } catch (error) {
        console.error('Callback error:', error);
      }
    }
  };

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
      // Redirect to ForgeRock login with implicit flow
      await FRAuth.login({
        query: {
          response_type: 'id_token token',
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await FRAuth.logout();
      TokenStorage.remove();
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
