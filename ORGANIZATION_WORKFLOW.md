# Organization & User Invitation Workflow

This document explains how to implement the organization management and user invitation workflow using PingOne AIC.

## 📋 Overview

The workflow supports:
- ✅ User creates organization → becomes Org Admin automatically
- ✅ Org Admin invites users with specific roles
- ✅ Invited users accept invitation (new users auto-register)
- ✅ Single user account can access multiple organizations
- ✅ Role-based access control within organizations

## 🏗️ Architecture

### Roles

| Role | Permissions | Who Gets It |
|------|-------------|-------------|
| **Org Admin** | Full control over organization, can invite users | Organization creator |
| **Customer Port Admin** | Manage customer ports | Invited by Org Admin |
| **Customer Port Monitor** | View customer ports (read-only) | Invited by Org Admin |

### Workflow Steps

```
1. User A creates Organization ABC
   └─> User A automatically becomes Org Admin

2. User A invites User B (role: Customer Port Admin)
   └─> Invitation sent to userB@abc.com

3. User B receives email invitation
   ├─> If User B exists: Accept invitation
   └─> If User B is new: Register account → Accept invitation

4. User B joins Organization ABC with assigned role

5. User A invites User C (role: Customer Port Monitor)
   └─> User C accepts and joins with monitor role
```

## 🔧 Implementation

### 1. Create Organization with Admin

```javascript
import { createOrganizationWithAdmin } from '../utils/organizationApi';

// User A creates organization
const result = await createOrganizationWithAdmin(
  'user-a-id', 
  {
    name: 'Organization ABC',
    description: 'Using BT IdP'
  }
);

console.log(result);
// {
//   organization: { _id: 'org-123', name: 'Organization ABC' },
//   adminUserId: 'user-a-id',
//   role: 'Org Admin'
// }
```

### 2. Invite Users to Organization

```javascript
import { sendOrganizationInvitation } from '../utils/organizationApi';

// User A invites User B as Customer Port Admin
const invitation = await sendOrganizationInvitation(
  'org-123',                    // Organization ID
  'user-a-id',                  // Inviter (User A)
  'userB@abc.com',              // Invitee email
  'Customer Port Admin'         // Role
);

// User A invites User C as Customer Port Monitor
await sendOrganizationInvitation(
  'org-123',
  'user-a-id',
  'userC@xyz.com',
  'Customer Port Monitor'
);
```

### 3. Accept Invitation

```javascript
import { acceptInvitation, getPendingInvitations } from '../utils/organizationApi';

// User B checks pending invitations
const invitations = await getPendingInvitations('userB@abc.com');

// User B accepts invitation
const result = await acceptInvitation(
  invitations.result[0]._id,    // Invitation ID
  'user-b-id'                   // User B's ID
);

console.log(result);
// { success: true, organizationId: 'org-123' }
```

### 4. Get User's Organizations

```javascript
import { getUserOrganizations } from '../utils/organizationApi';

// Get all organizations User B belongs to
const orgs = await getUserOrganizations('user-b-id');

console.log(orgs.result);
// [
//   { _id: 'org-123', name: 'Organization ABC', role: 'Customer Port Admin' }
// ]
```

### 5. Check User Role

```javascript
import { getUserRoleInOrganization, isOrgAdmin } from '../utils/organizationApi';

// Check if User A is Org Admin
const isAdmin = await isOrgAdmin('org-123', 'user-a-id');
console.log(isAdmin); // true

// Get User B's role
const role = await getUserRoleInOrganization('org-123', 'user-b-id');
console.log(role); // 'Customer Port Admin'
```

## 📊 Data Model

### Organization Object

```json
{
  "_id": "org-123",
  "name": "Organization ABC",
  "description": "Using BT IdP",
  "members": [
    {
      "_ref": "managed/alpha_user/user-a-id",
      "role": "Org Admin"
    },
    {
      "_ref": "managed/alpha_user/user-b-id",
      "role": "Customer Port Admin"
    },
    {
      "_ref": "managed/alpha_user/user-c-id",
      "role": "Customer Port Monitor"
    }
  ],
  "createdDate": "2025-01-01T00:00:00Z",
  "createdBy": "user-a-id"
}
```

### Invitation Object

```json
{
  "_id": "inv-456",
  "organizationId": "org-123",
  "inviterUserId": "user-a-id",
  "inviteeEmail": "userB@abc.com",
  "role": "Customer Port Admin",
  "status": "pending",
  "createdDate": "2025-01-01T00:00:00Z",
  "expiryDate": "2025-01-08T00:00:00Z"
}
```

## 🔐 PingOne AIC Setup

### 1. Create Organization Managed Object

In PingOne AIC Admin Console:

1. **Navigate to**: Native Consoles → IDM → Managed Objects
2. **Create new object**: `alpha_organization`
3. **Add properties**:
   - `name` (string, required)
   - `description` (string)
   - `members` (array of relationships to `alpha_user`)
   - `createdDate` (string/date)
   - `createdBy` (string)

