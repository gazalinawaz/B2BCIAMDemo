# XYZ Broadband Service

A React application with PingOne Advanced Identity Cloud (AIC) OIDC authentication.

## Features

- ⚡ Ultra Fast - Up to 1 Gbps speeds
- 🛡️ Reliable - 99.9% uptime guarantee
- 💰 Affordable - Best value plans
- 🔐 Secure authentication with PingOne AIC
- 📊 Protected dashboard for authenticated users

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_PINGONE_DOMAIN=openam-accenture-11-20.forgeblocks.com
VITE_PINGONE_CLIENT_ID=your-client-id-here
VITE_PINGONE_REDIRECT_URI=http://localhost:5173
VITE_PINGONE_AUDIENCE=https://openam-accenture-11-20.forgeblocks.com/am/oauth2/access_token
```

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173

## Deployment to Vercel

### Environment Variables in Vercel

Add these in Vercel Dashboard → Project Settings → Environment Variables:

```
VITE_PINGONE_DOMAIN=openam-accenture-11-20.forgeblocks.com
VITE_PINGONE_CLIENT_ID=your-client-id
VITE_PINGONE_REDIRECT_URI=https://your-app.vercel.app
VITE_PINGONE_AUDIENCE=https://openam-accenture-11-20.forgeblocks.com/am/oauth2/access_token
```

**Important:** Update `VITE_PINGONE_REDIRECT_URI` with your actual Vercel URL.

### PingOne AIC Configuration

In your PingOne AIC OAuth client settings, add:

**Allowed Callback URLs:**
- `http://localhost:5173` (for development)
- `https://your-app.vercel.app` (for production)

**Allowed Logout URLs:**
- `http://localhost:5173`
- `https://your-app.vercel.app`

## Tech Stack

- React 18
- Vite
- React Router v6
- Auth0 React SDK (compatible with PingOne AIC)
- PingOne Advanced Identity Cloud (OIDC)

## Authentication Flow

1. User clicks "Login to Your Account"
2. Redirects to PingOne AIC login page
3. User authenticates
4. Redirects back to app with auth code
5. Auth0 SDK exchanges code for tokens
6. User accesses protected dashboard
