/**
 * PingOne AIC API Utility
 * 
 * This module provides functions to call PingOne AIC REST APIs
 * using the authenticated user's access token.
 */

/**
 * Get the current access token from sessionStorage
 */
const getAccessToken = () => {
  const token = sessionStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found. User must be authenticated.');
  }
  return token;
};

/**
 * Get the base URL for PingOne AIC APIs
 */
const getBaseUrl = () => {
  const domain = import.meta.env.VITE_PINGONE_DOMAIN || 'openam-accenture-11-20.forgeblocks.com';
  return `https://${domain}`;
};

/**
 * Get the realm path
 */
const getRealm = () => {
  return import.meta.env.VITE_PINGONE_REALM || 'alpha';
};

/**
 * Generic API call function
 * @param {string} endpoint - API endpoint (e.g., '/openidm/managed/alpha_user')
 * @param {object} options - Fetch options (method, body, etc.)
 */
export const callAicApi = async (endpoint, options = {}) => {
  const accessToken = getAccessToken();
  const baseUrl = getBaseUrl();
  
  const url = `${baseUrl}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, mergedOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('AIC API Error:', error);
    throw error;
  }
};

// ============================================
// IDM (Identity Management) APIs
// ============================================

/**
 * Get current user's profile
 */
export const getCurrentUser = async () => {
  const realm = getRealm();
  return callAicApi(`/openidm/managed/${realm}_user?_queryFilter=true&_fields=*`);
};

/**
 * Update current user's profile
 * @param {string} userId - User ID
 * @param {object} updates - Fields to update
 */
export const updateUserProfile = async (userId, updates) => {
  const realm = getRealm();
  return callAicApi(`/openidm/managed/${realm}_user/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
};

/**
 * Query users
 * @param {string} filter - CREST query filter (e.g., 'userName eq "john"')
 * @param {string} fields - Comma-separated fields to return
 */
export const queryUsers = async (filter = 'true', fields = '*') => {
  const realm = getRealm();
  return callAicApi(`/openidm/managed/${realm}_user?_queryFilter=${encodeURIComponent(filter)}&_fields=${fields}`);
};

/**
 * Get user by ID
 * @param {string} userId - User ID
 */
export const getUserById = async (userId) => {
  const realm = getRealm();
  return callAicApi(`/openidm/managed/${realm}_user/${userId}`);
};

/**
 * Create a new user
 * @param {object} userData - User data
 */
export const createUser = async (userData) => {
  const realm = getRealm();
  return callAicApi(`/openidm/managed/${realm}_user?_action=create`, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

/**
 * Delete a user
 * @param {string} userId - User ID
 */
export const deleteUser = async (userId) => {
  const realm = getRealm();
  return callAicApi(`/openidm/managed/${realm}_user/${userId}`, {
    method: 'DELETE',
  });
};

// ============================================
// Group Management APIs
// ============================================

/**
 * Query groups
 * @param {string} filter - CREST query filter
 */
export const queryGroups = async (filter = 'true') => {
  const realm = getRealm();
  return callAicApi(`/openidm/managed/${realm}_group?_queryFilter=${encodeURIComponent(filter)}`);
};

/**
 * Get group by ID
 * @param {string} groupId - Group ID
 */
export const getGroupById = async (groupId) => {
  const realm = getRealm();
  return callAicApi(`/openidm/managed/${realm}_group/${groupId}`);
};

/**
 * Add user to group
 * @param {string} groupId - Group ID
 * @param {string} userId - User ID
 */
export const addUserToGroup = async (groupId, userId) => {
  const realm = getRealm();
  return callAicApi(`/openidm/managed/${realm}_group/${groupId}`, {
    method: 'PATCH',
    body: JSON.stringify([
      {
        operation: 'add',
        field: '/members/-',
        value: { _ref: `managed/${realm}_user/${userId}` }
      }
    ]),
  });
};

// ============================================
// AM (Access Management) APIs
// ============================================

/**
 * Get UserInfo (current authenticated user)
 */
export const getUserInfo = async () => {
  const realm = getRealm();
  return callAicApi(`/am/oauth2/realms/${realm}/userinfo`);
};

/**
 * Validate access token
 */
export const validateToken = async () => {
  const accessToken = getAccessToken();
  const realm = getRealm();
  return callAicApi(`/am/oauth2/realms/${realm}/introspect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `token=${accessToken}`,
  });
};

/**
 * Get user's sessions
 */
export const getUserSessions = async () => {
  const realm = getRealm();
  return callAicApi(`/am/json/realms/${realm}/sessions?_action=getSessionInfo`, {
    method: 'POST',
  });
};

// ============================================
// Custom Managed Objects (e.g., Organizations)
// ============================================

/**
 * Query custom managed objects
 * @param {string} objectType - Object type (e.g., 'alpha_organization')
 * @param {string} filter - CREST query filter
 */
export const queryManagedObjects = async (objectType, filter = 'true') => {
  return callAicApi(`/openidm/managed/${objectType}?_queryFilter=${encodeURIComponent(filter)}`);
};

/**
 * Get managed object by ID
 * @param {string} objectType - Object type
 * @param {string} objectId - Object ID
 */
export const getManagedObjectById = async (objectType, objectId) => {
  return callAicApi(`/openidm/managed/${objectType}/${objectId}`);
};

/**
 * Create managed object
 * @param {string} objectType - Object type
 * @param {object} data - Object data
 */
export const createManagedObject = async (objectType, data) => {
  return callAicApi(`/openidm/managed/${objectType}?_action=create`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Update managed object
 * @param {string} objectType - Object type
 * @param {string} objectId - Object ID
 * @param {object} updates - Fields to update
 */
export const updateManagedObject = async (objectType, objectId, updates) => {
  return callAicApi(`/openidm/managed/${objectType}/${objectId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
};

/**
 * Delete managed object
 * @param {string} objectType - Object type
 * @param {string} objectId - Object ID
 */
export const deleteManagedObject = async (objectType, objectId) => {
  return callAicApi(`/openidm/managed/${objectType}/${objectId}`, {
    method: 'DELETE',
  });
};

// ============================================
// Example Usage
// ============================================

/**
 * Example: Get current user and their groups
 */
export const getCurrentUserWithGroups = async () => {
  try {
    const userInfo = await getUserInfo();
    console.log('Current user:', userInfo);
    
    // If user has groups in token, fetch full group details
    if (userInfo.groups && userInfo.groups.length > 0) {
      const groupPromises = userInfo.groups.map(groupName => 
        queryGroups(`name eq "${groupName}"`)
      );
      const groups = await Promise.all(groupPromises);
      console.log('User groups:', groups);
      return { user: userInfo, groups };
    }
    
    return { user: userInfo, groups: [] };
  } catch (error) {
    console.error('Error fetching user with groups:', error);
    throw error;
  }
};

/**
 * Example: Search users by email
 */
export const searchUsersByEmail = async (email) => {
  try {
    const filter = `mail co "${email}"`;
    const result = await queryUsers(filter, 'userName,mail,givenName,sn');
    console.log('Search results:', result);
    return result;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};
