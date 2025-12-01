# 🔔 Notification Troubleshooting Guide

## Issue: Notifications Sent from Admin Panel Not Appearing in App

If you sent a notification from the admin panel but didn't receive it, follow these troubleshooting steps:

---

## Quick Checks

### 1. Verify Notification Was Created

**Check via Admin Panel:**
1. Go to `/admin/notifications`
2. After sending, check if you see a success message
3. The message should say: "Created X notification(s)" or "Created X notification(s) for all users"

**Check via API:**
```bash
# Get notifications for a specific user
curl -X GET "https://www.paataai.com/api/admin/notifications?userId=USER_ID" \
  -H "Cookie: auth_token=YOUR_ADMIN_TOKEN" \
  --cookie-jar cookies.txt
```

### 2. Navigate to Notifications Page

**Important:** Notifications are not pushed to users automatically. You must:

1. **Go to the notifications page:**
   - URL: `https://www.paataai.com/notifications`
   - Or click "Notifications" in the navbar

2. **Refresh the page** if you're already on it

3. **Check the filter:**
   - Make sure you're viewing "All" notifications, not just "Unread"
   - The page has filters: All, Unread, System, Achievement, etc.

### 3. Verify User ID Match

**Common Issue:** The notification might have been sent to a different user ID.

**Check:**
1. In admin panel, when sending to specific users, verify you selected the correct user
2. If you sent "to all users", make sure your account exists and is active
3. Verify your user ID matches the notification's `userId` in the database

---

## Step-by-Step Troubleshooting

### Step 1: Verify Notification Creation

**In Browser Console (on notifications page):**
```javascript
// Check if notifications API is working
fetch('/api/notifications', { credentials: 'include' })
  .then(r => r.json())
  .then(data => {
    console.log('Notifications:', data);
    console.log('Unread count:', data.unreadCount);
  });
```

**Expected Response:**
```json
{
  "success": true,
  "notifications": [
    {
      "id": "notification_id",
      "type": "system",
      "title": "Your notification title",
      "message": "Your notification message",
      "read": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "unreadCount": 1
}
```

### Step 2: Check Database Directly

If you have database access, verify the notification exists:

```sql
-- Check if notification exists for your user
SELECT * FROM "Notification" 
WHERE "userId" = 'YOUR_USER_ID' 
ORDER BY "createdAt" DESC 
LIMIT 10;
```

