# ⚠️ IMPORTANT: Vercel Environment Variables Setup

## Required Environment Variables

You **MUST** add these in Vercel Dashboard before the app will work:

1. Go to: https://vercel.com/dashboard
2. Select your project: `b2-bciam-demo`
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

```
VITE_PINGONE_DOMAIN=openam-accenture-11-20.forgeblocks.com
VITE_PINGONE_REALM=alpha
VITE_PINGONE_TREE=Login
VITE_PINGONE_CLIENT_ID=BT_B2B
VITE_PINGONE_REDIRECT_URI=https://b2-bciam-demo.vercel.app
```

## After Adding Variables

1. Go to **Deployments** tab
2. Click **...** on the latest deployment
3. Click **Redeploy**

## Verify Configuration

After redeployment, open browser console and check for:
```
PingOne AIC Config: {
  domain: "openam-accenture-11-20.forgeblocks.com",
  clientId: "BT_B2B",
  realm: "alpha",
  redirectUri: "https://b2-bciam-demo.vercel.app"
}
```

If you see `clientId: "NOT SET"`, the environment variables are not configured correctly.
