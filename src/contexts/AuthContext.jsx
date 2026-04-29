import React, { createContext, useContext, useState, useEffect } from 'react';
import { TokenManager, UserManager, TokenStorage, Config } from '@forgerock/javascript-sdk';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    handleCallback();
    checkAuth();
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
          // Store tokens in sessionStorage
          sessionStorage.setItem('accessToken', accessToken);
          sessionStorage.setItem('idToken', idToken);
          
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
      const accessToken = sessionStorage.getItem('accessToken');
      const idToken = sessionStorage.getItem('idToken');
      
      if (accessToken && idToken) {
        // Decode ID token to get user info (simple base64 decode)
        const payload = JSON.parse(atob(idToken.split('.')[1]));
        setUser(payload);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log('Not authenticated', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    try {
      const config = Config.get();
      
      // Validate required config
      if (!config.clientId) {
        console.error('Client ID is not configured. Please set VITE_PINGONE_CLIENT_ID environment variable.');
        alert('Configuration error: Client ID is missing. Please contact support.');
        return;
      }
      
      // Build OAuth URL (ensure no double slashes)
      const baseUrl = config.serverConfig.baseUrl.replace(/\/$/, ''); // Remove trailing slash
      // PingOne AIC uses /am/oauth2/realms/{realm}/authorize
      const authUrl = new URL(`${baseUrl}/am/oauth2/realms/${config.realmPath}/authorize`);
      
      authUrl.searchParams.set('client_id', config.clientId);
      authUrl.searchParams.set('response_type', 'id_token token');
      authUrl.searchParams.set('scope', config.scope);
      authUrl.searchParams.set('redirect_uri', config.redirectUri);
      authUrl.searchParams.set('nonce', Math.random().toString(36).substring(7));
      authUrl.searchParams.set('state', Math.random().toString(36).substring(7));
      
      console.log('Redirecting to:', authUrl.toString());
      
      // Redirect to PingOne AIC login
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      const config = Config.get();
      
      // Clear tokens
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('idToken');
      setUser(null);
      setIsAuthenticated(false);
      
      // Redirect to PingOne AIC logout
      const idToken = sessionStorage.getItem('idToken');
      const logoutUrl = `${config.serverConfig.baseUrl}/am/oauth2/realms/${config.realmPath}/connect/endSession?id_token_hint=${idToken}&post_logout_redirect_uri=${config.redirectUri}`;
      window.location.href = logoutUrl;
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: just clear and redirect
      sessionStorage.clear();
      window.location.href = '/';
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