### 2. Create Invitation Managed Object

1. **Create new object**: `alpha_invitation`
2. **Add properties**:
   - `organizationId` (string, required)
   - `inviterUserId` (string, required)
   - `inviteeEmail` (string, required)
   - `role` (string, required)
   - `status` (string: pending/accepted/rejected/expired)
   - `createdDate` (string/date)
   - `expiryDate` (string/date)
   - `acceptedDate` (string/date)
   - `acceptedByUserId` (string)

### 3. Configure Relationships

**In `alpha_organization`**:
- Add relationship property `members` → `alpha_user` (array, reverse: `organizations`)

**In `alpha_user`**:
- Add relationship property `organizations` → `alpha_organization` (array, reverse: `members`)

## 🎯 Complete Example: Full Workflow

```javascript
import {
  createOrganizationWithAdmin,
  sendOrganizationInvitation,
  getPendingInvitations,
  acceptInvitation,
  getUserOrganizations,
  getOrganizationMembers
} from '../utils/organizationApi';

// ===== User A: Create Organization =====
const userA = { id: 'user-a-id', email: 'userA@abc.com' };

const orgResult = await createOrganizationWithAdmin(userA.id, {
  name: 'Organization ABC',
  description: 'BT IdP Organization'
});

console.log('✅ Organization created:', orgResult.organization.name);
console.log('✅ User A is now Org Admin');

// ===== User A: Invite User B =====
await sendOrganizationInvitation(
  orgResult.organization._id,
  userA.id,
  'userB@abc.com',
  'Customer Port Admin'
);

console.log('📧 Invitation sent to User B');

// ===== User A: Invite User C =====
await sendOrganizationInvitation(
  orgResult.organization._id,
  userA.id,
  'userC@xyz.com',
  'Customer Port Monitor'
);

console.log('📧 Invitation sent to User C');

// ===== User B: Check and Accept Invitation =====
const userB = { id: 'user-b-id', email: 'userB@abc.com' };

const pendingInvites = await getPendingInvitations(userB.email);
console.log('📬 User B has', pendingInvites.resultCount, 'pending invitations');

await acceptInvitation(pendingInvites.result[0]._id, userB.id);
console.log('✅ User B accepted invitation');

// ===== User C: Accept Invitation =====
const userC = { id: 'user-c-id', email: 'userC@xyz.com' };

const userCInvites = await getPendingInvitations(userC.email);
await acceptInvitation(userCInvites.result[0]._id, userC.id);
console.log('✅ User C accepted invitation');

// ===== View Organization Members =====
const members = await getOrganizationMembers(orgResult.organization._id);
console.log('👥 Organization members:', members);

// Output:
// [
//   { _ref: 'managed/alpha_user/user-a-id', role: 'Org Admin' },
//   { _ref: 'managed/alpha_user/user-b-id', role: 'Customer Port Admin' },
//   { _ref: 'managed/alpha_user/user-c-id', role: 'Customer Port Monitor' }
// ]
```

## 🔒 Security Considerations

### Authorization Checks

Always verify permissions before allowing actions:

```javascript
import { isOrgAdmin } from '../utils/organizationApi';

// Before inviting users
const canInvite = await isOrgAdmin(orgId, currentUserId);
if (!canInvite) {
  throw new Error('Only Org Admins can invite users');
}

// Before modifying organization
const canModify = await isOrgAdmin(orgId, currentUserId);
if (!canModify) {
  throw new Error('Insufficient permissions');
}
```

### Invitation Expiry

Invitations automatically expire after 7 days:

```javascript
// Check expiry before accepting
if (new Date(invitation.expiryDate) < new Date()) {
  throw new Error('Invitation has expired');
}
```

## 📧 Email Notifications

In production, you should send email notifications:

```javascript
// After creating invitation
await sendEmail({
  to: inviteeEmail,
  subject: `You're invited to join ${orgName}`,
  body: `
    ${inviterName} has invited you to join ${orgName} as ${role}.
    
    Click here to accept: ${appUrl}/accept-invitation/${invitationId}
    
    This invitation expires in 7 days.
  `
});
```

## 🧪 Testing

Test the complete workflow:

1. Create organization as User A
2. Verify User A has Org Admin role
3. Send invitations to User B and User C
4. Accept invitations
5. Verify all users are members with correct roles
6. Test permission checks

## 📚 API Reference

See `src/utils/organizationApi.js` for complete API documentation.

## 🎯 Next Steps

1. Create managed objects in PingOne AIC
2. Test API calls on `/api-test` page
3. Build UI for organization management
4. Implement email notifications
5. Add invitation acceptance flow
6. Create organization dashboard

---

**Ready to implement multi-organization user management!** 🚀
