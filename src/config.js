// PingOne AIC / ForgeRock Configuration
import { Config } from '@forgerock/javascript-sdk';

// Initialize ForgeRock SDK for Implicit Flow
Config.set({
  serverConfig: {
    baseUrl: `https://${import.meta.env.VITE_PINGONE_DOMAIN || 'openam-accenture-11-20.forgeblocks.com'}`,
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

export const pingOneConfig = {
  domain: import.meta.env.VITE_PINGONE_DOMAIN || 'openam-accenture-11-20.forgeblocks.com',
  realm: import.meta.env.VITE_PINGONE_REALM || 'alpha',
  tree: import.meta.env.VITE_PINGONE_TREE || 'Login',
  clientId: import.meta.env.VITE_PINGONE_CLIENT_ID || '',
  redirectUri: import.meta.env.VITE_PINGONE_REDIRECT_URI || window.location.origin,
  scope: 'openid profile email',
  responseType: 'id_token token', // Implicit flow response type
};
