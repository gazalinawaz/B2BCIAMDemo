# Setting Up Organizations in PingOne AIC

This guide walks you through setting up the organization management feature step-by-step.

## 🎯 Overview

You need to create two managed objects in PingOne AIC:
1. **Organization** - Stores organization data and members
2. **Invitation** - Tracks user invitations to organizations

---

## 📋 Step 1: Create Organization Managed Object

### Using PingOne AIC Admin Console

1. **Login to PingOne AIC Admin Console**
   - URL: `https://openam-accenture-11-20.forgeblocks.com/platform`
   - Use your admin credentials

2. **Navigate to Managed Objects**
   - Click **Native Consoles** (top right)
   - Select **Identity Management**
   - Go to **Configure** → **Managed Objects**

3. **Create New Managed Object**
   - Click **+ New Managed Object**
   - Name: `alpha_organization`
   - Click **Save**

4. **Add Properties**

   Click **Add Property** for each:

   **Property 1: name**
   - Name: `name`
   - Type: `String`
   - Required: ✅ Yes
   - Searchable: ✅ Yes
   - User Editable: ✅ Yes

   **Property 2: description**
   - Name: `description`
   - Type: `String`
   - Required: ❌ No
   - User Editable: ✅ Yes

   **Property 3: members**
   - Name: `members`
   - Type: `Array`
   - Items Type: `Relationship`
   - Relationship:
     - Resource Collection: `managed/alpha_user`
     - Reverse Property Name: `organizations`
   - User Editable: ✅ Yes

   **Property 4: createdDate**
   - Name: `createdDate`
   - Type: `String`
   - User Editable: ❌ No

   **Property 5: createdBy**
   - Name: `createdBy`
   - Type: `String`
   - User Editable: ❌ No

5. **Save the Managed Object**

---

## 📋 Step 2: Create Invitation Managed Object

1. **Create New Managed Object**
   - Click **+ New Managed Object**
   - Name: `alpha_invitation`
   - Click **Save**

2. **Add Properties**

   **Property 1: organizationId**
   - Name: `organizationId`
   - Type: `String`
   - Required: ✅ Yes

   **Property 2: inviterUserId**
   - Name: `inviterUserId`
   - Type: `String`
   - Required: ✅ Yes

   **Property 3: inviteeEmail**
   - Name: `inviteeEmail`
   - Type: `String`
   - Required: ✅ Yes

   **Property 4: role**
   - Name: `role`
   - Type: `String`
   - Required: ✅ Yes

   **Property 5: status**
   - Name: `status`
   - Type: `String`
   - Required: ✅ Yes
   - Default Value: `pending`

   **Property 6: createdDate**
   - Name: `createdDate`
   - Type: `String`

   **Property 7: expiryDate**
   - Name: `expiryDate`
   - Type: `String`

   **Property 8: acceptedDate**
   - Name: `acceptedDate`
   - Type: `String`

   **Property 9: acceptedByUserId**
   - Name: `acceptedByUserId`
   - Type: `String`

3. **Save the Managed Object**

---

## 📋 Step 3: Update User Object (Add Reverse Relationship)

1. **Edit alpha_user Managed Object**
   - Go to **Managed Objects**
   - Click on `alpha_user`

2. **Add organizations Property**
   - Click **Add Property**
   - Name: `organizations`
   - Type: `Array`
   - Items Type: `Relationship`
   - Relationship:
     - Resource Collection: `managed/alpha_organization`
     - Reverse Property Name: `members`
   - User Editable: ✅ Yes

3. **Save**

---

## 🧪 Step 4: Test the Setup

### Option A: Using API Test Page (Easiest)

1. **Deploy the app** (wait 2-3 minutes)
2. **Login** to the app
3. **Go to** `/api-test` page
4. **Scroll to** "Organization Management" section
5. **Run tests** in order:

   **Test 1: Create Organization**
   - Click "Run Test"
   - Should create org and make you Org Admin
   - ✅ Success = Setup is working!

   **Test 2: Query All Organizations**
   - Should show the org you just created

   **Test 3: Get My Organizations**
   - Should show orgs you're a member of

   **Test 4: Send Invitation**
   - Enter an email address
   - Creates invitation for that user

   **Test 5: Get Pending Invitations**
   - Shows invitations for your email

### Option B: Using Browser Console

```javascript
// Import the API
import { createOrganizationWithAdmin } from './utils/organizationApi';

// Create organization
const result = await createOrganizationWithAdmin('your-user-id', {
  name: 'Test Organization',
  description: 'My first org'
});

console.log('Organization created:', result);
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] `alpha_organization` managed object exists
- [ ] `alpha_invitation` managed object exists
- [ ] `alpha_user` has `organizations` property
- [ ] Can create organization via API test page
- [ ] Can query organizations
- [ ] Can send invitations
- [ ] Can view pending invitations

---

## 🐛 Troubleshooting

### Error: "403 Forbidden"

**Problem**: Missing admin permissions

**Solution**:
1. Ensure user has `amadmin` role
2. Verify `fr:idm:*` scope is enabled in OAuth client
3. Logout and login again to get new token

### Error: "404 Not Found - managed/alpha_organization"

**Problem**: Managed object doesn't exist

**Solution**:
1. Verify you created `alpha_organization` in PingOne AIC
2. Check the name matches exactly (case-sensitive)
3. Ensure it's in the correct realm (`alpha`)

### Error: "Invalid relationship"

**Problem**: Relationship not configured correctly

**Solution**:
1. Check `members` property in `alpha_organization` points to `managed/alpha_user`
2. Check `organizations` property in `alpha_user` points to `managed/alpha_organization`
3. Ensure reverse property names match

### Can't see organizations in query

**Problem**: No organizations created yet

**Solution**:
1. Create an organization first using "Create Organization" test
2. Then query to see it

---

## 📊 Expected Data Structure

After creating an organization, you should see:

```json
{
  "_id": "abc-123-def",
  "name": "Test Org 1735772400000",
  "description": "Created from API test page",
  "members": [
    {
      "_ref": "managed/alpha_user/658477e5-1b22-4977-868a-991d8c524cd9",
      "role": "Org Admin"
    }
  ],
  "createdDate": "2025-01-01T20:00:00Z",
  "createdBy": "658477e5-1b22-4977-868a-991d8c524cd9"
}
```

---

## 🎯 Next Steps

Once setup is complete:

1. ✅ Create organizations via API
2. ✅ Invite users to organizations
3. ✅ Build UI for organization management
4. ✅ Implement invitation acceptance flow
5. ✅ Add email notifications

---

## 📚 Additional Resources

- **Organization API Reference**: `src/utils/organizationApi.js`
- **Workflow Guide**: `ORGANIZATION_WORKFLOW.md`
- **PingOne AIC Docs**: https://docs.pingidentity.com/pingoneaic/latest/

---

**Ready to test! Go to `/api-test` page and try the Organization Management tests.** 🚀
