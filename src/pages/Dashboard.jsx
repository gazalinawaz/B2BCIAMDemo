import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getUserPlanDetails } from '../utils/planAccess'
import FeatureCard from '../components/FeatureCard'

function Dashboard() {
  const { user, logout, isLoading } = useAuth()
  
  // Get user's plan details for authorization
  const planDetails = user ? getUserPlanDetails(user) : null

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '5px solid #e5e7eb',
            borderTop: '5px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1.5rem'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '1rem', fontWeight: '500' }}>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff'
    }}>
      {/* Header */}
      <div style={{
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
              XYZ Broadband
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              {user?.email || 'User Account'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => window.location.href = '/organizations'}
              style={{
                background: '#10b981',
                color: 'white',
                border: 'none',
                padding: '0.625rem 1.25rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.95rem'
              }}
            >
              🏢 Organizations
            </button>
            <button
              onClick={() => window.location.href = '/api-test'}
              style={{
                background: '#667eea',
                color: 'white',
                border: 'none',
                padding: '0.625rem 1.25rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.95rem'
              }}
            >
              🧪 Test APIs
            </button>
            <button
              onClick={logout}
              style={{
                background: 'white',
                color: '#374151',
                border: '1px solid #d1d5db',
                padding: '0.625rem 1.25rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.95rem'
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 2rem 4rem'
      }}>
        {/* Greeting */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
            Welcome, {user?.name || user?.given_name || user?.email?.split('@')[0] || 'User'}!
          </h2>
          <p style={{ fontSize: '1rem', color: '#6b7280' }}>
            Here's your broadband service overview
          </p>
        </div>
        {/* Plan Banner */}
        {planDetails ? (
          <div style={{
            background: planDetails.color,
            backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem',
            color: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem', fontWeight: '600' }}>
                YOUR CURRENT PLAN
              </p>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                {planDetails.name}
              </h2>
              <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>
                {planDetails.speed} • {planDetails.price}
              </p>
              <p style={{ fontSize: '1rem', opacity: 0.85, marginTop: '0.5rem' }}>
                ✨ You have purchased the <strong>{planDetails.name}</strong> package
              </p>
            </div>
            
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '8px',
              padding: '1rem',
              backdropFilter: 'blur(10px)'
            }}>
              <p style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                ✓ Included Features:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                {planDetails.features.map((feature, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>✓</span>
                    <span style={{ fontSize: '0.875rem' }}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            background: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#92400e', marginBottom: '0.5rem' }}>
              No Active Plan
            </h2>
            <p style={{ fontSize: '1rem', color: '#78350f' }}>
              You don't have any active broadband plan. Please contact support to subscribe.
            </p>
          </div>
        )}

        {/* Feature Access Grid */}
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '0.5rem'
        }}>
          Available Features
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
          🔐 Features shown based on your plan authorization
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <FeatureCard
            title="Usage Dashboard"
            description="View your data usage and connection statistics"
            icon="📊"
            requiredFeature={null}
            onClick={() => alert('✅ Access Granted: Opening Usage Dashboard...')}
          />
          
          <FeatureCard
            title="Billing Management"
            description="Manage payments, invoices, and billing history"
            icon="💳"
            requiredFeature="canAccessBilling"
            onClick={() => alert('✅ Access Granted: Opening Billing Management...')}
          />
          
          <FeatureCard
            title="Advanced Settings"
            description="Configure network settings and security options"
            icon="⚙️"
            requiredFeature="canAccessAdvancedSettings"
            onClick={() => alert('✅ Access Granted: Opening Advanced Settings...')}
          />
          
          <FeatureCard
            title="Priority Support"
            description="24/7 priority customer support and live chat"
            icon="🎧"
            requiredFeature="canAccessPrioritySupport"
            onClick={() => alert('✅ Access Granted: Opening Priority Support...')}
          />
          
          <FeatureCard
            title="Analytics & Reports"
            description="Detailed analytics and usage reports"
            icon="📈"
            requiredFeature="canAccessAnalytics"
            onClick={() => alert('✅ Access Granted: Opening Analytics...')}
          />
          
          <FeatureCard
            title="API Access"
            description="Developer API for custom integrations"
            icon="🔌"
            requiredFeature="canAccessAdvancedSettings"
            onClick={() => alert('✅ Access Granted: Opening API Documentation...')}
          />
        </div>

        {/* User Profile Card */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '1.5rem',
          border: '1px solid #e5e7eb',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1.25rem'
          }}>
            Profile Information
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {user?.name && (
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Full Name</p>
                <p style={{ color: '#111827', fontSize: '1.1rem', fontWeight: '600' }}>
                  {user.name}
                </p>
              </div>
            )}
            {user?.email && (
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Email Address</p>
                <p style={{ color: '#111827', fontSize: '1.1rem', fontWeight: '600' }}>
                  {user.email}
                </p>
              </div>
            )}
            {user?.sub && (
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>User ID</p>
                <p style={{ color: '#111827', fontSize: '0.875rem', fontWeight: '600', fontFamily: 'monospace' }}>
                  {user.sub.substring(0, 30)}...
                </p>
              </div>
            )}
            {user?.realm && (
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Realm</p>
                <p style={{ color: '#111827', fontSize: '1.1rem', fontWeight: '600' }}>
                  {user.realm}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Groups Section */}
        {(user?.groups || user?.group) && (
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '1rem'
            }}>
              Groups & Roles
            </h3>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              {(Array.isArray(user.groups) ? user.groups : Array.isArray(user.group) ? user.group : [user.groups || user.group]).map((group, index) => (
                <span
                  key={index}
                  style={{
                    background: '#f3f4f6',
                    color: '#374151',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  {typeof group === 'string' ? group : group.name || group._id || JSON.stringify(group)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Token Information (for debugging) */}
        <details style={{
          background: 'white',
          borderRadius: '8px',
          padding: '1.5rem',
          border: '1px solid #e5e7eb',
          marginBottom: '1.5rem',
          cursor: 'pointer'
        }}>
          <summary style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1rem'
          }}>
            Token Details (Click to expand)
          </summary>
          <div style={{
            background: '#f9fafb',
            padding: '1rem',
            borderRadius: '6px',
            marginTop: '1rem'
          }}>
            <pre style={{
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              color: '#374151',
              margin: 0
            }}>
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </details>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default Dashboard
