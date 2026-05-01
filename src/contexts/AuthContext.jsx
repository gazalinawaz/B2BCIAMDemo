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
    console.log('Checking for OAuth callback...');
    console.log('Current URL hash:', window.location.hash);
    
    if (window.location.hash) {
      try {
        // Parse tokens from URL hash
        const hash = window.location.hash.substring(1);
        console.log('Hash content:', hash);
        
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        const idToken = params.get('id_token');
        const error = params.get('error');
        const errorDescription = params.get('error_description');
        
        if (error) {
          console.error('OAuth error:', error, errorDescription);
          alert(`Login failed: ${errorDescription || error}`);
          return;
        }
        
        console.log('Access token present:', !!accessToken);
        console.log('ID token present:', !!idToken);
        
        if (accessToken && idToken) {
          console.log('Storing tokens...');
          // Store tokens in sessionStorage
          sessionStorage.setItem('accessToken', accessToken);
          sessionStorage.setItem('idToken', idToken);
          
          console.log('Tokens stored successfully');
          
          // Clear hash from URL and redirect to dashboard
          window.history.replaceState(null, '', '/dashboard');
          window.location.href = '/dashboard';
          
          // Get user info
          await checkAuth();
        } else {
          console.warn('Missing tokens in callback. Access token:', !!accessToken, 'ID token:', !!idToken);
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
      
      console.log('Checking auth - Access token:', !!accessToken, 'ID token:', !!idToken);
      
      if (accessToken && idToken) {
        // Decode ID token to get basic user info
        const payload = JSON.parse(atob(idToken.split('.')[1]));
        console.log('User payload from ID token:', payload);
        
        // Decode access token to get groups
        let accessTokenPayload = {};
        try {
          accessTokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
          console.log('Access token payload:', accessTokenPayload);
        } catch (err) {
          console.warn('Could not decode access token:', err);
        }
        
        // Set basic user data immediately to show UI faster
        const basicUser = { 
          ...payload, 
          groups: accessTokenPayload.groups || payload.groups 
        };
        setUser(basicUser);
        setIsAuthenticated(true);
        setIsLoading(false); // Set loading false immediately
        
        // Fetch additional user info from UserInfo endpoint in background
        try {
          const config = Config.get();
          const baseUrl = config.serverConfig.baseUrl.replace(/\/$/, '');
          const userInfoUrl = `${baseUrl}/am/oauth2/realms/${config.realmPath}/userinfo`;
          
          console.log('Fetching user info from:', userInfoUrl);
          
          const response = await fetch(userInfoUrl, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          
          if (response.ok) {
            const userInfo = await response.json();
            console.log('UserInfo response:', userInfo);
            // Merge ID token, access token (for groups), and UserInfo data
            const fullUser = { 
              ...payload, 
              ...userInfo,
              // Get groups from access token
              groups: accessTokenPayload.groups || userInfo.groups || payload.groups
            };
            console.log('Full user data with groups:', fullUser);
            setUser(fullUser);
          }
        } catch (userInfoError) {
          console.error('Error fetching UserInfo:', userInfoError);
          // Already have basic user data, so this is fine
        }
      } else {
        console.log('No tokens found in sessionStorage');
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
        console.error('Client ID is not configured. Please set VITE_PINGONE_CLIENT_ID environment variable.');
        alert('Configuration error: Client ID is missing. Please contact support.');
        return;
      }
      
      console.log('OAuth Config - Scopes being requested:', config.scope);
      
      // Build OAuth URL (ensure no double slashes)
      const baseUrl = config.serverConfig.baseUrl.replace(/\/$/, ''); // Remove trailing slash
      const state = Math.random().toString(36).substring(7);
      const nonce = Math.random().toString(36).substring(7);
      
      // Manually construct URL to avoid double-encoding of response_type
      // Using + instead of space to prevent encoding issues
      const authUrl = `${baseUrl}/am/oauth2/realms/${config.realmPath}/authorize?` +
        `client_id=${encodeURIComponent(config.clientId)}&` +
        `response_type=id_token+token&` +
        `scope=${encodeURIComponent(config.scope)}&` +
        `redirect_uri=${encodeURIComponent(config.redirectUri)}&` +
        `nonce=${nonce}&` +
        `state=${state}`;
      
      console.log('OAuth URL scopes:', config.scope);
      console.log('Redirecting to:', authUrl);
      
      // Redirect to PingOne AIC login
      window.location.href = authUrl;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear state immediately
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(true); // Show loading to prevent flash
    
    // Clear tokens
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('idToken');
    
    // Redirect immediately
    window.location.href = '/';
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
