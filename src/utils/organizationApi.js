/**
 * PingOne AIC Organization API
 * 
 * Handles organization creation, user invitations, and role assignments
 * Based on the organization/project invitation workflow
 */

import { callAicApi } from './aicApi';

const getRealm = () => {
  return import.meta.env.VITE_PINGONE_REALM || 'alpha';
};

// ============================================
// Organization Management
// ============================================

/**
 * Create a new organization
 * The creator automatically becomes the Org Admin
 * @param {object} orgData - Organization data
 * @returns {object} Created organization
 */
export const createOrganization = async (orgData) => {
  const realm = getRealm();
  
  const organization = {
    name: orgData.name,
    description: orgData.description || '',
    ...orgData
  };
  
  return callAicApi(`/openidm/managed/${realm}_organization?_action=create`, {
    method: 'POST',
    body: JSON.stringify(organization),
  });
};

/**
 * Get organization by ID
 * @param {string} orgId - Organization ID
 */
export const getOrganization = async (orgId) => {
  const realm = getRealm();
  return callAicApi(`/openidm/managed/${realm}_organization/${orgId}`);
};

/**
 * Query organizations
 * @param {string} filter - CREST query filter
 */
export const queryOrganizations = async (filter = 'true') => {
  const realm = getRealm();
  return callAicApi(`/openidm/managed/${realm}_organization?_queryFilter=${encodeURIComponent(filter)}`);
};

/**
 * Get organizations for a specific user
 * @param {string} userId - User ID
 */
export const getUserOrganizations = async (userId) => {
  const realm = getRealm();
  // Query organizations where user is a member
  const filter = `members/_ref eq "managed/${realm}_user/${userId}"`;
  return queryOrganizations(filter);
};

/**
 * Update organization
 * @param {string} orgId - Organization ID
 * @param {array} operations - PATCH operations
 */
export const updateOrganization = async (orgId, operations) => {
  const realm = getRealm();
  return callAicApi(`/openidm/managed/${realm}_organization/${orgId}`, {
    method: 'PATCH',
    body: JSON.stringify(operations),
  });
};

/**
 * Delete organization
 * @param {string} orgId - Organization ID
 */
export const deleteOrganization = async (orgId) => {
  const realm = getRealm();
  return callAicApi(`/openidm/managed/${realm}_organization/${orgId}`, {
    method: 'DELETE',
  });
};

// ============================================
// Organization Membership & Roles
// ============================================

/**
 * Add user to organization with a specific role
 * @param {string} orgId - Organization ID
 * @param {string} userId - User ID
 * @param {string} role - Role name (e.g., 'Org Admin', 'Customer Port Admin', 'Customer Port Monitor')
 */
export const addUserToOrganization = async (orgId, userId, role = 'Member') => {
  const realm = getRealm();
  
  const operations = [
    {
      operation: 'add',
      field: '/members/-',
      value: {
        _ref: `managed/${realm}_user/${userId}`,
        role: role
      }
    }
  ];
  
  return updateOrganization(orgId, operations);
};

/**
 * Remove user from organization
 * @param {string} orgId - Organization ID
 * @param {string} userId - User ID
 */
export const removeUserFromOrganization = async (orgId, userId) => {
  const realm = getRealm();
  
  // First, get the organization to find the member index
  const org = await getOrganization(orgId);
  const memberIndex = org.members?.findIndex(m => m._ref === `managed/${realm}_user/${userId}`);
  
  if (memberIndex === -1) {
    throw new Error('User is not a member of this organization');
  }
  
  const operations = [
    {
      operation: 'remove',
      field: `/members/${memberIndex}`
    }
  ];
  
  return updateOrganization(orgId, operations);
};

/**
 * Update user's role in organization
 * @param {string} orgId - Organization ID
 * @param {string} userId - User ID
 * @param {string} newRole - New role name
 */
export const updateUserRole = async (orgId, userId, newRole) => {
  const realm = getRealm();
  
  // Get organization to find member index
  const org = await getOrganization(orgId);
  const memberIndex = org.members?.findIndex(m => m._ref === `managed/${realm}_user/${userId}`);
  
  if (memberIndex === -1) {
    throw new Error('User is not a member of this organization');
  }
  
  const operations = [
    {
      operation: 'replace',
      field: `/members/${memberIndex}/role`,
      value: newRole
    }
  ];
  
  return updateOrganization(orgId, operations);
};

/**
 * Get organization members with their roles
 * @param {string} orgId - Organization ID
 */
export const getOrganizationMembers = async (orgId) => {
  const org = await getOrganization(orgId);
  return org.members || [];
};

// ============================================
// User Invitation Workflow
// ============================================

/**
 * Invite user to organization
 * Creates an invitation record that can be accepted by the user
 * @param {string} orgId - Organization ID
 * @param {string} inviterUserId - ID of user sending invitation
 * @param {string} inviteeEmail - Email of user to invite
 * @param {string} role - Role to assign (e.g., 'Customer Port Admin', 'Customer Port Monitor')
 */
