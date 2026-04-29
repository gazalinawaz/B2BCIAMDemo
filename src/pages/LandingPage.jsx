import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

function LandingPage() {
  const { loginWithRedirect, isAuthenticated } = useAuth0()

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '800px',
        width: '100%'
      }}>
        <h1 style={{ 
          fontSize: '4rem', 
          marginBottom: '1rem',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          XYZ Broadband Service
        </h1>
        
        <p style={{ 
          fontSize: '1.5rem', 
          marginBottom: '3rem',
          opacity: 0.9
        }}>
          Fast, Reliable, Affordable Internet
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Ultra Fast</h3>
            <p style={{ opacity: 0.8 }}>Up to 1 Gbps speeds</p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Reliable</h3>
            <p style={{ opacity: 0.8 }}>99.9% uptime guarantee</p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Affordable</h3>
            <p style={{ opacity: 0.8 }}>Best value plans</p>
          </div>
        </div>

        {!isAuthenticated ? (
          <button 
            onClick={() => loginWithRedirect()}
            style={{
              background: 'white',
              color: '#1e3c72',
              border: 'none',
              padding: '1rem 3rem',
              fontSize: '1.2rem',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            Login to Your Account
          </button>
        ) : (
          <button 
            onClick={() => window.location.href = '/dashboard'}
            style={{
              background: 'white',
              color: '#1e3c72',
              border: 'none',
              padding: '1rem 3rem',
              fontSize: '1.2rem',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            Go to Dashboard
          </button>
        )}

        <div style={{ marginTop: '3rem', opacity: 0.7 }}>
          <p>Available 24/7 Customer Support</p>
          <p style={{ marginTop: '0.5rem' }}>📞 1-800-XYZ-BROAD</p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
