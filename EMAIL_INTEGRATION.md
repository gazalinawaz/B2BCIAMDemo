# Email Integration for Organization Invitations

## Current State
Currently, invitations are created in the database but **no emails are sent**. Users must manually check the "Pending Invitations" tab.

---

## Option 1: PingOne AIC Email Service (Recommended)

PingOne AIC has built-in email capabilities that can be triggered via:

### A. Using IDM Email Notification

1. **Configure Email Template in PingOne AIC**
   - Go to: Native Consoles → Identity Management → Configure → Email Templates
   - Create template: "Organization Invitation"
   - Subject: `You're invited to join {{organization.name}}`
   - Body:
     ```html
     <p>Hi,</p>
     <p>{{inviter.name}} has invited you to join <strong>{{organization.name}}</strong> as {{role}}.</p>
     <p><a href="{{appUrl}}/organizations?tab=invitations">Click here to accept the invitation</a></p>
     <p>This invitation expires in 7 days.</p>
     ```

2. **Trigger Email via IDM Script**
   - Add script hook to `alpha_invitation` onCreate
   - Script sends email when invitation is created

### B. Using AM Email Service

1. **Configure SMTP in PingOne AIC**
   - Go to: Native Consoles → Access Management → Configure → Global Services → Email Service
   - Set SMTP server, port, credentials

2. **Call Email API from Application**
   ```javascript
   // Send email via AM
   await callAicApi('/openidm/external/email?_action=send', {
     method: 'POST',
     body: JSON.stringify({
       to: inviteeEmail,
       from: 'noreply@yourcompany.com',
       subject: `You're invited to join ${orgName}`,
       body: emailHtml
     })
   });
   ```

---

## Option 2: External Email Service

### A. SendGrid

```javascript
// Install: npm install @sendgrid/mail
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: inviteeEmail,
  from: 'noreply@yourcompany.com',
  subject: `You're invited to join ${orgName}`,
  html: `
    <h2>Organization Invitation</h2>
    <p>${inviterName} has invited you to join ${orgName} as ${role}.</p>
    <a href="${appUrl}/organizations?tab=invitations">Accept Invitation</a>
  `
};

await sgMail.send(msg);
```

### B. AWS SES

```javascript
// Install: npm install @aws-sdk/client-ses
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const client = new SESClient({ region: 'us-east-1' });

const command = new SendEmailCommand({
  Source: 'noreply@yourcompany.com',
  Destination: { ToAddresses: [inviteeEmail] },
  Message: {
    Subject: { Data: `You're invited to join ${orgName}` },
    Body: { Html: { Data: emailHtml } }
  }
});

await client.send(command);
```

### C. Mailgun

```javascript
// Install: npm install mailgun-js
import mailgun from 'mailgun-js';

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});

await mg.messages().send({
  from: 'noreply@yourcompany.com',
  to: inviteeEmail,
  subject: `You're invited to join ${orgName}`,
  html: emailHtml
});
```

---

## Option 3: Serverless Function (Vercel/Netlify)

Since your app is on Vercel, create an API endpoint:

### Create `/api/send-invitation-email.js`

```javascript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { inviteeEmail, inviterName, orgName, role, invitationId } = req.body;

  const msg = {
    to: inviteeEmail,
    from: process.env.FROM_EMAIL,
    subject: `You're invited to join ${orgName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #667eea; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 30px; }
          .button { 
            display: inline-block; 
            background: #667eea; 
            color: white; 
            padding: 12px 30px; 
            text-decoration: none; 
            border-radius: 6px;
            margin: 20px 0;
          }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏢 Organization Invitation</h1>
          </div>
          <div class="content">
            <p>Hi,</p>
            <p><strong>${inviterName}</strong> has invited you to join <strong>${orgName}</strong> with the role of <strong>${role}</strong>.</p>
            <p>Click the button below to accept this invitation:</p>
            <a href="${process.env.APP_URL}/organizations?tab=invitations" class="button">
              Accept Invitation
            </a>
            <p><small>This invitation will expire in 7 days.</small></p>
          </div>
          <div class="footer">
            <p>If you didn't expect this invitation, you can safely ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
```

### Update `organizationApi.js`

```javascript
export const sendOrganizationInvitation = async (orgId, inviterUserId, inviteeEmail, role) => {
  const realm = getRealm();
  
  // Create invitation record
  const invitation = await inviteUserToOrganization(orgId, inviterUserId, inviteeEmail, role);
  
  // Send email via Vercel function
  try {
    const response = await fetch('/api/send-invitation-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inviteeEmail,
        inviterName: 'User', // Get from user object
        orgName: 'Organization', // Get from org object
        role,
        invitationId: invitation._id
      })
    });
    
    if (!response.ok) {
      console.error('Failed to send email');
    }
  } catch (err) {
    console.error('Email error:', err);
    // Don't fail the invitation if email fails
  }
  
  return invitation;
};
```

---

## Recommended Approach

**For Production: Use PingOne AIC Email Service**
- ✅ No external dependencies
- ✅ Already configured in PingOne
- ✅ Integrated with IDM
- ✅ Template management built-in

**For Quick Testing: Use Vercel + SendGrid**
- ✅ Easy to set up
- ✅ Free tier available
- ✅ Good deliverability
- ✅ Simple API

---

## Implementation Steps (PingOne AIC)

1. **Configure Email Template in IDM**
2. **Add Script Hook to `alpha_invitation`**
3. **Script triggers on onCreate**
4. **Email sent automatically**

Would you like me to implement one of these options?

---

## Environment Variables Needed

```env
# For SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@yourcompany.com
APP_URL=https://your-app.vercel.app

# For AWS SES
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1

# For Mailgun
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_domain.com
```

---

## Testing Without Email

For now, you can test the workflow without emails:
1. User A creates invitation
2. User B logs in with the invited email
3. User B sees invitation in "Pending Invitations" tab
4. User B accepts invitation
5. User B is added to organization

This works perfectly for testing the core functionality!
