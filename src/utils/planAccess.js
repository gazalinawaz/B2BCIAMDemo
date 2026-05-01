// Plan-based Access Control
// This demonstrates PingOne AIC authorization based on user's broadband plan

export const PLANS = {
  SIMPLE: 'simple',
  MEDIUM: 'medium',
  LARGE: 'large'
};

export const PLAN_FEATURES = {
  [PLANS.SIMPLE]: {
    name: 'Simple Plan',
    speed: '100 Mbps',
    price: '$29.99/month',
    color: '#10b981', // green
    features: [
      'Basic Internet Access',
      'Email Support',
      'Standard Security',
      'Usage Dashboard'
    ],
    accessLevel: 1,
    canAccessBilling: false,
    canAccessAdvancedSettings: false,
    canAccessPrioritySupport: false,
    canAccessAnalytics: false
  },
  [PLANS.MEDIUM]: {
    name: 'Medium Plan',
    speed: '500 Mbps',
    price: '$49.99/month',
    color: '#3b82f6', // blue
    features: [
      'High-Speed Internet',
      'Priority Email Support',
      'Advanced Security',
      'Usage Dashboard',
      'Billing Management',
      'Basic Analytics'
    ],
    accessLevel: 2,
    canAccessBilling: true,
    canAccessAdvancedSettings: false,
    canAccessPrioritySupport: true,
    canAccessAnalytics: true
  },
  [PLANS.LARGE]: {
    name: 'Large Plan',
    speed: '1 Gbps',
    price: '$79.99/month',
    color: '#8b5cf6', // purple
    features: [
      'Ultra-Fast Internet',
      '24/7 Priority Support',
      'Enterprise Security',
      'Advanced Dashboard',
      'Full Billing Control',
      'Advanced Analytics',
      'Custom Settings',
      'API Access'
    ],
    accessLevel: 3,
    canAccessBilling: true,
    canAccessAdvancedSettings: true,
    canAccessPrioritySupport: true,
    canAccessAnalytics: true
  }
};

/**
 * Get user's plan from their profile
 * Checks multiple possible claim locations
 */
export const getUserPlan = (user) => {
  if (!user) return null;
  
  // Check various possible locations for plan information
  const plan = user.plan || 
               user.broadbandPlan || 
               user.subscription?.plan ||
               user.attributes?.plan;
  
  // Check if user has a group that indicates their plan
  if (user.groups || user.group) {
    const groups = Array.isArray(user.groups) ? user.groups : 
                   Array.isArray(user.group) ? user.group : 
                   [user.groups || user.group];
    
    const planGroup = groups.find(g => {
      const groupName = typeof g === 'string' ? g.toLowerCase() : (g.name || '').toLowerCase();
      return groupName.includes('simple') || 
             groupName.includes('medium') || 
             groupName.includes('large');
    });
    
    if (planGroup) {
      const groupName = typeof planGroup === 'string' ? planGroup : planGroup.name;
      if (groupName.toLowerCase().includes('simple')) return PLANS.SIMPLE;
      if (groupName.toLowerCase().includes('medium')) return PLANS.MEDIUM;
      if (groupName.toLowerCase().includes('large')) return PLANS.LARGE;
    }
  }
  
  // Return null if no plan found (user has no active plan)
  return plan?.toLowerCase() || null;
};

/**
 * Get plan details for a user
 */
export const getUserPlanDetails = (user) => {
  const userPlan = getUserPlan(user);
  return userPlan ? PLAN_FEATURES[userPlan] : null;
};

/**
 * Check if user has access to a specific feature
 */
export const hasFeatureAccess = (user, feature) => {
  const planDetails = getUserPlanDetails(user);
  return planDetails[feature] === true;
};

/**
 * Check if user's plan meets minimum access level
 */
export const hasMinimumAccessLevel = (user, requiredLevel) => {
  const planDetails = getUserPlanDetails(user);
  return planDetails.accessLevel >= requiredLevel;
};
