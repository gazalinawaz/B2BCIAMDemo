import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  createOrganizationWithAdmin,
  getUserOrganizations,
  queryOrganizations,
  getOrganizationMembers,
} from '../utils/organizationApi';
import { getUserInfo } from '../utils/aicApi';

function OrganizationPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('my-orgs');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Organization data
  const [myOrganizations, setMyOrganizations] = useState([]);
  const [allOrganizations, setAllOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [orgMembers, setOrgMembers] = useState([]);
  
  // Form states
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgDescription, setNewOrgDescription] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Customer Port Admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Loading data...');
      const userInfo = await getUserInfo();
      console.log('User info:', userInfo);
      
      // Load my organizations
      console.log('Fetching user organizations...');
      const myOrgs = await getUserOrganizations(userInfo.sub);
      console.log('My organizations:', myOrgs);
      console.log('My organizations count:', myOrgs.result?.length || 0);
      console.log('My organizations array:', myOrgs.result);
      setMyOrganizations(myOrgs.result || []);
      console.log('State updated with organizations:', myOrgs.result?.length || 0);
      
      // Try to load all organizations (requires admin)
      try {
        console.log('Fetching all organizations...');
        const allOrgs = await queryOrganizations('true');
        console.log('All organizations:', allOrgs);
        setAllOrganizations(allOrgs.result || []);
      } catch (err) {
        console.log('Cannot load all organizations (admin required):', err.message);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrganization = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      console.log('Creating organization...');
      const userInfo = await getUserInfo();
      console.log('User info:', userInfo);
      
      const result = await createOrganizationWithAdmin(userInfo.sub, {
        name: newOrgName,
        description: newOrgDescription,
      });
      
      console.log('Organization created:', result);
      setSuccess(`Organization "${newOrgName}" created successfully! You are now the Org Admin.`);
      setNewOrgName('');
      setNewOrgDescription('');
      
      // Reload data
      console.log('Reloading data...');
      await loadData();
      console.log('Data reloaded, switching to my-orgs tab');
      setActiveTab('my-orgs');
    } catch (err) {
      console.error('Error creating organization:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvitation = async (e) => {
    e.preventDefault();
    if (!selectedOrg) {
      setError('Please select an organization first');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // Find user by email
      const { queryUsers } = await import('../utils/aicApi');
      const filter = `mail eq "${inviteEmail}"`;
      const userResults = await queryUsers(filter);
      
      if (!userResults.result || userResults.result.length === 0) {
        setError(`No user found with email: ${inviteEmail}`);
        setLoading(false);
        return;
      }
      
      const invitedUser = userResults.result[0];
      
      // Add user directly to organization
      const { addUserToOrganization } = await import('../utils/organizationApi');
      await addUserToOrganization(selectedOrg._id, invitedUser._id, inviteRole);
      
      setSuccess(`${invitedUser.givenName} ${invitedUser.sn} added to ${selectedOrg.name} as ${inviteRole}`);
      setInviteEmail('');
      setSearchQuery('');
      setSearchResults([]);
      
      // Reload data
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMembers = async (org) => {
    try {
      setLoading(true);
      setSelectedOrg(org);
      
      const fullOrg = await getOrganization(org._id);
      setOrgMembers(fullOrg.members || []);
      setActiveTab('members');
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchUsers = async (query) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    try {
      setSearchLoading(true);
      // Search users by email or name
      const { queryUsers } = await import('../utils/aicApi');
      const filter = `(mail sw "${query}") or (givenName sw "${query}") or (sn sw "${query}") or (userName sw "${query}")`;
      const results = await queryUsers(filter);
      setSearchResults(results.result || []);
    } catch (err) {
      console.error('Error searching users:', err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectUser = (user) => {
    setInviteEmail(user.mail || user.userName);
    setSearchQuery('');
    setSearchResults([]);
  };

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
            <h1 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
              🏢 Organization Management
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              {user?.email || 'User Account'}
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
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        
        {/* Notifications */}
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <p style={{ color: '#dc2626', fontSize: '0.875rem', margin: 0 }}>
              ❌ {error}
            </p>
          </div>
        )}
        
        {success && (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <p style={{ color: '#16a34a', fontSize: '0.875rem', margin: 0 }}>
              ✅ {success}
            </p>
          </div>
        )}

        {/* Tabs */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #e5e7eb'
          }}>
            {[
              { id: 'my-orgs', label: '🏢 My Organizations', count: myOrganizations.length },
              { id: 'create', label: '➕ Create Organization', count: null },
              { id: 'invite', label: '➕ Add Member', count: null },
              { id: 'members', label: '👥 Members', count: orgMembers.length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  background: activeTab === tab.id ? '#f9fafb' : 'white',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid #667eea' : '2px solid transparent',
                  cursor: 'pointer',
                  fontWeight: activeTab === tab.id ? '600' : '400',
                  color: activeTab === tab.id ? '#667eea' : '#6b7280',
                  fontSize: '0.875rem'
                }}
              >
                {tab.label}
                {tab.count !== null && tab.count > 0 && (
                  <span style={{
                    marginLeft: '0.5rem',
                    background: '#667eea',
                    color: 'white',
                    borderRadius: '12px',
                    padding: '0.125rem 0.5rem',
                    fontSize: '0.75rem'
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: '2rem' }}>
            
            {/* My Organizations Tab */}
            {activeTab === 'my-orgs' && (
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                  My Organizations
                </h2>
                
                {/* Debug Info */}
                <div style={{
                  background: '#f0f9ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '6px',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace'
                }}>
                  <strong>Debug:</strong> myOrganizations.length = {myOrganizations.length}
                  {myOrganizations.length > 0 && (
                    <div style={{ marginTop: '0.5rem' }}>
                      Organizations: {myOrganizations.map(o => o.name).join(', ')}
                    </div>
                  )}
                </div>
                
                {myOrganizations.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏢</div>
                    <p>You don't belong to any organizations yet.</p>
                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                      Create one or accept an invitation to get started.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {myOrganizations.map(org => (
                      <div
                        key={org._id}
                        style={{
                          background: '#f9fafb',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          padding: '1.5rem'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                              {org.name}
                            </h3>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                              {org.description || 'No description'}
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
                              <span style={{ color: '#6b7280' }}>
                                <strong>ID:</strong> {org._id}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleViewMembers(org)}
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
                            View Members
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Create Organization Tab */}
            {activeTab === 'create' && (
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                  Create New Organization
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                  You will automatically become the Org Admin of the organization you create.
                </p>
                <form onSubmit={handleCreateOrganization}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      value={newOrgName}
                      onChange={(e) => setNewOrgName(e.target.value)}
                      required
                      placeholder="e.g., Acme Corporation"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                      Description
                    </label>
                    <textarea
                      value={newOrgDescription}
                      onChange={(e) => setNewOrgDescription(e.target.value)}
                      placeholder="e.g., Using BT IdP for authentication"
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !newOrgName}
                    style={{
                      background: loading || !newOrgName ? '#9ca3af' : '#667eea',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '6px',
                      cursor: loading || !newOrgName ? 'not-allowed' : 'pointer',
                      fontSize: '0.95rem',
                      fontWeight: '500'
                    }}
                  >
                    {loading ? 'Creating...' : '✨ Create Organization'}
                  </button>
                </form>
              </div>
            )}

            {/* Add Member Tab */}
            {activeTab === 'invite' && (
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                  Add Member to Organization
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                  Search for an existing user and add them to your organization with a specific role.
                </p>
                
                {myOrganizations.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
                    <p>You need to create an organization first before inviting users.</p>
                    <button
                      onClick={() => setActiveTab('create')}
                      style={{
                        marginTop: '1rem',
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        fontWeight: '500'
                      }}
                    >
                      Create Organization
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSendInvitation}>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                        Select Organization *
                      </label>
                      <select
                        value={selectedOrg?._id || ''}
                        onChange={(e) => {
                          const org = myOrganizations.find(o => o._id === e.target.value);
                          setSelectedOrg(org);
                        }}
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem'
                        }}
                      >
                        <option value="">-- Select Organization --</option>
                        {myOrganizations.map(org => (
                          <option key={org._id} value={org._id}>
                            {org.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                        Search and Select User *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => handleSearchUsers(e.target.value)}
                          placeholder="Search by name or email..."
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '0.875rem'
                          }}
                        />
                        {searchLoading && (
                          <div style={{
                            position: 'absolute',
                            right: '0.75rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#9ca3af'
                          }}>
                            Searching...
                          </div>
                        )}
                        {searchResults.length > 0 && (
                          <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: 'white',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            marginTop: '0.25rem',
                            maxHeight: '200px',
                            overflowY: 'auto',
                            zIndex: 10,
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}>
                            {searchResults.map((user) => (
                              <div
                                key={user._id}
                                onClick={() => handleSelectUser(user)}
                                style={{
                                  padding: '0.75rem',
                                  cursor: 'pointer',
                                  borderBottom: '1px solid #f3f4f6',
                                  ':hover': { background: '#f9fafb' }
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                              >
                                <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                                  {user.givenName} {user.sn}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                  {user.mail || user.userName}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                        💡 Start typing to search for users by name or email
                      </p>
                    </div>
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                        Selected User Email
                      </label>
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        required
                        placeholder="Select a user from search or enter email manually"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                        Role *
                      </label>
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem'
                        }}
                      >
                        <option value="Customer Port Admin">Customer Port Admin</option>
                        <option value="Customer Port Monitor">Customer Port Monitor</option>
                        <option value="Org Admin">Org Admin</option>
                      </select>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={loading || !selectedOrg || !inviteEmail}
                      style={{
                        background: loading || !selectedOrg || !inviteEmail ? '#9ca3af' : '#667eea',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '6px',
                        cursor: loading || !selectedOrg || !inviteEmail ? 'not-allowed' : 'pointer',
                        fontSize: '0.95rem',
                        fontWeight: '500'
                      }}
                    >
                      {loading ? 'Adding...' : '➕ Add Member'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                  Organization Members
                  {selectedOrg && (
                    <span style={{ fontSize: '0.875rem', fontWeight: '400', color: '#6b7280', marginLeft: '1rem' }}>
                      {selectedOrg.name}
                    </span>
                  )}
                </h2>
                {!selectedOrg ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
                    <p>Select an organization to view members.</p>
                  </div>
                ) : orgMembers.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
                    <p>No members in this organization yet.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {orgMembers.map((member, index) => {
                      const role = member._refProperties?.role || 'Member';
                      return (
                        <div
                          key={index}
                          style={{
                            background: '#f9fafb',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '1rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <p style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                              {member._ref.split('/').pop()}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              {member._ref}
                            </p>
                          </div>
                          <span style={{
                            background: role === 'Org Admin' ? '#667eea' : '#10b981',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            {role}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizationPage;
