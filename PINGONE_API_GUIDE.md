# PingOne AIC API Integration Guide

This guide shows how to call PingOne AIC REST APIs from your React application.

## 📋 Overview

The application includes a utility module (`src/utils/aicApi.js`) that provides functions to call PingOne AIC APIs using the authenticated user's access token.

## 🔐 Authentication

All API calls automatically use the access token from `sessionStorage`. The user must be logged in for API calls to work.

## 📚 Available APIs

### 1. User Management (IDM)

#### Get Current User
```javascript
import { getCurrentUser } from '../utils/aicApi';

const user = await getCurrentUser();
console.log(user);
```

#### Get User by ID
```javascript
import { getUserById } from '../utils/aicApi';

const user = await getUserById('user-id-123');
```

#### Query Users
```javascript
import { queryUsers } from '../utils/aicApi';

// Search by email
const users = await queryUsers('mail co "example.com"', 'userName,mail,givenName');

// Get all users
const allUsers = await queryUsers('true', '*');
```

#### Update User Profile
```javascript
import { updateUserProfile } from '../utils/aicApi';

await updateUserProfile('user-id-123', [
  { operation: 'replace', field: '/givenName', value: 'John' },
  { operation: 'replace', field: '/sn', value: 'Doe' }
]);
```

#### Create User
```javascript
import { createUser } from '../utils/aicApi';

const newUser = await createUser({
  userName: 'john.doe',
  givenName: 'John',
  sn: 'Doe',
  mail: 'john.doe@example.com',
  password: 'SecurePassword123!'
});
```

#### Delete User
```javascript
import { deleteUser } from '../utils/aicApi';

await deleteUser('user-id-123');
```

---

### 2. Group Management

#### Query Groups
```javascript
import { queryGroups } from '../utils/aicApi';

// Get all groups
const groups = await queryGroups('true');

// Search by name
const broadbandGroups = await queryGroups('name co "broadband"');
```

#### Get Group by ID
```javascript
import { getGroupById } from '../utils/aicApi';

const group = await getGroupById('group-id-123');
```

#### Add User to Group
```javascript
import { addUserToGroup } from '../utils/aicApi';

await addUserToGroup('group-id-123', 'user-id-456');
```

---

### 3. OAuth / UserInfo

#### Get UserInfo
```javascript
import { getUserInfo } from '../utils/aicApi';

const userInfo = await getUserInfo();
console.log(userInfo.email, userInfo.groups);
```

#### Validate Token
```javascript
import { validateToken } from '../utils/aicApi';

const tokenInfo = await validateToken();
console.log('Token is valid:', tokenInfo.active);
```

---

### 4. Custom Managed Objects

#### Query Custom Objects
```javascript
import { queryManagedObjects } from '../utils/aicApi';

// Query organizations
const orgs = await queryManagedObjects('alpha_organization', 'true');
```

#### Create Custom Object
```javascript
import { createManagedObject } from '../utils/aicApi';

const org = await createManagedObject('alpha_organization', {
  name: 'Acme Corp',
  description: 'A great company'
});
```

---

## 🎯 Example: Use in React Component

```javascript
import React, { useState, useEffect } from 'react';
import { queryUsers, getUserInfo } from '../utils/aicApi';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const currentUser = await getUserInfo();
        console.log('Logged in as:', currentUser.email);
        
        // Query all users
        const result = await queryUsers('true', 'userName,mail,givenName,sn');
        setUsers(result.result || []);
        
      } catch (err) {
        setError(err.message);
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Users ({users.length})</h2>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.givenName} {user.sn} - {user.mail}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
```

---

## 🔍 CREST Query Filter Examples

PingOne AIC uses CREST query filters for searching:

```javascript
// Exact match
'userName eq "john.doe"'

// Contains
'mail co "example.com"'

// Starts with
'givenName sw "John"'

// Greater than
'accountStatus gt 0'

// Boolean AND
'(mail co "example.com") and (accountStatus eq "active")'

// Boolean OR
'(givenName eq "John") or (givenName eq "Jane")'

// Present (field exists)
'mail pr'

// Get all
'true'
```

---

## 🛠️ API Endpoints Reference

### IDM (Identity Management)
- **Users**: `/openidm/managed/{realm}_user`
- **Groups**: `/openidm/managed/{realm}_group`
- **Roles**: `/openidm/managed/{realm}_role`
- **Organizations**: `/openidm/managed/{realm}_organization`

### AM (Access Management)
- **UserInfo**: `/am/oauth2/realms/{realm}/userinfo`
- **Token Introspect**: `/am/oauth2/realms/{realm}/introspect`
- **Sessions**: `/am/json/realms/{realm}/sessions`

---

## ⚠️ Error Handling

Always wrap API calls in try-catch:

```javascript
try {
  const users = await queryUsers('true');
  console.log('Success:', users);
} catch (error) {
  if (error.message.includes('401')) {
    console.error('Unauthorized - token may be expired');
    // Redirect to login
  } else if (error.message.includes('403')) {
    console.error('Forbidden - insufficient permissions');
  } else {
    console.error('API Error:', error.message);
  }
}
```

---

## 🔐 Permissions

The access token must have appropriate scopes and the user must have permissions to perform the action.

**Common scopes needed:**
- `openid` - Basic authentication
- `profile` - User profile access
- `email` - Email address
- `fr:idm:*` - Full IDM access (admin)

---

## 📖 Additional Resources

- **PingOne AIC REST API Docs**: https://docs.pingidentity.com/pingoneaic/latest/developer-docs/rest-api.html
- **CREST Query Filters**: https://docs.pingidentity.com/pingoneaic/latest/developer-docs/crest/query.html
- **IDM Managed Objects**: https://docs.pingidentity.com/pingoneaic/latest/developer-docs/idm/managed-objects.html

---

## 🎯 Next Steps

1. Import the utility functions in your components
2. Call APIs as needed
3. Handle errors appropriately
4. Add loading states for better UX
5. Consider caching frequently accessed data

**Happy coding!** 🚀
