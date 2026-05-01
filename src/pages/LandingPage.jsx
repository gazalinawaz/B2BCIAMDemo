import React from 'react'
import { useAuth } from '../contexts/AuthContext'

function LandingPage() {
  const { login } = useAuth()

  const handleSignIn = () => {
    login()
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>

      {/* Navigation */}
      <nav style={{
        padding: '1rem 0',
        borderBottom: '1px solid #e5e7eb',
        background: '#ffffff'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1f2937',
            letterSpacing: '-0.5px'
          }}>
            XYZ Broadband
          </div>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href="#plans" style={{ color: '#4b5563', textDecoration: 'none', fontSize: '0.95rem' }}>Plans</a>
            <a href="#support" style={{ color: '#4b5563', textDecoration: 'none', fontSize: '0.95rem' }}>Support</a>
            <a href="#about" style={{ color: '#4b5563', textDecoration: 'none', fontSize: '0.95rem' }}>About</a>
            {!isAuthenticated && (
              <button 
                onClick={login}
                style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '0.625rem 1.25rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '0.95rem'
                }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '5rem 2rem 4rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '1.5rem',
              lineHeight: '1.2',
              letterSpacing: '-1px'
            }}>
              Fast, Reliable Broadband for Your Home
            </h1>
            
            <p style={{
              fontSize: '1.125rem',
              color: '#6b7280',
              marginBottom: '2rem',
              lineHeight: '1.7'
            }}>
              Get fiber-optic internet with speeds up to 1 Gbps. No contracts, no hidden fees. Just fast, dependable internet.
            </p>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              {!isAuthenticated ? (
                <button 
                  onClick={login}
                  style={{
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '0.875rem 2rem',
                    fontSize: '1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  View Plans
                </button>
              ) : (
                <a 
                  href="/dashboard"
                  style={{
                    display: 'inline-block',
                    background: '#2563eb',
                    color: 'white',
                    padding: '0.875rem 2rem',
                    fontSize: '1rem',
                    borderRadius: '6px',
                    fontWeight: '500',
                    textDecoration: 'none'
                  }}
                >
                  Go to Dashboard
                </a>
              )}
              <button style={{
                background: 'white',
                color: '#374151',
                border: '1px solid #d1d5db',
                padding: '0.875rem 2rem',
                fontSize: '1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}>
                Contact Sales
              </button>
            </div>
            
            <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
              ✓ No setup fees  ✓ 30-day money back  ✓ 24/7 support
            </p>
          </div>
          
          <div style={{
            background: '#f9fafb',
            padding: '3rem',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>
              Popular Plans
            </h3>
            {[
              { speed: '100 Mbps', price: '$29.99', desc: 'Perfect for browsing and streaming' },
              { speed: '500 Mbps', price: '$49.99', desc: 'Great for families and gaming', popular: true },
              { speed: '1 Gbps', price: '$79.99', desc: 'Ultimate speed for power users' }
            ].map((plan, i) => (
              <div key={i} style={{
                background: 'white',
                padding: '1.25rem',
                marginBottom: '0.75rem',
                borderRadius: '6px',
                border: plan.popular ? '2px solid #2563eb' : '1px solid #e5e7eb',
                position: 'relative'
              }}>
                {plan.popular && (
                  <span style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '1rem',
                    background: '#2563eb',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.75rem',
                    borderRadius: '4px',
                    fontWeight: '600'
                  }}>MOST POPULAR</span>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>{plan.speed}</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2563eb' }}>{plan.price}<span style={{ fontSize: '0.875rem', fontWeight: '400', color: '#6b7280' }}>/mo</span></span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>{plan.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ background: '#f9fafb', padding: '4rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: '3rem' }}>
            Why Choose XYZ Broadband?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem'
          }}>
            {[
              { title: 'Reliable Connection', desc: '99.9% uptime guarantee with fiber-optic technology' },
              { title: 'No Contracts', desc: 'Month-to-month service with no long-term commitment' },
              { title: 'Local Support', desc: 'US-based customer service available 24/7' },
              { title: 'Easy Installation', desc: 'Professional setup included with every plan' },
              { title: 'Transparent Pricing', desc: 'No hidden fees or surprise charges' },
              { title: 'Unlimited Data', desc: 'No caps, no throttling, no limits' }
            ].map((feature, i) => (
              <div key={i} style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '6px',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '0.5rem'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: '#6b7280',
                  fontSize: '0.9375rem',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer style={{ background: '#111827', color: '#9ca3af', padding: '3rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <p style={{ marginBottom: '1rem', fontSize: '0.9375rem' }}>© 2024 XYZ Broadband. All rights reserved.</p>
          <p style={{ fontSize: '0.875rem' }}>Questions? Call us at 1-800-XYZ-BROAD</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
