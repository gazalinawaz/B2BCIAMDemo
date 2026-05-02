import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { callAicApi } from '../utils/aicApi';

function RolesPage() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Roles data
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  
  // Form data
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [roleResources, setRoleResources] = useState([]);
  const [roleActions, setRoleActions] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Query all roles
      const response = await callAicApi(
        '/openidm/managed/alpha_role?_queryFilter=true&_pageSize=100'
      );
      
      setRoles(response.result || []);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // Create new role
      await callAicApi('/openidm/managed/alpha_role?_action=create', {
        method: 'POST',
        body: JSON.stringify({
          name: roleName,
          description: roleDescription,
          resources: roleResources,
          actions: roleActions
        })
      });
      
      setSuccess(`Role "${roleName}" created successfully!`);
      setRoleName('');
      setRoleDescription('');
      setRoleResources([]);
      setRoleActions([]);
      setShowCreateForm(false);
      
      // Reload roles
      await loadRoles();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (roleId, roleName) => {
    if (!confirm(`Are you sure you want to delete the role "${roleName}"?`)) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await callAicApi(`/openidm/managed/alpha_role/${roleId}`, {
        method: 'DELETE'
      });
      
      setSuccess(`Role "${roleName}" deleted successfully!`);
      
      // Reload roles
      await loadRoles();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRole = async (role) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get full role details
      const fullRole = await callAicApi(`/openidm/managed/alpha_role/${role._id}`);
      setSelectedRole(fullRole);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // BT Phase 1 Role Templates
  const roleTemplates = [
    {
      name: 'org_admin',
      description: 'Organisation Administrator - full access to organisation management',
      resources: ['organisation', 'project', 'user', 'billing'],
      actions: ['create', 'read', 'update', 'delete', 'monitor']
    },
    {
      name: 'org_view',
      description: 'Organisation View Only - read-only access to organisation and projects',
      resources: ['organisation', 'project'],
      actions: ['read', 'monitor']
    },
    {
      name: 'customer_port_admin',
      description: 'Customer Port Administrator - full access to customer port management',
      resources: ['customer_port'],
      actions: ['create', 'read', 'update', 'delete', 'monitor']
    },
    {
      name: 'customer_port_view',
      description: 'Customer Port Read Only - view-only access to customer ports',
      resources: ['customer_port'],
      actions: ['read', 'monitor']
    },
    {
      name: 'internet_admin',
      description: 'Internet Administrator - full access to internet service management',
      resources: ['internet'],
      actions: ['create', 'read', 'update', 'delete', 'monitor']
    },
    {
      name: 'ip_vpn_admin',
      description: 'IP VPN Administrator - full access to IP VPN management',
      resources: ['ip_vpn'],
      actions: ['create', 'read', 'update', 'delete', 'monitor']
    }
  ];

  const handleUseTemplate = (template) => {
    setRoleName(template.name);
    setRoleDescription(template.description);
    setRoleResources(template.resources || []);
    setRoleActions(template.actions || []);
    setShowCreateForm(true);
  };

  const availableResources = ['organisation', 'project', 'user', 'billing', 'customer_port', 'internet', 'ip_vpn'];
  const availableActions = ['create', 'read', 'update', 'delete', 'monitor'];

  const toggleResource = (resource) => {
    setRoleResources(prev => 
      prev.includes(resource) 
        ? prev.filter(r => r !== resource)
        : [...prev, resource]
    );
  };

  const toggleAction = (action) => {
    setRoleActions(prev => 
      prev.includes(action) 
        ? prev.filter(a => a !== action)
        : [...prev, action]
    );
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
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🎭 Role Management
            </h1>
            <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
              Create and manage user roles
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

        {/* Stats */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                Total Roles
              </p>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', margin: 0 }}>
                {roles.length}
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              style={{
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
              {showCreateForm ? '❌ Cancel' : '➕ Create New Role'}
            </button>
          </div>
        </div>

        {/* Create Role Form */}
        {showCreateForm && (
          <div style={{
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
              Create New Role
            </h2>

            {/* Role Templates */}
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '1rem' }}>
                Quick Templates:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {roleTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => handleUseTemplate(template)}
                    style={{
                      background: '#f3f4f6',
                      border: '1px solid #d1d5db',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151'
                    }}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateRole}>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                    Role Name *
                  </label>
                  <input
                    type="text"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    required
                    placeholder="e.g., Customer Port Admin"
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
                    Description *
                  </label>
                  <textarea
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    required
                    placeholder="Describe the role's purpose and permissions..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                    Resources *
                  </label>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                    Select which resources this role can access
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {availableResources.map(resource => (
                      <button
                        key={resource}
                        type="button"
                        onClick={() => toggleResource(resource)}
                        style={{
                          background: roleResources.includes(resource) ? '#667eea' : '#f3f4f6',
                          color: roleResources.includes(resource) ? 'white' : '#374151',
                          border: roleResources.includes(resource) ? '2px solid #667eea' : '1px solid #d1d5db',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}
                      >
                        {roleResources.includes(resource) ? '✓ ' : ''}{resource}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                    Actions *
                  </label>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                    Select which actions this role can perform
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {availableActions.map(action => (
                      <button
                        key={action}
                        type="button"
                        onClick={() => toggleAction(action)}
                        style={{
                          background: roleActions.includes(action) ? '#10b981' : '#f3f4f6',
                          color: roleActions.includes(action) ? 'white' : '#374151',
                          border: roleActions.includes(action) ? '2px solid #10b981' : '1px solid #d1d5db',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          textTransform: 'uppercase'
                        }}
                      >
                        {roleActions.includes(action) ? '✓ ' : ''}{action}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || roleResources.length === 0 || roleActions.length === 0}
                  style={{
                    background: (loading || roleResources.length === 0 || roleActions.length === 0) ? '#9ca3af' : '#16a34a',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    cursor: (loading || roleResources.length === 0 || roleActions.length === 0) ? 'not-allowed' : 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '500'
                  }}
                >
                  {loading ? 'Creating...' : '✨ Create Role'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Roles List */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
            All Roles ({roles.length})
          </h2>

          {loading && roles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
              <p>Loading roles...</p>
            </div>
          ) : roles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎭</div>
              <p>No roles created yet.</p>
              <button
                onClick={() => setShowCreateForm(true)}
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
                Create Your First Role
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {roles.map(role => (
                <div
                  key={role._id}
                  style={{
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
                      {role.name}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                      {role.description || 'No description provided'}
                    </p>
                    
                    {/* Resources */}
                    {role.resources && role.resources.length > 0 && (
                      <div style={{ marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', marginRight: '0.5rem' }}>
                          Resources:
                        </span>
                        {role.resources.map((resource, idx) => (
                          <span
                            key={idx}
                            style={{
                              display: 'inline-block',
                              background: '#dbeafe',
                              color: '#1e40af',
                              padding: '0.125rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              marginRight: '0.25rem',
                              marginBottom: '0.25rem'
                            }}
                          >
                            {resource}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Actions */}
                    {role.actions && role.actions.length > 0 && (
                      <div style={{ marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', marginRight: '0.5rem' }}>
                          Actions:
                        </span>
                        {role.actions.map((action, idx) => (
                          <span
                            key={idx}
                            style={{
                              display: 'inline-block',
                              background: '#d1fae5',
                              color: '#065f46',
                              padding: '0.125rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              textTransform: 'uppercase',
                              marginRight: '0.25rem',
                              marginBottom: '0.25rem'
                            }}
                          >
                            {action}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                      <span>ID: {role._id}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleViewRole(role)}
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
                      👁️ View
                    </button>
                    <button
                      onClick={() => handleDeleteRole(role._id, role.name)}
                      disabled={loading}
                      style={{
                        background: loading ? '#9ca3af' : '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Role Details Modal */}
        {selectedRole && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
            onClick={() => setSelectedRole(null)}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '8px',
                padding: '2rem',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '80vh',
                overflow: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>
                  Role Details
                </h2>
                <button
                  onClick={() => setSelectedRole(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#6b7280'
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Role Name
                  </p>
                  <p style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>
                    {selectedRole.name}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Description
                  </p>
                  <p style={{ fontSize: '0.95rem', margin: 0 }}>
                    {selectedRole.description || 'No description provided'}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Resources
                  </p>
                  {selectedRole.resources && selectedRole.resources.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {selectedRole.resources.map((resource, idx) => (
                        <span
                          key={idx}
                          style={{
                            display: 'inline-block',
                            background: '#dbeafe',
                            color: '#1e40af',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                          }}
                        >
                          {resource}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.875rem', color: '#9ca3af', margin: 0 }}>No resources defined</p>
                  )}
                </div>

                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Actions
                  </p>
                  {selectedRole.actions && selectedRole.actions.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {selectedRole.actions.map((action, idx) => (
                        <span
                          key={idx}
                          style={{
                            display: 'inline-block',
                            background: '#d1fae5',
                            color: '#065f46',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            textTransform: 'uppercase'
                          }}
                        >
                          {action}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.875rem', color: '#9ca3af', margin: 0 }}>No actions defined</p>
                  )}
                </div>

                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Role ID
                  </p>
                  <p style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#6b7280', margin: 0 }}>
                    {selectedRole._id}
                  </p>
                </div>

                {selectedRole.members && selectedRole.members.length > 0 && (
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Members ({selectedRole.members.length})
                    </p>
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                      {selectedRole.members.map((member, index) => (
                        <div
                          key={index}
                          style={{
                            background: '#f9fafb',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.875rem'
                          }}
                        >
                          {member._ref || member._refResourceId}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RolesPage;
