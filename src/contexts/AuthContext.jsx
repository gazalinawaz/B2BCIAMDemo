import React, { createContext, useContext, useState, useEffect } from 'react';
import { TokenManager, UserManager, TokenStorage, Config } from '@forgerock/javascript-sdk';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Handle OAuth callback and check authentication status on mount
    handleCallback();
    checkAuth();
  }, []);

  /**
   * Handle OAuth callback from PingOne AIC
   */
  const handleCallback = async () => {
    // Check if we're returning from OAuth (tokens in URL hash)
    if (window.location.hash) {
      try {
        // Parse tokens from URL hash
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        const idToken = params.get('id_token');
        const error = params.get('error');
        
        if (error) {
          console.error('OAuth error:', error);
          return;
        }
        
        if (accessToken && idToken) {
          // Store tokens in sessionStorage
          sessionStorage.setItem('accessToken', accessToken);
          sessionStorage.setItem('idToken', idToken);
          
          // Clear hash from URL and redirect to dashboard
          window.history.replaceState(null, '', '/dashboard');
          window.location.href = '/dashboard';
          
          // Get user info
          await checkAuth();
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
      }
    }
  };

  /**
   * Check authentication status and fetch user info
   */
  const checkAuth = async () => {
    try {
      const accessToken = sessionStorage.getItem('accessToken');
      const idToken = sessionStorage.getItem('idToken');
      
      if (accessToken && idToken) {
        // Decode ID token to get basic user info
        const payload = JSON.parse(atob(idToken.split('.')[1]));
        
        // Decode access token to get groups (critical for plan-based authorization)
        let accessTokenPayload = {};
        try {
          accessTokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
        } catch (err) {
          console.warn('Could not decode access token:', err);
        }
        
        // Set basic user data immediately to show UI faster (optimized for page refresh)
        const basicUser = { 
          ...payload, 
          groups: accessTokenPayload.groups || payload.groups 
        };
        setUser(basicUser);
        setIsAuthenticated(true);
        setIsLoading(false);
        
        // Fetch additional user info from UserInfo endpoint in background
        try {
          const config = Config.get();
          const baseUrl = config.serverConfig.baseUrl.replace(/\/$/, '');
          const userInfoUrl = `${baseUrl}/am/oauth2/realms/${config.realmPath}/userinfo`;
          
          const response = await fetch(userInfoUrl, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          
          if (response.ok) {
            const userInfo = await response.json();
            // Merge all user data sources (ID token + access token groups + UserInfo)
            const fullUser = { 
              ...payload, 
              ...userInfo,
              groups: accessTokenPayload.groups || userInfo.groups || payload.groups
            };
            setUser(fullUser);
          }
        } catch (userInfoError) {
          // UserInfo fetch failed, but we already have basic user data from tokens
          console.error('UserInfo fetch failed:', userInfoError);
        }
      } else {
        // No tokens found - user is not authenticated
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const login = () => {
    try {
      const config = Config.get();
      
      // Validate required config
      if (!config.clientId) {
        throw new Error('OAuth client ID is not configured');
      }
      
      // Build OAuth authorization URL for Implicit Flow
      const baseUrl = config.serverConfig.baseUrl.replace(/\/$/, '');
      const redirectUri = encodeURIComponent(config.redirectUri);
      const clientId = encodeURIComponent(config.clientId);
      const scope = encodeURIComponent(config.scope);
      const nonce = Math.random().toString(36).substring(2);
      const state = Math.random().toString(36).substring(2);
      
      const authUrl = `${baseUrl}/am/oauth2/realms/${config.realmPath}/authorize?` +
        `client_id=${clientId}&` +
        `redirect_uri=${redirectUri}&` +
        `response_type=id_token%20token&` +
        `scope=${scope}&` +
        `nonce=${nonce}&` +
        `state=${state}`;
      
      // Redirect to PingOne AIC login
      window.location.href = authUrl;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear tokens first
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('idToken');
    
    // Redirect immediately - this will reload the page
    // No need to update state since page is reloading
    window.location.replace('/');
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
