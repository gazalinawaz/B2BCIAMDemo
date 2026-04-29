import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

function Dashboard() {
  const { user, logout, isLoading } = useAuth0()

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      padding: '2rem'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>XYZ Broadband Dashboard</h1>
          <p style={{ opacity: 0.8 }}>Welcome back, {user?.name || user?.email}!</p>
        </div>
        <button
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.3)'
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)'
          }}
        >
          Logout
        </button>
      </div>

      {/* User Info Card */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        color: 'white'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Account Information</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div>
            <p style={{ opacity: 0.7, marginBottom: '0.5rem' }}>Name</p>
            <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{user?.name || 'N/A'}</p>
          </div>
          <div>
            <p style={{ opacity: 0.7, marginBottom: '0.5rem' }}>Email</p>
            <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{user?.email || 'N/A'}</p>
          </div>
          <div>
            <p style={{ opacity: 0.7, marginBottom: '0.5rem' }}>User ID</p>
            <p style={{ fontSize: '1.1rem', fontWeight: 'bold', wordBreak: 'break-all' }}>
              {user?.sub?.substring(0, 20)}...
            </p>
          </div>
        </div>
      </div>

      {/* Service Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '2rem',
          color: 'white'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Usage Statistics</h3>
          <p style={{ opacity: 0.8 }}>View your data usage and bandwidth</p>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '2rem',
          color: 'white'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💳</div>
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
