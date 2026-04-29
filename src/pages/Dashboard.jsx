import React from 'react'
import { useAuth } from '../contexts/AuthContext'

function Dashboard() {
  const { user, logout, isLoading } = useAuth()
  
  // Debug logging
  console.log('Dashboard - User data:', user)
  console.log('Dashboard - Is loading:', isLoading)

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '5px solid rgba(255,255,255,0.2)',
            borderTop: '5px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1.5rem'
          }}></div>
          <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>Loading your dashboard...</p>
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

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 2rem 4rem'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
            Welcome, {user?.name || user?.given_name || user?.email?.split('@')[0] || 'User'}!
          </h2>
          <p style={{ fontSize: '1rem', color: '#6b7280' }}>
            Manage your broadband service and account settings
          </p>
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
            {user?.city && (
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>City</p>
                <p style={{ color: '#111827', fontSize: '1.1rem', fontWeight: '600' }}>
                  {user.city}
                </p>
              </div>
            )}
            {user?.address?.locality && (
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>City</p>
                <p style={{ color: '#111827', fontSize: '1.1rem', fontWeight: '600' }}>
                  {user.address.locality}
                </p>
              </div>
            )}
          </div>
        </div>
        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {[
            { title: 'Current Plan', value: '500 Mbps', subtitle: 'Fiber Broadband' },
            { title: 'Data Usage', value: '245 GB', subtitle: 'This month' },
            { title: 'Next Billing', value: '$49.99', subtitle: 'Due May 15, 2024' }
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'white',
              borderRadius: '8px',
              padding: '1.5rem',
              border: '1px solid #e5e7eb'
            }}>
              <p style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#6b7280',
                marginBottom: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {stat.title}
              </p>
              <p style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '0.25rem'
              }}>
                {stat.value}
              </p>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                {stat.subtitle}
              </p>
            </div>
          ))}
        </div>

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

        {/* Quick Actions */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '1.5rem',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚙️</div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Settings</h3>
          <p style={{ opacity: 0.8 }}>Configure your account preferences</p>
        </div>
      </div>

      {/* Raw User Data (for debugging) */}
      <details style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '1.5rem',
        color: 'white'
      }}>
        <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '1rem' }}>
          View Raw User Data (Debug)
        </summary>
        <pre style={{
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '1rem',
          borderRadius: '8px',
          overflow: 'auto',
          fontSize: '0.9rem'
        }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      </details>

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
