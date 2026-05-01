import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { hasFeatureAccess } from '../utils/planAccess';

/**
 * Feature Card Component
 * Shows/hides features based on user's plan authorization
 */
function FeatureCard({ 
  title, 
  description, 
  icon, 
  requiredFeature, 
  onClick,
  locked = false 
}) {
  const { user } = useAuth();
  const hasAccess = requiredFeature ? hasFeatureAccess(user, requiredFeature) : true;
  const isLocked = locked || !hasAccess;

  return (
    <div 
      onClick={!isLocked ? onClick : undefined}
      style={{
        background: isLocked ? '#f9fafb' : 'white',
        borderRadius: '8px',
        padding: '1.5rem',
        border: `1px solid ${isLocked ? '#e5e7eb' : '#d1d5db'}`,
        cursor: isLocked ? 'not-allowed' : onClick ? 'pointer' : 'default',
        opacity: isLocked ? 0.6 : 1,
        position: 'relative',
        transition: 'all 0.2s',
        ...(onClick && !isLocked && {
          ':hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-2px)'
          }
        })
      }}
    >
      {isLocked && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: '#ef4444',
          color: 'white',
          padding: '0.25rem 0.75rem',
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontWeight: '600'
        }}>
          🔒 Upgrade Required
        </div>
      )}
      
      <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
        {icon}
      </div>
      
      <h3 style={{
        fontSize: '1.125rem',
        fontWeight: '600',
        color: isLocked ? '#9ca3af' : '#111827',
        marginBottom: '0.5rem'
      }}>
        {title}
      </h3>
      
      <p style={{
        fontSize: '0.875rem',
        color: isLocked ? '#9ca3af' : '#6b7280',
        lineHeight: '1.5'
      }}>
        {description}
      </p>
    </div>
  );
}

export default FeatureCard;
