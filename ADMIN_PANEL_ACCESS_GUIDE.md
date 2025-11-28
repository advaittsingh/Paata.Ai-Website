# 🔐 Admin Panel Access Guide

## Overview

The PAATA.AI admin panel provides administrators with access to analytics, user management, billing information, learning content management, and system monitoring. This guide explains how to access and configure admin access.

---

## Quick Access

### Direct URL
```
https://www.paataai.com/admin/dashboard
```

### Navigation
1. Log in to your account
2. Click on your profile dropdown (top right)
3. If you have admin privileges, you'll see **"🔐 Admin Panel"** link
4. Click to access the admin dashboard

---

## Admin Access Requirements

### 1. Authentication
- You must be **logged in** to your PAATA.AI account
- Your account must be **verified** and active

### 2. Admin Email Configuration
Admin access is granted based on email addresses configured in the environment variables.

**Default Admin Email:**
- `admin@paata.ai`

**Environment Variable:**
```bash
ADMIN_EMAILS=admin@paata.ai,another-admin@paata.ai,third-admin@paata.ai
```

**⚠️ Important:** The variable name must be `ADMIN_EMAILS` (plural), not `ADMIN_EMAIL` (singular).

**Note:** Multiple admin emails can be specified, separated by commas.

---

## Setting Up Admin Access

### Option 1: Using Environment Variables (Recommended)

#### For Local Development
1. Open your `.env.local` file
2. Add or update the `ADMIN_EMAILS` variable:
```bash
ADMIN_EMAILS=your-email@example.com,admin@paata.ai
```
3. Restart your development server

#### For Production (Vercel)
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add or update `ADMIN_EMAILS`:
   - **Name:** `ADMIN_EMAILS` (⚠️ Must be plural, not `ADMIN_EMAIL`)
   - **Value:** `your-email@example.com,admin@paata.ai`
   - **Environment:** Production (and Preview/Development if needed)
4. **Important:** If you have an existing `ADMIN_EMAIL` variable, delete it and create `ADMIN_EMAILS` instead
5. Redeploy your application

### Option 2: Direct Code Modification (Not Recommended)

If you need to quickly add an admin without changing environment variables, you can modify `src/lib/admin-utils.ts`:

```typescript
const ADMIN_EMAILS = process.env.ADMIN_EMAILS 
  ? process.env.ADMIN_EMAILS.split(',').map(email => email.trim().toLowerCase())
  : ['admin@paata.ai', 'your-email@example.com']; // Add your email here
```

**⚠️ Warning:** This approach is not recommended for production as it requires code changes and redeployment.

---

## Verifying Admin Access

### Method 1: Check via API
You can verify if your account has admin access by calling the admin check API:

```bash
curl -X GET https://www.paataai.com/api/admin/check \
  -H "Cookie: auth_token=YOUR_AUTH_TOKEN" \
  --cookie-jar cookies.txt
```

**Response if admin:**
```json
{
  "isAdmin": true,
  "user": {
    "id": "user_123",
    "email": "admin@paata.ai",
    "firstName": "Admin",
    "lastName": "User"
  },
  "error": null
}
```

**Response if not admin:**
```json
{
  "isAdmin": false,
  "user": null,
  "error": "Admin access required"
}
```

### Method 2: Check in Browser Console
1. Log in to your account
2. Open browser developer console (F12)
3. Run:
```javascript
fetch('/api/admin/check', { credentials: 'include' })
  .then(r => r.json())
  .then(data => console.log('Admin Status:', data));
```

### Method 3: Visual Check
- If you see the **"🔐 Admin Panel"** link in your profile dropdown, you have admin access
- If you don't see it, you don't have admin privileges

---

## Admin Panel Features

Once you have access, the admin panel provides:

### 1. Dashboard (`/admin/dashboard`)
- **Overview:** User statistics, plan distribution, usage metrics
- **Analytics:** Feature usage, input method distribution, active users
- **Billing:** Revenue, subscriptions, transactions
- **User Management:** View and manage all users
- **System Monitoring:** Health checks, diagnostics

### 2. Learning Content Management (`/admin/learning`)
- Manage boards, classes, subjects, and chapters
- Upload and manage PDFs and videos
- Seed learning content

### 3. Notifications (`/admin/notifications`)
- Send notifications to users
- Manage notification templates

---

## Troubleshooting

### Issue: "Access denied. Admin privileges required."

**Solutions:**
1. **Verify the variable name is correct:**
   - Must be `ADMIN_EMAILS` (plural), NOT `ADMIN_EMAIL` (singular)
   - If you have `ADMIN_EMAIL`, delete it and create `ADMIN_EMAILS`
