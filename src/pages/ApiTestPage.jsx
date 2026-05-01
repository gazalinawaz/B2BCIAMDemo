import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getUserInfo,
  queryUsers,
  queryGroups,
  getCurrentUserWithGroups,
  validateToken,
  queryManagedObjects,
} from '../utils/aicApi';

function ApiTestPage() {
  const { user, logout } = useAuth();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runApiTest = async (testName, apiCall) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log(`Running test: ${testName}`);
      const data = await apiCall();
      console.log(`${testName} result:`, data);
      setResult({ testName, data });
    } catch (err) {
      console.error(`${testName} error:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const tests = [
    {
      name: 'Get UserInfo',
      description: 'Fetch current user information from UserInfo endpoint',
      action: () => runApiTest('UserInfo', getUserInfo),
    },
    {
      name: 'Validate Token',
      description: 'Check if access token is valid',
      action: () => runApiTest('Token Validation', validateToken),
    },
    {
      name: 'Get Current User with Groups',
      description: 'Fetch user info and expand group details',
      action: () => runApiTest('User with Groups', getCurrentUserWithGroups),
    },
    {
      name: 'Query All Users',
      description: 'Get all users in the realm (limited fields)',
      action: () => runApiTest('All Users', () => 
        queryUsers('true', 'userName,mail,givenName,sn')
      ),
    },
    {
      name: 'Search Users by Email Domain',
      description: 'Find users with @example.com email',
      action: () => runApiTest('Search Users', () => 
        queryUsers('mail co "example.com"', 'userName,mail')
      ),
    },
    {
      name: 'Query All Groups',
      description: 'Get all groups in the realm',
      action: () => runApiTest('All Groups', () => queryGroups('true')),
    },
    {
      name: 'Search Broadband Groups',
      description: 'Find groups with "broadband" in the name',
      action: () => runApiTest('Broadband Groups', () => 
        queryGroups('name co "broadband"')
      ),
    },
    {
      name: 'Query Organizations',
      description: 'Get all organizations (if available)',
      action: () => runApiTest('Organizations', () => 
        queryManagedObjects('alpha_organization', 'true')
      ),
    },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9fafb',
      padding: '2rem'
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '1.5rem',
          border: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
              PingOne AIC API Test Page
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Logged in as: <strong>{user?.email || 'Unknown'}</strong>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => window.location.href = '/dashboard'}
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
              Back to Dashboard
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
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem'
        }}>
          {/* Test Buttons */}
          <div>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '1rem'
            }}>
              Available API Tests
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tests.map((test, index) => (
                <div
                  key={index}
                  style={{
                    background: 'white',
                    borderRadius: '8px',
                    padding: '1.25rem',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '0.5rem'
                  }}>
                    {test.name}
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    marginBottom: '1rem'
                  }}>
                    {test.description}
                  </p>
                  <button
                    onClick={test.action}
                    disabled={loading}
                    style={{
                      background: loading ? '#9ca3af' : '#667eea',
                      color: 'white',
                      border: 'none',
                      padding: '0.625rem 1.25rem',
                      borderRadius: '6px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontWeight: '500',
                      fontSize: '0.95rem',
                      width: '100%'
                    }}
                  >
                    {loading ? 'Running...' : 'Run Test'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Results Panel */}
          <div>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '1rem'
            }}>
              Test Results
            </h2>
            <div style={{
              background: 'white',
              borderRadius: '8px',
              padding: '1.5rem',
              border: '1px solid #e5e7eb',
              minHeight: '500px'
            }}>
              {loading && (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #e5e7eb',
                    borderTop: '4px solid #667eea',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 1rem'
                  }}></div>
                  <p style={{ color: '#6b7280' }}>Running API test...</p>
                </div>
              )}

              {error && (
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '6px',
                  padding: '1rem',
                  marginBottom: '1rem'
                }}>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#dc2626',
                    marginBottom: '0.5rem'
                  }}>
                    ❌ Error
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#991b1b' }}>
                    {error}
                  </p>
                </div>
              )}

              {result && (
                <div>
                  <div style={{
                    background: '#f0fdf4',
                    border: '1px solid #86efac',
                    borderRadius: '6px',
                    padding: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#16a34a',
                      marginBottom: '0.5rem'
                    }}>
                      ✅ {result.testName}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#166534' }}>
                      API call successful! Check console for full details.
                    </p>
                  </div>

                  <div style={{
                    background: '#f9fafb',
                    borderRadius: '6px',
                    padding: '1rem',
                    maxHeight: '400px',
                    overflow: 'auto'
                  }}>
                    <h4 style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      Response Data:
                    </h4>
                    <pre style={{
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                      color: '#1f2937',
                      margin: 0
                    }}>
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {!loading && !error && !result && (
                <div style={{
                  textAlign: 'center',
                  padding: '3rem',
                  color: '#9ca3af'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧪</div>
                  <p style={{ fontSize: '1rem' }}>
                    Select a test from the left to run an API call
                  </p>
                  <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    Results will appear here
                  </p>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              padding: '1rem',
              marginTop: '1rem'
            }}>
              <h4 style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#1e40af',
                marginBottom: '0.5rem'
              }}>
                💡 Tip
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#1e3a8a' }}>
                Open the browser console (F12) to see detailed API request/response logs.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default ApiTestPage;
