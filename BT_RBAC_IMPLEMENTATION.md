# BT RBAC Implementation Guide

## ✅ **Implementation Complete!**

This guide documents the complete RBAC (Role-Based Access Control) implementation for BT using PingOne AIC native capabilities.

---

## 🎯 **What Was Implemented**

### **1. Extended `alpha_role` Schema**
Added custom properties to support RBAC:
- **`resources`** (array) - Resources the role can access
- **`actions`** (array) - CRUD actions the role can perform

### **2. Created BT Phase 1 Roles**
Six roles created with proper permissions:

| Role | Resources | Actions | Description |
|------|-----------|---------|-------------|
| `org_admin` | organisation, project, user, billing | create, read, update, delete, monitor | Full org admin access |
| `org_view` | organisation, project | read, monitor | Read-only org access |
| `customer_port_admin` | customer_port | create, read, update, delete, monitor | Full customer port admin |
| `customer_port_view` | customer_port | read, monitor | Read-only customer port |
| `internet_admin` | internet | create, read, update, delete, monitor | Full internet admin |
| `ip_vpn_admin` | ip_vpn | create, read, update, delete, monitor | Full IP VPN admin |

### **3. Updated Roles Management UI**
Enhanced `/roles` page with:
- ✅ View all roles with resources and actions
- ✅ Create new roles with resource/action selection
- ✅ Quick templates for BT Phase 1 roles
- ✅ Visual badges for resources (blue) and actions (green)
- ✅ Role details modal with full information
- ✅ Delete roles functionality

---

## 📊 **Role Structure**

Each role in PingOne AIC now contains:

```json
{
  "_id": "role-uuid",
  "name": "customer_port_admin",
  "description": "Customer Port Administrator - full access",
  "resources": ["customer_port"],
  "actions": ["create", "read", "update", "delete", "monitor"],
  "members": []
}
```

---

## 🚀 **How to Use**

### **Access the Roles Page**
1. Login to the app
2. Click **"🎭 Roles"** from dashboard
3. View all existing roles

### **Create a New Role**

**Option 1: Use Template**
1. Click "➕ Create New Role"
2. Click a template (e.g., `org_admin`)
3. Modify if needed
4. Click "✨ Create Role"

**Option 2: Custom Role**
1. Click "➕ Create New Role"
2. Enter role name and description
3. Select resources (click to toggle):
   - organisation
   - project
   - user
   - billing
   - customer_port
   - internet
   - ip_vpn
4. Select actions (click to toggle):
   - CREATE
   - READ
   - UPDATE
   - DELETE
   - MONITOR
5. Click "✨ Create Role"

### **View Role Details**
1. Click "👁️ View" on any role
2. See full details including:
   - Role name
   - Description
   - Resources (blue badges)
   - Actions (green badges)
   - Role ID
   - Members (if any)

### **Delete a Role**
1. Click "🗑️ Delete" on any role
2. Confirm deletion
3. Role is removed

---

## 🔗 **Assign Roles to Users**

### **Via PingOne AIC Console**
1. Go to: **Identities → Manage → Alpha realm - Roles**
2. Select a role
3. Click **Members** tab
4. Click **Add Members**
5. Select users to add

### **Via API**
```bash
curl -X POST \
  "https://openam-accenture-11-20.forgeblocks.com/openidm/managed/alpha_user/USER_ID/roles" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "_ref": "managed/alpha_role/ROLE_ID"
  }'
```

### **Via Organization Page**
When adding members to organizations, select their role:
1. Go to `/organizations`
2. Click "➕ Add Member"
3. Search for user
4. Select role from dropdown
5. User is added with that role

---

## 📋 **Available Resources**

| Resource | Description |
|----------|-------------|
| `organisation` | Organization management |
| `project` | Project management |
| `user` | User management |
| `billing` | Billing and payments |
| `customer_port` | Customer port management |
| `internet` | Internet service management |
| `ip_vpn` | IP VPN management |

---

## 📋 **Available Actions**

