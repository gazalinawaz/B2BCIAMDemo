/**
 * Decode JWT token utility
 */

/**
 * Decode a JWT token and return the payload
 * @param {string} token - JWT token
 * @returns {object} Decoded payload
 */
export const decodeJWT = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }
    
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    throw error;
  }
};

/**
 * Get groups from access token
 * @param {string} accessToken - Access token
 * @returns {array} Array of group names
 */
export const getGroupsFromToken = (accessToken) => {
  try {
    const payload = decodeJWT(accessToken);
    return payload.groups || [];
  } catch (error) {
    console.error('Error extracting groups from token:', error);
    return [];
  }
};

/**
 * Get all claims from access token
 * @param {string} accessToken - Access token
 * @returns {object} Token payload with all claims
 */
export const getTokenClaims = (accessToken) => {
  try {
    return decodeJWT(accessToken);
  } catch (error) {
    console.error('Error getting token claims:', error);
    return {};
  }
};