**Things to check:**
- ✅ Notification exists in database
- ✅ `userId` matches your account ID
- ✅ `read` field is `false` (if you're looking for unread)
- ✅ `createdAt` timestamp is recent

### Step 3: Verify User Authentication

**Check if you're logged in as the correct user:**
```javascript
// In browser console
fetch('/api/auth/verify', { credentials: 'include' })
  .then(r => r.json())
  .then(data => {
    console.log('Current user:', data.user);
    console.log('User ID:', data.user?.id);
  });
```

**Important:** The notification's `userId` must match your current logged-in user's ID.

### Step 4: Check API Response

**When sending notification from admin panel, check the response:**

Open browser DevTools → Network tab → Find the request to `/api/admin/notifications`

**Check the response:**
- Status should be `200 OK`
- Response should include: `{ "success": true, "message": "Created X notification(s)" }`
- If there's an error, check the error message

### Step 5: Clear Cache and Refresh

1. **Hard refresh the notifications page:**
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **Clear browser cache:**
   - Go to browser settings
   - Clear cache and cookies for the site
   - Log in again and check notifications

3. **Try incognito/private mode:**
   - Open the site in incognito mode
   - Log in and check notifications

---

## Common Issues & Solutions

### Issue 1: "Send to All Users" Not Working

**Problem:** You selected "Send to all users" but didn't receive it.

**Possible Causes:**
1. Your account might not be in the users list
2. Database query might have failed silently
3. Your account might be inactive or deleted

**Solution:**
1. Send notification to your specific user ID instead
2. Check admin panel user list to verify your account exists
3. Check server logs for errors

### Issue 2: Notification Created But Not Visible

**Problem:** Notification exists in database but doesn't show on `/notifications` page.

**Possible Causes:**
1. Filter is set to show only specific types
2. Notification is marked as read
3. API query is filtering it out

**Solution:**
1. Check the filter dropdown - set to "All"
2. Check both "All" and "Unread" filters
3. Verify API response includes the notification

### Issue 3: Wrong User ID

**Problem:** Notification was sent to a different user.

**Solution:**
1. In admin panel, verify you selected the correct user
2. Check your current user ID: `/api/auth/verify`
3. Compare with notification's `userId` in database

### Issue 4: Database Error

**Problem:** Notification creation failed silently.

**Check:**
1. Server logs for database errors
2. Vercel function logs
3. Database connection status

**Solution:**
1. Check database connection
2. Verify Prisma schema matches database
3. Check for migration issues

---

## Testing Notification Flow

### Test 1: Send Notification to Yourself

1. **Get your user ID:**
   ```javascript
   // In browser console
   fetch('/api/auth/verify', { credentials: 'include' })
     .then(r => r.json())
     .then(data => console.log('Your User ID:', data.user?.id));
   ```

2. **Send notification via admin panel:**
   - Go to `/admin/notifications`
   - Select your user from the list (or enter your user ID)
   - Fill in title and message
   - Click "Send Notifications"

3. **Check response:**
   - Should see success message
   - Should say "Created 1 notification(s)"

4. **Verify receipt:**
   - Go to `/notifications`
   - Refresh the page
   - Should see your notification

### Test 2: Check API Directly

**Send notification via API:**
```bash
curl -X POST "https://www.paataai.com/api/admin/notifications" \
  -H "Content-Type: application/json" \
  -H "Cookie: auth_token=YOUR_ADMIN_TOKEN" \
  -d '{
    "userIds": ["YOUR_USER_ID"],
    "type": "system",
    "title": "Test Notification",
    "message": "This is a test",
    "icon": "🔔"
  }'
```

**Check if received:**
```bash
curl -X GET "https://www.paataai.com/api/notifications" \
  -H "Cookie: auth_token=YOUR_USER_TOKEN" \
  --cookie-jar cookies.txt
```

---

## Debugging Checklist

- [ ] Notification was successfully created (check admin panel response)
- [ ] User ID matches between sender and receiver
- [ ] Navigated to `/notifications` page
- [ ] Refreshed the notifications page
- [ ] Checked all filter options (All, Unread, etc.)
- [ ] Verified user is logged in correctly
- [ ] Checked browser console for errors
- [ ] Checked network tab for API errors
- [ ] Verified notification exists in database
- [ ] Cleared browser cache and tried again
- [ ] Checked server logs for errors

---

## API Endpoints Reference

### Send Notification (Admin)
```
POST /api/admin/notifications
Body: {
  userIds: string[] (optional - empty array = all users),
  type: string,
  title: string,
  message: string,
  icon: string (optional),
  metadata: object (optional)
}
```

### Get Notifications (User)
```
GET /api/notifications?type=system&read=false&limit=50&offset=0
```

### Get User Notifications (Admin)
```
GET /api/admin/notifications?userId=USER_ID&limit=100&offset=0
```

### Mark as Read
```
PUT /api/notifications
Body: { id: "notification_id" }
```

---

## Still Not Working?

If notifications still don't appear after following all steps:

1. **Check Server Logs:**
   - Vercel deployment logs
   - Function logs
   - Database query logs

2. **Verify Database Schema:**
   - Check Prisma schema matches database
   - Verify Notification table exists
   - Check for migration issues

3. **Test with Different User:**
   - Create a test account
   - Send notification to test account
   - Verify if it works for test account

4. **Check Environment Variables:**
   - Database connection string
   - API keys
   - Any notification-related configs

---

## Expected Behavior

**When notification is sent:**
1. ✅ Admin panel shows success message
2. ✅ Notification is created in database
3. ✅ User can see it on `/notifications` page
4. ✅ Unread count increases
5. ✅ Notification appears in "Unread" filter

**Note:** Currently, there is **no real-time push notification system**. Users must:
- Navigate to `/notifications` page
- Refresh the page to see new notifications
- There's no notification badge in navbar (yet)

---

**Last Updated:** 2024  
**Maintained By:** PAATA.AI Development Team



