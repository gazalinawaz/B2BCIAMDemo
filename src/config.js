// PingOne AIC / ForgeRock Configuration
import { Config } from '@forgerock/javascript-sdk';

// Get domain without trailing slash
const domain = (import.meta.env.VITE_PINGONE_DOMAIN || 'openam-accenture-11-20.forgeblocks.com').replace(/\/$/, '');

// Initialize ForgeRock SDK for Implicit Flow
Config.set({
  serverConfig: {
    baseUrl: `https://${domain}`,
    timeout: 5000,
  },
  realmPath: import.meta.env.VITE_PINGONE_REALM || 'alpha',
  tree: import.meta.env.VITE_PINGONE_TREE || 'Login',
  clientId: import.meta.env.VITE_PINGONE_CLIENT_ID || '',
  redirectUri: import.meta.env.VITE_PINGONE_REDIRECT_URI || window.location.origin,
  scope: 'openid profile email',
  // Implicit Flow Configuration
  oauthThreshold: 'implicit',
  tokenStore: 'sessionStorage',
});

// Log configuration for debugging (remove in production)
console.log('PingOne AIC Config:', {
  domain,
  clientId: import.meta.env.VITE_PINGONE_CLIENT_ID || 'NOT SET',
  realm: import.meta.env.VITE_PINGONE_REALM || 'alpha',
  redirectUri: import.meta.env.VITE_PINGONE_REDIRECT_URI || window.location.origin,
});

export const pingOneConfig = {
  domain: import.meta.env.VITE_PINGONE_DOMAIN || 'openam-accenture-11-20.forgeblocks.com',
  realm: import.meta.env.VITE_PINGONE_REALM || 'alpha',
  tree: import.meta.env.VITE_PINGONE_TREE || 'Login',
  clientId: import.meta.env.VITE_PINGONE_CLIENT_ID || '',
  redirectUri: import.meta.env.VITE_PINGONE_REDIRECT_URI || window.location.origin,
  scope: 'openid profile email',
  responseType: 'id_token token', // Implicit flow response type
};
