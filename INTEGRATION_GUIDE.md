# PingOne AIC OIDC Integration - Complete Documentation

## Overview
This document provides complete step-by-step instructions for integrating PingOne Advanced Identity Cloud (AIC) OIDC authentication with a React application using OAuth 2.0 Implicit Flow.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [PingOne AIC Configuration](#pingone-aic-configuration)
3. [Application Setup](#application-setup)
4. [Environment Variables](#environment-variables)
5. [Deployment to Vercel](#deployment-to-vercel)
6. [Known Issues & Solutions](#known-issues--solutions)
7. [Testing & Verification](#testing--verification)

---

## Prerequisites

- PingOne AIC tenant access
- Node.js 16+ installed
- Vercel account (for deployment)
- Git repository

---

## PingOne AIC Configuration

### 1. Create OAuth 2.0 Client

1. **Log in to PingOne AIC Admin Console**
   - Navigate to your realm (e.g., `alpha`)

2. **Create New OAuth 2.0 Client**
   - Go to **Applications** → **OAuth 2.0 Clients**
   - Click **+ Add Client**
   - Configure:
     - **Client ID**: `BT_B2B` (or your preferred ID)
     - **Client Type**: `Public` (for implicit flow)
     - **Grant Types**: Enable `Implicit`
     - **Response Types**: Enable `token` and `id_token`

3. **Configure Redirect URIs**
   - Add your application URLs:
     - Production: `https://your-app.vercel.app`
     - Local: `http://localhost:5173`
   - **Important**: URLs must match EXACTLY (no trailing slashes)

4. **Configure Scopes**
   - **IMPORTANT**: Enable ALL of the following scopes in your PingOne AIC OAuth client:
     - ✅ `openid` (required - always enabled)
     - ✅ `email` (for email address)
     - ✅ `profile` (for name, given_name, family_name, etc.)
     - ✅ `address` (for city, country, postal_code, etc.)
   
   **Note**: The application requests all these scopes by default. If any scope is not enabled in PingOne AIC, you will get an `invalid_scope` error during login.

5. **Save Configuration**

---

## Application Setup

### 1. Install Dependencies

```bash
npm install @forgerock/javascript-sdk react-router-dom
```

### 2. Project Structure

```
B2BCIAMDemo/
├── src/
│   ├── config.js                 # PingOne AIC configuration
│   ├── contexts/
│   │   └── AuthContext.jsx       # Authentication context
│   ├── pages/
│   │   ├── LandingPage.jsx       # Public landing page
│   │   └── Dashboard.jsx         # Protected dashboard
│   ├── components/
│   │   └── ProtectedRoute.jsx    # Route protection
│   ├── App.jsx                   # Main app with routing
│   └── main.jsx                  # Entry point
├── .env.example                  # Environment variable template
├── vercel.json                   # Vercel configuration
└── package.json
```

### 3. Key Implementation Files

#### `src/config.js`
```javascript
import { Config } from '@forgerock/javascript-sdk';

const domain = (import.meta.env.VITE_PINGONE_DOMAIN || 'your-tenant.forgeblocks.com').replace(/\/$/, '');

Config.set({
  serverConfig: {
    baseUrl: `https://${domain}`,
    timeout: 5000,
  },
  realmPath: import.meta.env.VITE_PINGONE_REALM || 'alpha',
  clientId: import.meta.env.VITE_PINGONE_CLIENT_ID || '',
  redirectUri: import.meta.env.VITE_PINGONE_REDIRECT_URI || window.location.origin,
  scope: 'openid email profile address', // All standard OIDC scopes
  oauthThreshold: 'implicit',
  tokenStore: 'sessionStorage',
});
```

#### `src/contexts/AuthContext.jsx`
- Handles OAuth redirect flow
- Parses tokens from URL hash
- Calls UserInfo endpoint for additional claims
- Manages authentication state

---

## Environment Variables

### Local Development (`.env`)

Create a `.env` file in the project root:

```env
VITE_PINGONE_DOMAIN=your-tenant.forgeblocks.com
VITE_PINGONE_CLIENT_ID=BT_B2B
VITE_PINGONE_REALM=alpha
VITE_PINGONE_REDIRECT_URI=http://localhost:5173
```

### Vercel Production

Configure in Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Value | Example |
|----------|-------|---------|
| `VITE_PINGONE_DOMAIN` | Your PingOne AIC domain | `openam-accenture-11-20.forgeblocks.com` |
| `VITE_PINGONE_CLIENT_ID` | OAuth client ID | `BT_B2B` |
| `VITE_PINGONE_REALM` | Realm name | `alpha` |
| `VITE_PINGONE_REDIRECT_URI` | Production URL | `https://your-app.vercel.app` |

**Important**: After adding/changing environment variables, redeploy the application.

---

## Deployment to Vercel

### 1. Create `vercel.json`

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This ensures React Router works correctly with client-side routing.

### 2. Deploy

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

### 3. Configure Environment Variables

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add all required variables (see above)
5. Redeploy the application

---

## Known Issues & Solutions

### Issue 1: Claims Not Appearing in Token

**Problem**: Email, name, city, or other user attributes not showing in the dashboard.

**Cause**: 
- Scopes not enabled in PingOne AIC OAuth client
- User profile doesn't have values for those attributes
- UserInfo endpoint not returning the claims

**Solution**:

1. **Enable Required Scopes in PingOne AIC**
   - Go to OAuth client settings
   - Enable scopes: `email`, `profile`, `address`
   - Save changes

2. **Verify User Profile Data**
   - Check that the user has values for email, name, city, etc.
   - Update user profile in PingOne AIC if needed

3. **Check Token Contents**
   - Open browser console
   - Look for `Full user data:` log
   - Expand to see all available claims

4. **Update Application Scopes**
   - Edit `src/config.js`
   - Add required scopes: `scope: 'openid email profile address'`
   - Redeploy application
   - Sign out and sign in again

**Current Status**: 
- ✅ Authentication working
- ✅ Email claim working (with `email` scope)
- ⚠️ City/address claims require `address` scope to be enabled in PingOne AIC
- ⚠️ Name claims require `profile` scope to be enabled in PingOne AIC

### Issue 2: Invalid Scope Error

**Problem**: `invalid_scope` error during login.

**Solution**: Only request scopes that are enabled in your PingOne AIC OAuth client. Start with `openid` only, then add scopes one at a time after enabling them in PingOne AIC.

### Issue 3: Redirect URI Mismatch

**Problem**: `redirect_uri_mismatch` error.

**Solution**: 
- Ensure redirect URI in code matches EXACTLY what's registered in PingOne AIC
- No trailing slashes
- Check both production and local URLs

### Issue 4: Double-Encoding of response_type

**Problem**: `response_type=token%2520id_token` causing 401 errors.

**Solution**: Use `+` instead of space in response_type:
```javascript
response_type=id_token+token
```

This is already implemented in the current code.

---

## Testing & Verification

### 1. Local Testing

```bash
npm run dev
```

- Visit `http://localhost:5173`
- Click "Sign In"
- Complete authentication
- Verify dashboard displays user information

### 2. Production Testing

1. Visit your Vercel URL
2. Click "Sign In"
3. Complete authentication
4. Check browser console for any errors
5. Verify user data displays correctly

### 3. Debugging

**Enable Console Logging**:
- Open browser DevTools (F12)
- Go to Console tab
- Look for these logs:
  - `PingOne AIC Config:` - Configuration loaded
  - `Redirecting to:` - OAuth URL being used
  - `User payload from ID token:` - ID token contents
  - `UserInfo response:` - UserInfo endpoint response
  - `Full user data:` - Merged user data

**Check Token Contents**:
- On dashboard, scroll to bottom
- Click "Token Details (Click to expand)"
- Review all available claims

---

## OAuth 2.0 Implicit Flow Sequence

```
1. User clicks "Sign In"
   ↓
2. App redirects to PingOne AIC authorize endpoint
   URL: /am/oauth2/realms/{realm}/authorize
   Params: client_id, response_type=id_token+token, scope, redirect_uri, nonce, state
   ↓
3. User authenticates in PingOne AIC
   ↓
4. PingOne AIC redirects back to app with tokens in URL hash
   Format: #access_token=...&id_token=...&token_type=Bearer&expires_in=3599
   ↓
5. App parses tokens from URL hash
   ↓
6. App calls UserInfo endpoint with access token
   URL: /am/oauth2/realms/{realm}/userinfo
   Header: Authorization: Bearer {access_token}
   ↓
7. App merges ID token + UserInfo data
   ↓
8. User is authenticated and dashboard displays profile
```

---

## Architecture Decisions

### Why Implicit Flow?
- Suitable for public clients (SPAs)
- No backend required
- Tokens delivered directly to browser
- **Note**: Consider Authorization Code Flow with PKCE for production

### Why ForgeRock JavaScript SDK?
- Official SDK for PingOne AIC
- Handles token management
- Provides configuration utilities

### Why UserInfo Endpoint?
- ID token may have limited claims
- UserInfo endpoint provides full user profile
- Allows dynamic claim retrieval based on scopes

---

## Security Considerations

1. **Token Storage**: Tokens stored in `sessionStorage` (cleared on tab close)
2. **HTTPS Required**: Always use HTTPS in production
3. **Redirect URI Validation**: Exact match required
4. **Token Expiration**: Access tokens expire in 3599 seconds (1 hour)
5. **No Client Secret**: Implicit flow doesn't use client secrets (public client)

---

## Troubleshooting Checklist

- [ ] Environment variables set correctly in Vercel
- [ ] Redirect URI matches exactly in PingOne AIC and code
- [ ] Required scopes enabled in PingOne AIC OAuth client
- [ ] User profile has values for requested claims
- [ ] Latest deployment is live (check Vercel dashboard)
- [ ] Browser cache cleared / using incognito mode
- [ ] Console shows no errors
- [ ] Token Details shows expected claims

---

## Support & Resources

- **PingOne AIC Documentation**: https://docs.pingidentity.com/pingoneaic/
- **ForgeRock JavaScript SDK**: https://github.com/ForgeRock/forgerock-javascript-sdk
- **OAuth 2.0 Implicit Flow**: https://oauth.net/2/grant-types/implicit/
- **OIDC Specification**: https://openid.net/specs/openid-connect-core-1_0.html

---

## Summary

✅ **Working**:
- OAuth 2.0 Implicit Flow authentication
- Token parsing and storage
- Protected routes
- User session management
- Email claim display (with `email` scope)

⚠️ **Requires Configuration**:
- Additional scopes (`profile`, `address`) must be enabled in PingOne AIC
- User profile must have values for requested attributes
- Claims appear based on enabled scopes and user data

---

**Last Updated**: April 30, 2026
**Integration Status**: ✅ Authentication Working | ⚠️ Claims Require Scope Configuration
