import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  createOrganizationWithAdmin,
  queryOrganizations,
  getUserOrganizations,
  sendOrganizationInvitation,
  getPendingInvitations,
  acceptInvitation,
  getOrganizationMembers,
  getOrganization,
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
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [orgMembers, setOrgMembers] = useState([]);
  
  // Form states
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgDescription, setNewOrgDescription] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Customer Port Admin');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const userInfo = await getUserInfo();
      
      // Load my organizations
      const myOrgs = await getUserOrganizations(userInfo.sub);
      setMyOrganizations(myOrgs.result || []);
      
      // Load pending invitations
      const invites = await getPendingInvitations(userInfo.email);
      setPendingInvitations(invites.result || []);
      
      // Try to load all organizations (requires admin)
      try {
        const allOrgs = await queryOrganizations('true');
        setAllOrganizations(allOrgs.result || []);
      } catch (err) {
        console.log('Cannot load all organizations (admin required)');
      }
      
      setError(null);
    } catch (err) {
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
      
      const userInfo = await getUserInfo();
      const result = await createOrganizationWithAdmin(userInfo.sub, {
        name: newOrgName,
        description: newOrgDescription,
      });
      
      setSuccess(`Organization "${newOrgName}" created successfully! You are now the Org Admin.`);
      setNewOrgName('');
      setNewOrgDescription('');
      
      // Reload data
      await loadData();
      setActiveTab('my-orgs');
    } catch (err) {
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
      
      const userInfo = await getUserInfo();
      await sendOrganizationInvitation(
        selectedOrg._id,
        userInfo.sub,
        inviteEmail,
        inviteRole
      );
      
      setSuccess(`Invitation sent to ${inviteEmail} for role: ${inviteRole}`);
      setInviteEmail('');
      
      // Reload data
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async (invitationId) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const userInfo = await getUserInfo();
      const result = await acceptInvitation(invitationId, userInfo.sub);
      
      setSuccess('Invitation accepted! You are now a member of the organization.');
      
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

  const suggestMailinatorEmail = () => {
    const randomId = Math.random().toString(36).substring(7);
    return `testuser${randomId}@mailinator.com`;
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
              { id: 'invite', label: '📧 Send Invitation', count: null },
              { id: 'invitations', label: '📬 Pending Invitations', count: pendingInvitations.length },
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

            {/* Send Invitation Tab */}
            {activeTab === 'invite' && (
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                  Invite User to Organization
                </h2>
                
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
                        Invitee Email Address *
                      </label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          type="email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          required
                          placeholder="user@mailinator.com"
                          style={{
                            flex: 1,
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '0.875rem'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setInviteEmail(suggestMailinatorEmail())}
                          style={{
                            background: '#f3f4f6',
                            color: '#374151',
                            border: '1px solid #d1d5db',
                            padding: '0.75rem 1rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          📧 Use Mailinator
                        </button>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                        💡 Tip: Use @mailinator.com emails for testing. Check inbox at <a href="https://www.mailinator.com" target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>mailinator.com</a>
                      </p>
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
                      {loading ? 'Sending...' : '📧 Send Invitation'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Pending Invitations Tab */}
            {activeTab === 'invitations' && (
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                  Pending Invitations
                </h2>
                {pendingInvitations.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📬</div>
                    <p>No pending invitations.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {pendingInvitations.map(invite => (
                      <div
                        key={invite._id}
                        style={{
                          background: '#fffbeb',
                          border: '1px solid #fcd34d',
                          borderRadius: '8px',
                          padding: '1.5rem'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                              Organization Invitation
                            </h3>
                            <div style={{ fontSize: '0.875rem', color: '#78350f', marginBottom: '0.5rem' }}>
                              <p><strong>Role:</strong> {invite.role}</p>
                              <p><strong>Organization ID:</strong> {invite.organizationId}</p>
                              <p><strong>Invited by:</strong> {invite.inviterUserId}</p>
                              <p><strong>Expires:</strong> {new Date(invite.expiryDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleAcceptInvitation(invite._id)}
                            disabled={loading}
                            style={{
                              background: loading ? '#9ca3af' : '#16a34a',
                              color: 'white',
                              border: 'none',
                              padding: '0.5rem 1rem',
                              borderRadius: '6px',
                              cursor: loading ? 'not-allowed' : 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: '500'
                            }}
                          >
                            ✅ Accept
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
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
