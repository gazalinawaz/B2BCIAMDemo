import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserInfo, callAicApi } from '../utils/aicApi';

function ProfilePage() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editing, setEditing] = useState(false);
  
  // User data
  const [userProfile, setUserProfile] = useState(null);
  const [userOrgs, setUserOrgs] = useState([]);
  
  // Form data
  const [formData, setFormData] = useState({
    givenName: '',
    sn: '',
    mail: '',
    telephoneNumber: '',
    city: '',
    postalAddress: '',
    stateProvince: '',
    postalCode: '',
    country: '',
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userInfo = await getUserInfo();
      const userId = userInfo.sub;
      
      // Get full user profile
      const profile = await callAicApi(
        `/openidm/managed/alpha_user/${userId}`
      );
      
      setUserProfile(profile);
      
      // Set form data
      setFormData({
        givenName: profile.givenName || '',
        sn: profile.sn || '',
        mail: profile.mail || '',
        telephoneNumber: profile.telephoneNumber || '',
        city: profile.city || '',
        postalAddress: profile.postalAddress || '',
        stateProvince: profile.stateProvince || '',
        postalCode: profile.postalCode || '',
        country: profile.country || '',
      });
      
      // Load user's organizations
      if (profile.memberOfOrgIDs && profile.memberOfOrgIDs.length > 0) {
        const orgPromises = profile.memberOfOrgIDs.map(orgId =>
          callAicApi(`/openidm/managed/alpha_organization/${orgId}`)
            .catch(() => null)
        );
        const orgs = await Promise.all(orgPromises);
        setUserOrgs(orgs.filter(org => org !== null));
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const userInfo = await getUserInfo();
      const userId = userInfo.sub;
      
      // Update user profile
      await callAicApi(`/openidm/managed/alpha_user/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify([
          { operation: 'replace', field: '/givenName', value: formData.givenName },
          { operation: 'replace', field: '/sn', value: formData.sn },
          { operation: 'replace', field: '/telephoneNumber', value: formData.telephoneNumber },
          { operation: 'replace', field: '/city', value: formData.city },
          { operation: 'replace', field: '/postalAddress', value: formData.postalAddress },
          { operation: 'replace', field: '/stateProvince', value: formData.stateProvince },
          { operation: 'replace', field: '/postalCode', value: formData.postalCode },
          { operation: 'replace', field: '/country', value: formData.country },
        ]),
      });
      
      setSuccess('Profile updated successfully!');
      setEditing(false);
      await loadUserProfile();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setError(null);
    setSuccess(null);
    // Reset form data
    if (userProfile) {
      setFormData({
        givenName: userProfile.givenName || '',
        sn: userProfile.sn || '',
        mail: userProfile.mail || '',
        telephoneNumber: userProfile.telephoneNumber || '',
        city: userProfile.city || '',
        postalAddress: userProfile.postalAddress || '',
        stateProvince: userProfile.stateProvince || '',
        postalCode: userProfile.postalCode || '',
        country: userProfile.country || '',
      });
    }
  };

  if (loading && !userProfile) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Header */}
      <div style={{
        background: 'white',
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
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              👤 My Profile
            </h1>
            <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
              {userProfile?.mail}
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
                background: '#ef4444',
                color: 'white',
                border: 'none',
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
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        
        {/* Error/Success Messages */}
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            padding: '1rem',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            ❌ {error}
          </div>
        )}
        
        {success && (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#166534',
            padding: '1rem',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            ✅ {success}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          {/* Profile Information */}
          <div style={{
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            padding: '2rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
                Profile Information
              </h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  style={{
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  ✏️ Edit Profile
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSave}>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="givenName"
                      value={formData.givenName}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="sn"
                      value={formData.sn}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                      Email (Read-only)
                    </label>
                    <input
                      type="email"
                      value={formData.mail}
                      disabled
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        background: '#f9fafb',
                        color: '#6b7280'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="telephoneNumber"
                      value={formData.telephoneNumber}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                      Address
                    </label>
                    <input
                      type="text"
                      name="postalAddress"
                      value={formData.postalAddress}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                        State/Province
                      </label>
                      <input
                        type="text"
                        name="stateProvince"
                        value={formData.stateProvince}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        flex: 1,
                        background: loading ? '#9ca3af' : '#16a34a',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '0.95rem',
                        fontWeight: '500'
                      }}
                    >
                      {loading ? 'Saving...' : '💾 Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={loading}
                      style={{
                        flex: 1,
                        background: 'white',
                        color: '#374151',
                        border: '1px solid #d1d5db',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '0.95rem',
                        fontWeight: '500'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Full Name
                  </p>
                  <p style={{ fontSize: '1rem', fontWeight: '500', margin: 0 }}>
                    {userProfile?.givenName} {userProfile?.sn}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Email
                  </p>
                  <p style={{ fontSize: '1rem', fontWeight: '500', margin: 0 }}>
                    {userProfile?.mail}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Phone Number
                  </p>
                  <p style={{ fontSize: '1rem', fontWeight: '500', margin: 0 }}>
                    {userProfile?.telephoneNumber || 'Not provided'}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Address
                  </p>
                  <p style={{ fontSize: '1rem', fontWeight: '500', margin: 0 }}>
                    {userProfile?.postalAddress || 'Not provided'}
                  </p>
                  {(userProfile?.city || userProfile?.stateProvince || userProfile?.postalCode) && (
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                      {[userProfile?.city, userProfile?.stateProvince, userProfile?.postalCode].filter(Boolean).join(', ')}
                    </p>
                  )}
                  {userProfile?.country && (
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                      {userProfile.country}
                    </p>
                  )}
                </div>

                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Account Status
                  </p>
                  <span style={{
                    display: 'inline-block',
                    background: userProfile?.accountStatus === 'active' ? '#dcfce7' : '#fee2e2',
                    color: userProfile?.accountStatus === 'active' ? '#166534' : '#991b1b',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {userProfile?.accountStatus === 'active' ? '✅ Active' : '❌ Inactive'}
                  </span>
                </div>

                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    User ID
                  </p>
                  <p style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#6b7280', margin: 0 }}>
                    {userProfile?._id}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Organizations & Groups */}
          <div style={{ display: 'grid', gap: '2rem' }}>
            
            {/* Organizations */}
            <div style={{
              background: 'white',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              padding: '2rem'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                🏢 My Organizations
              </h2>
              
              {userOrgs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏢</div>
                  <p style={{ fontSize: '0.875rem' }}>Not a member of any organizations</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {userOrgs.map(org => (
                    <div
                      key={org._id}
                      style={{
                        background: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        padding: '1rem'
                      }}
                    >
                      <h3 style={{ fontSize: '0.95rem', fontWeight: '600', margin: '0 0 0.25rem 0' }}>
                        {org.name}
                      </h3>
                      {org.description && (
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                          {org.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Groups */}
            <div style={{
              background: 'white',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              padding: '2rem'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                👥 My Groups
              </h2>
              
              {!userProfile?.effectiveGroups || userProfile.effectiveGroups.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
                  <p style={{ fontSize: '0.875rem' }}>Not a member of any groups</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {userProfile.effectiveGroups.map((group, index) => (
                    <div
                      key={index}
                      style={{
                        background: '#f0f9ff',
                        border: '1px solid #bfdbfe',
                        borderRadius: '6px',
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <span style={{ fontSize: '1rem' }}>👥</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                        {group._refResourceId || group._ref?.split('/').pop()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
