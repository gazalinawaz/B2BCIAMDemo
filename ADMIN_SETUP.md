# Admin API Access Setup

This guide explains how to enable full admin API access for the PingOne AIC demo application.

## 🔐 Requirements

To use admin APIs (user management, group management, etc.), you need:

1. **OAuth Scope**: `fr:idm:*` 
2. **User Role**: `amadmin` or equivalent admin role
3. **PingOne AIC Configuration**: Scope enabled in OAuth client

---

## ✅ Step 1: Enable `fr:idm:*` Scope in PingOne AIC

### In PingOne AIC Admin Console:

1. Navigate to **Applications** → **OAuth 2.0 Clients**
2. Select your client (e.g., `BT_B2B`)
3. Go to **Scopes** tab
4. **Enable** the following scope:
   - `fr:idm:*` (ForgeRock Identity Management - full access)
5. **Save** changes

---

## ✅ Step 2: Assign Admin Role to User

### In PingOne AIC Admin Console:

1. Navigate to **Identities** → **Manage** → **{realm}_user**
2. Find your user (e.g., by email)
3. Click on the user to edit
4. Go to **Roles** or **Authorization** tab
5. **Assign** the `amadmin` role
6. **Save** changes

**Note**: The `amadmin` role provides full administrative access to AM (Access Management) and IDM (Identity Management) APIs.

---

## ✅ Step 3: Verify Configuration

### Application Configuration

The application is already configured with the `fr:idm:*` scope in `src/config.js`:

```javascript
scope: 'openid email profile fr:idm:*'
```

### Test the Setup

1. **Logout** from the application (to clear old tokens)
2. **Login** again (to get new token with `fr:idm:*` scope)
3. Go to **API Test Page** (`/api-test`)
4. Try running admin tests:
   - Query All Users
   - Query All Groups
   - Search Users by Email

---

## 🧪 What APIs Will Work

With `amadmin` role + `fr:idm:*` scope, you can:

### ✅ User Management
- Query all users
- Search users by any field
- Create new users
- Update user profiles
- Delete users
- Get user by ID

### ✅ Group Management
- Query all groups
- Search groups
- Get group by ID
- Add users to groups
- Remove users from groups
- Create/delete groups

### ✅ Custom Managed Objects
- Query organizations
- Query roles
- Create/update/delete custom objects

### ✅ OAuth/Auth
- Get UserInfo
- Validate tokens
- Manage sessions

---

## 🔍 Troubleshooting

### Still Getting 403 Errors?

**Check 1: Scope Enabled in OAuth Client**
- Verify `fr:idm:*` is enabled in PingOne AIC OAuth client settings
- Make sure it's checked/enabled, not just listed

**Check 2: User Has Admin Role**
- Verify user has `amadmin` role assigned
- Check in PingOne AIC: Identities → Manage → {realm}_user → [Your User] → Roles

**Check 3: Fresh Login Required**
- Logout from the app
- Clear browser cache/sessionStorage
- Login again to get new token with updated scopes

**Check 4: Verify Token Contains Scope**
- In browser console, check: `sessionStorage.getItem('accessToken')`
- Decode the JWT at https://jwt.io
- Verify `scope` claim includes `fr:idm:*`

### Token Doesn't Have `fr:idm:*` Scope?

This means the OAuth client configuration wasn't updated correctly:
1. Double-check PingOne AIC OAuth client settings
2. Ensure `fr:idm:*` scope is **enabled** (not just listed)
3. Save the OAuth client configuration
4. Logout and login again

---

## 📊 Scope Comparison

| Scope | Access Level | What You Can Do |
|-------|--------------|-----------------|
| `openid` | Basic | Authentication only |
| `email` | Basic | Read user email |
| `profile` | Basic | Read user profile (name, etc.) |
| `fr:idm:*` | **Admin** | **Full IDM access - manage users, groups, objects** |

---

## 🔐 Security Considerations

### Production Recommendations

1. **Limit `fr:idm:*` scope** to admin users only
2. **Create separate OAuth clients** for:
   - End users (basic scopes)
   - Admin users (with `fr:idm:*`)
3. **Use Authorization Code Flow with PKCE** instead of Implicit Flow
4. **Implement proper RBAC** in your application
5. **Audit admin API calls** for security monitoring

### For Demo Purposes

The current setup is fine for demonstration:
- Shows both basic and admin API capabilities
- Easy to test different permission levels
- Clear error messages for unauthorized access

---

## 📚 Additional Resources

- **PingOne AIC Scopes**: https://docs.pingidentity.com/pingoneaic/latest/oauth2/scopes.html
- **IDM REST API**: https://docs.pingidentity.com/pingoneaic/latest/developer-docs/idm/rest-api.html
- **Admin Roles**: https://docs.pingidentity.com/pingoneaic/latest/am/authorization.html

---

## ✅ Quick Checklist

Before testing admin APIs:

- [ ] `fr:idm:*` scope enabled in PingOne AIC OAuth client
- [ ] User has `amadmin` role assigned
- [ ] Logged out and logged back in (fresh token)
- [ ] Verified token contains `fr:idm:*` in scope claim
- [ ] Tested on `/api-test` page

---

**Once configured, all admin API tests should work!** 🚀
