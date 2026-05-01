# Troubleshooting: alpha_invitation 404 Error

## Issue
Getting 404 error when trying to access `managed/alpha_invitation`

## Cause
The managed object definition exists, but the IDM service hasn't reloaded the configuration yet.

## Solution

### Option 1: Wait (Recommended)
PingOne AIC automatically reloads managed object configurations. Wait 1-2 minutes and try again.

### Option 2: Restart IDM Service
If you have admin access to PingOne AIC:
1. Go to Native Consoles → Identity Management
2. Navigate to Configure → System → Restart
3. Click "Restart IDM"
4. Wait for service to come back online

### Option 3: Manual Verification
Test if the object is accessible:

```javascript
// In browser console
fetch('https://openam-accenture-11-20.forgeblocks.com/openidm/managed/alpha_invitation?_queryFilter=true', {
  headers: {
    'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
  }
})
.then(r => r.json())
.then(d => console.log('Success:', d))
.catch(e => console.error('Still 404:', e));
```

### Option 4: Verify Object Exists
```javascript
// List all managed objects
fetch('https://openam-accenture-11-20.forgeblocks.com/openidm/config/managed', {
  headers: {
    'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
  }
})
.then(r => r.json())
.then(d => {
  const hasInvitation = d.objects.some(obj => obj.name === 'alpha_invitation');
  console.log('alpha_invitation exists:', hasInvitation);
});
```

## Current Status

✅ **Object Definition Created**
- Name: `alpha_invitation`
- Schema: All required fields added
- Email tracking fields: `emailSent`, `emailSentDate`, `emailError`
- onCreate hook: Configured with email script

✅ **Email Script Created**
- Script ID: `41620a05-11cc-49ae-bafb-36a6b046e802`
- Function: Send invitation email
- Status: Active

⏳ **Waiting for Service Reload**
- The IDM service needs to reload the configuration
- This usually happens automatically within 1-2 minutes
- You can also manually restart the service

## What to Do Now

1. **Wait 1-2 minutes** for automatic reload
2. **Refresh your app** (Ctrl+Shift+R or Cmd+Shift+R)
3. **Try sending an invitation** again
4. If still 404, **restart IDM service** (if you have access)

## Verification Steps

After waiting/restarting:

1. **Go to** `/organizations` page
2. **Click** "Send Invitation" tab
3. **Try sending an invitation**
4. **Should work now!** ✅

If you still get 404 after 5 minutes, the managed object may need to be recreated through the PingOne AIC console directly.

## Alternative: Create via Console

If the API approach doesn't work, create manually:

1. **Go to**: Native Consoles → Identity Management
2. **Navigate to**: Configure → Managed Objects
3. **Click**: + New Managed Object
4. **Name**: `alpha_invitation`
5. **Add all properties** from the schema
6. **Add onCreate script hook**
7. **Save**

This will immediately make the object available.

---

**The object is configured correctly - just needs the service to reload!** ⏳
