# Quick Setup: Create Managed Objects in PingOne AIC

You're getting a 404 error because the managed objects don't exist yet. Follow these steps to create them.

## 🚀 Option 1: Use MCP Server (Fastest - If Available)

If you have the `aic-mcp-server` available, you can create the managed objects programmatically.

### Step 1: Create Organization Object

```javascript
// Use the MCP server tool to create managed object definition
await mcp0_createManagedObjectDefinition({
  objectName: "alpha_organization",
  objectDefinition: {
    schema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          title: "Organization Name",
          required: true,
          searchable: true
        },
        description: {
          type: "string",
          title: "Description"
        },
        members: {
          type: "array",
          title: "Members",
          items: {
            type: "relationship",
            reverseRelationship: true,
            reversePropertyName: "organizations",
            properties: {
              _ref: { type: "string" },
              role: { type: "string" }
            }
          },
          resourceCollection: [
            { path: "managed/alpha_user", label: "User" }
          ]
        },
        createdDate: {
          type: "string",
          title: "Created Date"
        },
        createdBy: {
          type: "string",
          title: "Created By"
        }
      }
    }
  }
});
```

### Step 2: Create Invitation Object

```javascript
await mcp0_createManagedObjectDefinition({
  objectName: "alpha_invitation",
  objectDefinition: {
    schema: {
      type: "object",
      properties: {
        organizationId: {
          type: "string",
          title: "Organization ID",
          required: true
        },
        inviterUserId: {
          type: "string",
          title: "Inviter User ID",
          required: true
        },
        inviteeEmail: {
          type: "string",
          title: "Invitee Email",
          required: true
        },
        role: {
          type: "string",
          title: "Role",
          required: true
        },
        status: {
          type: "string",
          title: "Status",
          required: true,
          default: "pending"
        },
        createdDate: {
          type: "string",
          title: "Created Date"
        },
        expiryDate: {
          type: "string",
          title: "Expiry Date"
        },
        acceptedDate: {
          type: "string",
          title: "Accepted Date"
        },
        acceptedByUserId: {
          type: "string",
          title: "Accepted By User ID"
        }
      }
    }
  }
});
```

---

## 🖱️ Option 2: Manual Setup via PingOne AIC Console

### Step 1: Login to PingOne AIC

1. Go to: `https://openam-accenture-11-20.forgeblocks.com/platform`
2. Login with admin credentials

### Step 2: Navigate to Managed Objects

1. Click **Native Consoles** (top right corner)
2. Select **Identity Management**
3. Click **Configure** → **Managed Objects**

### Step 3: Create `alpha_organization`

1. Click **+ New Managed Object**
2. **Name**: `alpha_organization`
3. Click **Save**

4. **Add Properties** (click "+ Add Property" for each):

   **Property 1: name**
   - Name: `name`
   - Type: `String`
   - Required: ✅ Yes
   - Searchable: ✅ Yes
   - Click **Save**

   **Property 2: description**
   - Name: `description`
   - Type: `String`
   - Click **Save**

   **Property 3: members**
   - Name: `members`
   - Type: `Array`
   - Items Type: `Relationship`
   - Click **Configure Relationship**:
     - Resource Collection: `managed/alpha_user`
     - Reverse Property Name: `organizations`
     - Click **Save**
   - Click **Save**

   **Property 4: createdDate**
   - Name: `createdDate`
   - Type: `String`
   - Click **Save**

   **Property 5: createdBy**
   - Name: `createdBy`
   - Type: `String`
   - Click **Save**

5. Click **Save** on the managed object

### Step 4: Create `alpha_invitation`

1. Click **+ New Managed Object**
2. **Name**: `alpha_invitation`
3. Click **Save**

4. **Add Properties**:

   **Property 1: organizationId**
   - Name: `organizationId`
   - Type: `String`
   - Required: ✅ Yes
   - Click **Save**

   **Property 2: inviterUserId**
   - Name: `inviterUserId`
   - Type: `String`
   - Required: ✅ Yes
   - Click **Save**

   **Property 3: inviteeEmail**
   - Name: `inviteeEmail`
   - Type: `String`
   - Required: ✅ Yes
   - Click **Save**

   **Property 4: role**
   - Name: `role`
   - Type: `String`
   - Required: ✅ Yes
   - Click **Save**

   **Property 5: status**
   - Name: `status`
   - Type: `String`
   - Required: ✅ Yes
   - Default Value: `pending`
   - Click **Save**

   **Property 6: createdDate**
   - Name: `createdDate`
   - Type: `String`
   - Click **Save**

   **Property 7: expiryDate**
   - Name: `expiryDate`
   - Type: `String`
   - Click **Save**

   **Property 8: acceptedDate**
   - Name: `acceptedDate`
   - Type: `String`
   - Click **Save**

   **Property 9: acceptedByUserId**
   - Name: `acceptedByUserId`
   - Type: `String`
   - Click **Save**

5. Click **Save** on the managed object

### Step 5: Update `alpha_user` (Add Reverse Relationship)

1. In **Managed Objects**, click on `alpha_user`
2. Click **+ Add Property**
3. **Add organizations property**:
   - Name: `organizations`
   - Type: `Array`
   - Items Type: `Relationship`
   - Click **Configure Relationship**:
     - Resource Collection: `managed/alpha_organization`
     - Reverse Property Name: `members`
     - Click **Save**
   - Click **Save**
4. Click **Save** on the managed object

---

## ✅ Verify Setup

After creating the managed objects, test in your app:

1. **Refresh the app** (Ctrl+Shift+R or Cmd+Shift+R)
2. **Go to** `/organizations` page
3. **Try creating an organization**
4. **Should work now!** ✅

---

## 🐛 Troubleshooting

### Still getting 404 error?

**Check 1: Managed object names**
- Must be exactly `alpha_organization` and `alpha_invitation`
- Case-sensitive
- No typos

**Check 2: Realm**
- Objects must be in `alpha` realm
- Check your `.env` file: `VITE_PINGONE_REALM=alpha`

**Check 3: Permissions**
- Ensure you have `fr:idm:*` scope
- User must have `amadmin` role

### Can't find Managed Objects in console?

1. Make sure you're in **Native Consoles** → **Identity Management**
2. Not in the main Platform UI
3. Look for **Configure** menu on the left

### Objects created but still 404?

1. **Logout** from the app
2. **Clear browser cache**
3. **Login again** (to get fresh token)
4. **Try again**

---

## 📊 Expected Result

After setup, you should be able to:

✅ Create organizations
✅ Send invitations
✅ Accept invitations
✅ View organization members

---

## 🎯 Quick Test

Run this in browser console after setup:

```javascript
// Test if objects exist
fetch('https://openam-accenture-11-20.forgeblocks.com/openidm/managed/alpha_organization?_queryFilter=true', {
  headers: {
    'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
  }
})
.then(r => r.json())
.then(d => console.log('Organizations:', d));

fetch('https://openam-accenture-11-20.forgeblocks.com/openidm/managed/alpha_invitation?_queryFilter=true', {
  headers: {
    'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
  }
})
.then(r => r.json())
.then(d => console.log('Invitations:', d));
```

If both return `{ result: [], ... }` instead of 404, setup is complete! ✅

---

**Need help? Check `SETUP_ORGANIZATIONS.md` for detailed screenshots and step-by-step guide.**
