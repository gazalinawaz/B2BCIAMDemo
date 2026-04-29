// PingOne AIC Configuration
export const pingOneConfig = {
  domain: import.meta.env.VITE_PINGONE_DOMAIN || 'openam-accenture-11-20.forgeblocks.com',
  clientId: import.meta.env.VITE_PINGONE_CLIENT_ID || '',
  authorizationParams: {
    redirect_uri: import.meta.env.VITE_PINGONE_REDIRECT_URI || window.location.origin,
    audience: import.meta.env.VITE_PINGONE_AUDIENCE || '',
  },
};
