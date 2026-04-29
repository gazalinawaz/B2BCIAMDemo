import React from 'react'
import { useAuth } from '../contexts/AuthContext'

function LandingPage() {
  const { login, isAuthenticated } = useAuth()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background shapes */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '500px',
        height: '500px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 6s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-5%',
        width: '400px',
        height: '400px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 8s ease-in-out infinite reverse'
      }}></div>

      {/* Navigation */}
      <nav style={{
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '2rem' }}>⚡</span>
          XYZ Broadband
        </div>
        {!isAuthenticated && (
          <button 
            onClick={login}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              backdropFilter: 'blur(10px)',
              fontSize: '1rem'
            }}
          >
            Sign In
          </button>
        )}
      </nav>

      {/* Hero Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10,
        minHeight: 'calc(100vh - 100px)'
      }}>
        <div style={{ maxWidth: '900px' }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: '800',
            color: 'white',
            marginBottom: '1.5rem',
            lineHeight: '1.1',
            textShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            Experience Internet at
            <span style={{
              display: 'block',
              background: 'linear-gradient(90deg, #fff 0%, #f0f0f0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Lightning Speed
            </span>
          </h1>
          
          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '3rem',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto 3rem'
          }}>
            Ultra-fast fiber broadband for homes and businesses. Stream, game, and work without limits.
          </p>

          {!isAuthenticated ? (
            <button 
              onClick={login}
              style={{
                background: 'white',
                color: '#667eea',
                border: 'none',
                padding: '1.25rem 3rem',
                fontSize: '1.2rem',
                borderRadius: '16px',
                cursor: 'pointer',
                fontWeight: '700',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                marginBottom: '4rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px)';
                e.target.style.boxShadow = '0 15px 50px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 40px rgba(0,0,0,0.2)';
              }}
            >
              Get Started →
            </button>
          ) : (
            <a 
              href="/dashboard"
              style={{
                display: 'inline-block',
                background: 'white',
                color: '#667eea',
                padding: '1.25rem 3rem',
                fontSize: '1.2rem',
                borderRadius: '16px',
                fontWeight: '700',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                textDecoration: 'none',
                marginBottom: '4rem'
              }}
            >
              Go to Dashboard →
            </a>
          )}

          {/* Feature Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginTop: '4rem'
          }}>
            {[
              { icon: '⚡', title: 'Ultra Fast', desc: 'Up to 1 Gbps speed', color: '#fbbf24' },
              { icon: '🔒', title: 'Secure', desc: 'Enterprise security', color: '#34d399' },
              { icon: '💎', title: 'Premium', desc: '24/7 support', color: '#60a5fa' }
            ].map((feature, i) => (
              <div key={i} style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem',
                  filter: `drop-shadow(0 4px 8px ${feature.color})`
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '0.5rem'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1rem'
                }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
          <p>Available 24/7 Customer Support</p>
          <p style={{ marginTop: '0.5rem' }}>📞 1-800-XYZ-BROAD</p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