export const inviteUserToOrganization = async (orgId, inviterUserId, inviteeEmail, role) => {
  const realm = getRealm();
  
  // Create invitation record
  const invitation = {
    organizationId: orgId,
    inviterUserId: inviterUserId,
    inviteeEmail: inviteeEmail,
    role: role,
    status: 'pending',
    createdDate: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
  };
  
  // Store invitation (you may need to create a custom managed object for invitations)
  return callAicApi(`/openidm/managed/${realm}_invitation?_action=create`, {
    method: 'POST',
    body: JSON.stringify(invitation),
  });
};

/**
 * Accept organization invitation
 * @param {string} invitationId - Invitation ID
 * @param {string} userId - User ID accepting the invitation
 */
export const acceptInvitation = async (invitationId, userId) => {
  const realm = getRealm();
  
  // Get invitation details
  const invitation = await callAicApi(`/openidm/managed/${realm}_invitation/${invitationId}`);
  
  if (invitation.status !== 'pending') {
    throw new Error('Invitation is no longer valid');
  }
  
  // Check if invitation has expired
  if (new Date(invitation.expiryDate) < new Date()) {
    throw new Error('Invitation has expired');
  }
  
  // Add user to organization with specified role
  await addUserToOrganization(invitation.organizationId, userId, invitation.role);
  
  // Update invitation status
  await callAicApi(`/openidm/managed/${realm}_invitation/${invitationId}`, {
    method: 'PATCH',
    body: JSON.stringify([
      {
        operation: 'replace',
        field: '/status',
        value: 'accepted'
      },
      {
        operation: 'add',
        field: '/acceptedDate',
        value: new Date().toISOString()
      },
      {
        operation: 'add',
        field: '/acceptedByUserId',
        value: userId
      }
    ]),
  });
  
  return { success: true, organizationId: invitation.organizationId };
};

/**
 * Get pending invitations for a user (by email)
 * @param {string} email - User email
 */
export const getPendingInvitations = async (email) => {
  const realm = getRealm();
  const filter = `(inviteeEmail eq "${email}") and (status eq "pending")`;
  return callAicApi(`/openidm/managed/${realm}_invitation?_queryFilter=${encodeURIComponent(filter)}`);
};

/**
 * Get invitations sent by a user
 * @param {string} userId - User ID
 */
export const getSentInvitations = async (userId) => {
  const realm = getRealm();
  const filter = `inviterUserId eq "${userId}"`;
  return callAicApi(`/openidm/managed/${realm}_invitation?_queryFilter=${encodeURIComponent(filter)}`);
};

// ============================================
// Complete Workflow: Create Organization & Assign Admin
// ============================================

/**
 * Create organization and automatically assign creator as Org Admin
 * @param {string} userId - Creator's user ID
 * @param {object} orgData - Organization data
 */
export const createOrganizationWithAdmin = async (userId, orgData) => {
  const realm = getRealm();
  
  // Create organization
  const org = await createOrganization(orgData);
  
  // Add creator as Org Admin
  await addUserToOrganization(org._id, userId, 'Org Admin');
  
  return {
    organization: org,
    adminUserId: userId,
    role: 'Org Admin'
  };
};

/**
 * Complete invitation workflow
 * 1. User A creates organization (becomes Org Admin)
 * 2. User A invites User B with specific role
 * 3. User B accepts invitation (if new user, account is created first)
 * 
 * @param {string} orgId - Organization ID
 * @param {string} inviterUserId - Inviter's user ID
 * @param {string} inviteeEmail - Invitee's email
 * @param {string} role - Role to assign
 */
export const sendOrganizationInvitation = async (orgId, inviterUserId, inviteeEmail, role) => {
  // Create invitation
  const invitation = await inviteUserToOrganization(orgId, inviterUserId, inviteeEmail, role);
  
  // In a real implementation, you would:
  // 1. Send email notification to invitee
  // 2. Include invitation link with invitation ID
  // 3. Handle new user registration if email doesn't exist
  
  return {
    invitation: invitation,
    message: `Invitation sent to ${inviteeEmail} for role: ${role}`,
    invitationId: invitation._id
  };
};

// ============================================
// Helper Functions
// ============================================

/**
 * Check if user is Org Admin of an organization
 * @param {string} orgId - Organization ID
 * @param {string} userId - User ID
 */
export const isOrgAdmin = async (orgId, userId) => {
  const realm = getRealm();
  const org = await getOrganization(orgId);
  
  const member = org.members?.find(m => m._ref === `managed/${realm}_user/${userId}`);
  return member?.role === 'Org Admin';
};

/**
 * Get user's role in organization
 * @param {string} orgId - Organization ID
 * @param {string} userId - User ID
 */
export const getUserRoleInOrganization = async (orgId, userId) => {
  const realm = getRealm();
  const org = await getOrganization(orgId);
  
  const member = org.members?.find(m => m._ref === `managed/${realm}_user/${userId}`);
  return member?.role || null;
};
