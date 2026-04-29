import React from 'react'
import { useAuth } from '../contexts/AuthContext'

function Dashboard() {
  const { user, logout, isLoading } = useAuth()

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
      background: '#f9fafb'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ color: 'white' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.5rem'
            }}>
              <span style={{ fontSize: '2rem' }}>⚡</span>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>XYZ Broadband</h1>
            </div>
            <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>
              Welcome back, <strong>{user?.name || user?.email || 'User'}</strong>!
            </p>
          </div>
          <button
            onClick={logout}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              padding: '0.875rem 1.75rem',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              backdropFilter: 'blur(10px)',
              fontSize: '1rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'translateY(0)';
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
        padding: '2rem'
      }}>
        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {[
            { icon: '📊', title: 'Current Plan', value: '500 Mbps', subtitle: 'Fiber Broadband', color: '#667eea' },
            { icon: '📈', title: 'Data Usage', value: '245 GB', subtitle: 'This month', color: '#34d399' },
            { icon: '💳', title: 'Next Billing', value: '$49.99', subtitle: 'Due May 15, 2024', color: '#f59e0b' }
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              border: '1px solid #e5e7eb',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  filter: `drop-shadow(0 2px 4px ${stat.color})`
                }}>
                  {stat.icon}
                </div>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {stat.title}
                </h3>
              </div>
              <p style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: stat.color,
                marginBottom: '0.25rem'
              }}>
                {stat.value}
              </p>
              <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>
                {stat.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Account Info Card */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          border: '1px solid #e5e7eb',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>👤</span> Account Information
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Email Address</p>
              <p style={{ color: '#1f2937', fontSize: '1.1rem', fontWeight: '600' }}>
                {user?.email || 'N/A'}
              </p>
            </div>
            <div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>User ID</p>
              <p style={{ color: '#1f2937', fontSize: '1.1rem', fontWeight: '600', fontFamily: 'monospace' }}>
                {user?.sub?.substring(0, 20) || 'N/A'}...
              </p>
            </div>
            <div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Account Status</p>
              <p style={{
                color: '#10b981',
                fontSize: '1.1rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  background: '#10b981',
                  borderRadius: '50%',
                  display: 'inline-block'
                }}></span>
                Active
              </p>
            </div>
          </div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Billing</h3>
          <p style={{ opacity: 0.8 }}>Manage payments and invoices</p>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '2rem',
          color: 'white'
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