2. **Verify your email is in ADMIN_EMAILS:**
   - Check environment variables in Vercel
   - Ensure your email matches exactly (case-insensitive)
   - Check for typos or extra spaces

2. **Verify you're logged in:**
   - Make sure you're authenticated
   - Try logging out and logging back in
   - Clear browser cookies and try again

3. **Check environment variable format:**
   - Emails should be comma-separated
   - No spaces around commas
   - Example: `email1@example.com,email2@example.com`

4. **Redeploy after changes:**
   - If you updated environment variables, redeploy the application
   - Wait for deployment to complete before testing

### Issue: Admin Panel link not showing in navbar

**Solutions:**
1. **Check admin status:**
   - Use the API check method above
   - Verify your email is configured correctly

2. **Clear browser cache:**
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - Clear browser cache and cookies

3. **Check browser console:**
   - Look for JavaScript errors
   - Check network requests to `/api/admin/check`

### Issue: Can't access admin routes

**Solutions:**
1. **Verify authentication:**
   - Make sure you're logged in
   - Check that auth cookies are set

2. **Check route protection:**
   - Admin routes require authentication
   - They also check admin status via `/api/admin/check`

3. **Verify environment variables:**
   - Ensure `ADMIN_EMAILS` is set correctly
   - Check that it's available in the correct environment

---

## Security Best Practices

### 1. Limit Admin Access
- Only grant admin access to trusted individuals
- Use specific email addresses, not wildcards
- Regularly review admin access list

### 2. Use Strong Authentication
- Ensure admin accounts use strong passwords
- Consider enabling 2FA for admin accounts
- Monitor admin account activity

### 3. Environment Variable Security
- Never commit `ADMIN_EMAILS` to version control
- Use Vercel environment variables for production
- Rotate admin access periodically

### 4. Audit Admin Actions
- Monitor admin panel usage
- Log admin actions for audit purposes
- Set up alerts for sensitive operations

---

## Adding Multiple Admins

To add multiple administrators, update the `ADMIN_EMAILS` environment variable:

```bash
ADMIN_EMAILS=admin1@paata.ai,admin2@paata.ai,admin3@paata.ai,manager@paata.ai
```

**Important Notes:**
- Emails are case-insensitive
- Spaces around commas are automatically trimmed
- Each email must be a valid email format
- All listed emails will have full admin access

---

## Admin Panel Routes

### Available Routes:
- `/admin/dashboard` - Main admin dashboard
- `/admin/learning` - Learning content management
- `/admin/notifications` - Notification management

### API Routes:
- `/api/admin/check` - Check admin status
- `/api/admin/analytics` - Get analytics data
- `/api/admin/billing` - Get billing data
- `/api/admin/users` - User management
- `/api/admin/monitoring` - System monitoring
- `/api/admin/learning/*` - Learning content APIs
- `/api/admin/notifications` - Notification APIs

---

## Code Reference

### Admin Check Implementation

**File:** `src/lib/admin-utils.ts`

```typescript
const ADMIN_EMAILS = process.env.ADMIN_EMAILS 
  ? process.env.ADMIN_EMAILS.split(',').map(email => email.trim().toLowerCase())
  : ['admin@paata.ai'];

export function isAdmin(user: { email: string } | null): boolean {
  if (!user) return false;
  return ADMIN_EMAILS.includes(user.email.toLowerCase());
}
```

### Admin Route Protection

**File:** `src/app/admin/dashboard/page.tsx`

The admin dashboard automatically checks admin access on load:

```typescript
const checkAdmin = async () => {
  const response = await fetch('/api/admin/check', {
    credentials: 'include',
  });
  const data = await response.json();
  
  if (!data.isAdmin) {
    setError('Access denied. Admin privileges required.');
    return;
  }
  // Load admin data...
};
```

---

## Quick Setup Checklist

- [ ] Create an account with the email you want to use as admin
- [ ] Set `ADMIN_EMAILS` environment variable in Vercel
- [ ] Add your email to the comma-separated list
- [ ] Redeploy the application
- [ ] Log in with your admin email
- [ ] Verify "Admin Panel" link appears in profile dropdown
- [ ] Access `/admin/dashboard` to confirm access

---

## Support

If you continue to have issues accessing the admin panel:

1. **Check the logs:**
   - Vercel deployment logs
   - Browser console errors
   - Network tab for API responses

2. **Verify configuration:**
   - Environment variables are set correctly
   - Email matches exactly (case-insensitive)
   - Application is deployed with latest changes

3. **Test locally:**
   - Set `ADMIN_EMAILS` in `.env.local`
   - Test admin access in development
   - Verify behavior matches production

---

**Last Updated:** 2024  
**Maintained By:** PAATA.AI Development Team

