# PingOne AIC B2B Broadband Demo - Setup Guide

## Overview
This demo showcases **PingOne AIC Authentication & Authorization** for a B2B broadband service application with plan-based access control.

---

## Demo Scenario

**XYZ Broadband** offers three service plans:
- **Simple Plan** ($29.99/month) - 100 Mbps - Basic features
- **Medium Plan** ($49.99/month) - 500 Mbps - More features
- **Large Plan** ($79.99/month) - 1 Gbps - All features

**Users get different access based on their purchased plan** (stored in PingOne AIC groups/attributes).

---

## What This Demo Shows

### 1. **Authentication** (Working ✅)
- User logs in via PingOne AIC OAuth 2.0 Implicit Flow
- Tokens are securely obtained and stored
- User profile data is retrieved from ID token + UserInfo endpoint

### 2. **Authorization** (Plan-Based Access Control)
- Features are shown/hidden based on user's plan
- Locked features display "🔒 Upgrade Required" message
- Access levels: Simple (Level 1), Medium (Level 2), Large (Level 3)

### 3. **Feature Access Matrix**

| Feature | Simple | Medium | Large |
|---------|--------|--------|-------|
| Usage Dashboard | ✅ | ✅ | ✅ |
| Billing Management | ❌ | ✅ | ✅ |
| Advanced Settings | ❌ | ❌ | ✅ |
| Priority Support | ❌ | ✅ | ✅ |
| Analytics & Reports | ❌ | ✅ | ✅ |
| API Access | ❌ | ❌ | ✅ |

---

## PingOne AIC Configuration

### Step 1: Create User Groups

Create three groups in PingOne AIC (alpha realm):

1. **broadband-simple**
   - Description: Simple Plan Users
   - Access Level: 1

2. **broadband-medium**
   - Description: Medium Plan Users
   - Access Level: 2

3. **broadband-large**
   - Description: Large Plan Users
   - Access Level: 3

### Step 2: Assign Users to Groups

1. Go to **Identities** → **Manage** → **User**
2. Select a test user
3. Go to **Groups** tab
4. Add user to one of the broadband groups

### Step 3: Configure OAuth Client

Ensure your OAuth client has these scopes enabled:
- ✅ `openid`
- ✅ `email`
- ✅ `profile` (optional - for name)
- ✅ `address` (optional - for city)

---

## How Authorization Works

### 1. **Plan Detection**
The application checks the user's plan in this order:
```javascript
// Check user.plan attribute
user.plan

// Check user groups
user.groups.find(g => g.includes('simple|medium|large'))

// Default to Simple if not found
'simple'
```

### 2. **Feature Access Check**
```javascript
// Each feature has a required permission
canAccessBilling: true/false
canAccessAdvancedSettings: true/false
canAccessPrioritySupport: true/false
canAccessAnalytics: true/false

// Check if user's plan has the permission
if (planDetails.canAccessBilling) {
  // Show feature
} else {
  // Show locked with upgrade message
}
```

### 3. **Visual Indicators**
- ✅ **Accessible features**: White background, clickable, full opacity
- 🔒 **Locked features**: Gray background, "Upgrade Required" badge, reduced opacity

---

## Demo Flow for Client Presentation

### 1. **Show Simple Plan User**
1. Log in as user with `broadband-simple` group
2. Dashboard shows:
   - Green plan banner
   - "Simple Plan - 100 Mbps - $29.99/month"
   - Access Level: 1
   - Only "Usage Dashboard" is accessible
   - All other features show 🔒 "Upgrade Required"

### 2. **Show Medium Plan User**
1. Log in as user with `broadband-medium` group
2. Dashboard shows:
   - Blue plan banner
   - "Medium Plan - 500 Mbps - $49.99/month"
   - Access Level: 2
   - Accessible: Usage Dashboard, Billing, Priority Support, Analytics
   - Locked: Advanced Settings, API Access

### 3. **Show Large Plan User**
1. Log in as user with `broadband-large` group
2. Dashboard shows:
   - Purple plan banner
   - "Large Plan - 1 Gbps - $79.99/month"
   - Access Level: 3
   - All features accessible ✅

---

## Files Created for Demo

### 1. **`src/utils/planAccess.js`**
- Plan definitions (Simple/Medium/Large)
- Feature access matrix
- Helper functions to check user's plan and permissions

### 2. **`src/components/FeatureCard.jsx`**
- Reusable component for feature cards
- Automatically shows/hides based on user permissions
- Displays lock icon for inaccessible features

### 3. **Dashboard Updates** (To be implemented)
- Plan banner showing current plan
- Feature grid with authorization checks
- Visual demo information box

---

## Implementation Steps

### Current Status
✅ Authentication working
✅ Groups display working
✅ Plan access utilities created
✅ FeatureCard component created
⏳ Dashboard integration pending

### To Complete Demo
1. Replace Dashboard stats section with plan banner
2. Add feature grid with FeatureCard components
3. Test with different user groups
4. Add demo information box

---

## Testing the Demo

### Test Users Setup
Create 3 test users in PingOne AIC:

1. **simple.user@example.com**
   - Group: `broadband-simple`
   - Expected: Only basic features accessible

2. **medium.user@example.com**
   - Group: `broadband-medium`
   - Expected: Billing, support, analytics accessible

3. **large.user@example.com**
   - Group: `broadband-large`
   - Expected: All features accessible

### Demo Script
1. **Introduction** (2 min)
   - Explain B2B broadband scenario
   - Show three plans and pricing

2. **Authentication Demo** (3 min)
   - Show login flow
   - Explain OAuth 2.0 Implicit Flow
   - Show token retrieval

3. **Authorization Demo** (5 min)
   - Log in as Simple user → show locked features
   - Log in as Medium user → show partial access
   - Log in as Large user → show full access
   - Explain how PingOne AIC groups control access

4. **Technical Deep Dive** (5 min)
   - Show token details
   - Explain group-based authorization
   - Show code: planAccess.js logic
   - Discuss scalability for real B2B scenarios

---

## Key Selling Points for Client

### 1. **Centralized Identity Management**
- All users managed in PingOne AIC
- Single source of truth for authentication

### 2. **Flexible Authorization**
- Group-based access control
- Easy to add new plans/features
- No code changes needed to adjust permissions

### 3. **Scalable Architecture**
- Works for B2B partner portals
- Supports multiple organizations
- Can integrate with billing systems

### 4. **Security**
- OAuth 2.0 standard
- Tokens expire automatically
- No passwords stored in application

### 5. **User Experience**
- Clear visual indicators of access levels
- Upgrade prompts for locked features
- Seamless authentication flow

---

## Next Steps for Production

1. **Switch to Authorization Code Flow with PKCE** (more secure)
2. **Add backend API** for sensitive operations
3. **Integrate with billing system** to sync plans
4. **Add real feature implementations** (not just alerts)
5. **Implement plan upgrade flow**
6. **Add analytics tracking**

---

## Support & Resources

- **PingOne AIC Docs**: https://docs.pingidentity.com/pingoneaic/
- **OAuth 2.0 Spec**: https://oauth.net/2/
- **Demo Repository**: [Your GitHub URL]

---

**Demo Status**: Ready for presentation after Dashboard integration
**Last Updated**: May 1, 2026
