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
VITE_PINGONE_REALM=alpha
VITE_PINGONE_TREE=Login
VITE_PINGONE_CLIENT_ID=your-client-id
VITE_PINGONE_REDIRECT_URI=https://your-app.vercel.app
```

**Important:** Update `VITE_PINGONE_REDIRECT_URI` with your actual Vercel URL.

### PingOne AIC Configuration

In your PingOne AIC OAuth client settings:

**Client Type:** Web Application

**Grant Types:**
- ✅ Implicit Flow

**Response Types:**
- ✅ `id_token token`

**Allowed Callback URLs:**
- `http://localhost:5173` (for development)
- `https://your-app.vercel.app` (for production)

**Allowed Logout URLs:**
- `http://localhost:5173`
- `https://your-app.vercel.app`

1. User logs in via PingOne AIC
2. Access token contains `groups` claim
3. `planAccess.js` determines plan from groups
4. Dashboard shows plan banner and features
5. `FeatureCard` components check access and show lock icons

## Security

- No client secret in frontend (Implicit Flow)
- Tokens stored in sessionStorage (cleared on logout)
- HTTPS required for production
- CORS configured in PingOne AIC
- Token validation via UserInfo endpoint

## Documentation

- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Detailed OAuth integration steps
- **[DEMO_SETUP.md](./DEMO_SETUP.md)** - Demo presentation guide

## Troubleshooting

### "Invalid Scope" Error
- Ensure all scopes (`openid`, `email`, `profile`) are enabled in PingOne AIC OAuth client

### "Unauthorized Grant Type" Error
- Enable "Implicit" grant type in OAuth client settings
- Enable `token` and `id_token` response types

### Groups Not Showing
- Verify user is assigned to a group in PingOne AIC
- Check browser console for `Access token payload:` log
- Ensure group names match exactly (case-insensitive)

### Page Refresh Issues
- Clear browser cache and sessionStorage
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

## License

MIT

## Support

For issues or questions, contact your PingOne AIC administrator.