| Action | Description |
|--------|-------------|
| `create` | Create new resources |
| `read` | View/read resources |
| `update` | Modify existing resources |
| `delete` | Remove resources |
| `monitor` | Monitor and view analytics |

---

## 🎯 **Next Steps**

### **Step 1: Verify Roles Created** ✅ DONE
All 6 BT Phase 1 roles are created and visible in `/roles` page.

### **Step 2: Assign Roles to Users**
Use the PingOne AIC console or API to assign roles to users.

### **Step 3: Update Access Token Script**
Create a script to embed roles in access tokens:

```javascript
// Pseudo-code for access token script
var userId = identity._id;
var user = openidm.read("managed/alpha_user/" + userId, null, ["effectiveRoles"]);

var organizations = [];

// For each role, get role details and group by organization
user.effectiveRoles.forEach(function(roleRef) {
  var roleId = roleRef._ref.split('/').pop();
  var role = openidm.read("managed/alpha_role/" + roleId);
  
  var orgId = roleRef._refProperties.orgId;
  
  // Add to organizations array
  organizations.push({
    id: orgId,
    roles: [{
      name: role.name,
      resources: role.resources,
      actions: role.actions
    }]
  });
});

// Add to token
accessToken.setCustomClaim("organizations", organizations);
```

### **Step 4: Enforce RBAC in Backend**
Your backend APIs should:
1. Read `organizations` claim from JWT
2. Check if user has required resource + action
3. Allow or deny request

Example:
```javascript
function hasPermission(token, resource, action) {
  const orgs = token.organizations || [];
  
  for (const org of orgs) {
    for (const role of org.roles) {
      if (role.resources.includes(resource) && 
          role.actions.includes(action)) {
        return true;
      }
    }
  }
  
  return false;
}

// Usage
if (hasPermission(token, 'customer_port', 'create')) {
  // Allow create customer port
} else {
  // Deny - 403 Forbidden
}
```

---

## 🔍 **Verify Implementation**

### **Check Roles Exist**
```bash
curl -X GET \
  "https://openam-accenture-11-20.forgeblocks.com/openidm/managed/alpha_role?_queryFilter=true" \
  -H "Authorization: Bearer <token>"
```

### **Check User's Roles**
```bash
curl -X GET \
  "https://openam-accenture-11-20.forgeblocks.com/openidm/managed/alpha_user/USER_ID?_fields=effectiveRoles" \
  -H "Authorization: Bearer <token>"
```

### **Check Role Details**
```bash
curl -X GET \
  "https://openam-accenture-11-20.forgeblocks.com/openidm/managed/alpha_role/ROLE_ID" \
  -H "Authorization: Bearer <token>"
```

---

## 📚 **Role IDs**

The 6 BT Phase 1 roles were created with these IDs:

| Role Name | Role ID |
|-----------|---------|
| org_admin | 4aae93dd-5009-4d47-a89d-d2fab07888e7 |
| org_view | 7b95ed2a-dd16-4424-96cf-6143fecb55ca |
| customer_port_admin | c0272a59-8ca5-413c-beb3-dbf3158cb350 |
| customer_port_view | 74f71ecd-f47f-4108-8ede-9894bc3ea896 |
| internet_admin | fa9f41fc-c268-44f0-ba64-73d85f867822 |
| ip_vpn_admin | 3e993bdf-6bc6-499d-818d-00d6c662ae27 |

---

## ✅ **Summary**

**What's Working:**
- ✅ `alpha_role` schema extended with `resources` and `actions`
- ✅ 6 BT Phase 1 roles created with proper permissions
- ✅ Roles management UI with create, view, delete
- ✅ Visual display of resources and actions
- ✅ Role templates for quick creation

**What's Next:**
- ⏳ Assign roles to users (via console or API)
- ⏳ Create access token script to embed roles
- ⏳ Implement RBAC enforcement in backend APIs

---

**The foundation for BT's RBAC system is complete and ready to use!** 🎉
