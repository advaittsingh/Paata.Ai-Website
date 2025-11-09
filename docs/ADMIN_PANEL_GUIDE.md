# 🔐 Admin Panel Guide - Send Notifications

## Overview

The admin panel allows authorized administrators to create and send notifications to users. You can send notifications to:
- **All users** at once
- **Specific users** by selecting them individually

---

## 🚀 Setup

### 1. Configure Admin Emails

Add admin email addresses to your `.env` file:

```env
ADMIN_EMAILS=admin@paata.ai,your-email@example.com,another-admin@example.com
```

**Note:** If `ADMIN_EMAILS` is not set, the default admin email is `admin@paata.ai`.

### 2. Access the Admin Panel

1. Log in with an admin email address
2. Navigate to: **http://localhost:3000/admin/notifications**

---

## 📋 How to Use

### Step 1: Fill in Notification Details

1. **Notification Type**: Choose from:
   - `system` - System notifications
   - `achievement` - Achievement notifications
   - `reminder` - Reminder notifications
   - `update` - Update notifications
   - `exam` - Exam-related notifications
   - `subscription` - Subscription notifications

2. **Icon**: Enter an emoji (e.g., 🔔, 🎉, ⚠️)

3. **Title**: Enter a clear, concise title

4. **Message**: Enter the notification message

### Step 2: Select Recipients

**Option A: Send to All Users**
- Check "Send to all users" checkbox
- Notification will be sent to every user in the system

**Option B: Send to Specific Users**
- Uncheck "Send to all users"
- Select individual users from the list
- Selected users will be highlighted

### Step 3: Send

Click "Send Notifications" button. You'll see a success message when notifications are created.

---

## 🔧 API Endpoints

### POST `/api/admin/notifications`

Send notifications to users.

**Request Body:**
```json
{
  "userIds": ["user-id-1", "user-id-2"],  // Optional: specific user IDs
  "type": "system",
  "title": "System Maintenance",
  "message": "We'll be performing maintenance tonight.",
  "icon": "🔧",
  "metadata": {}  // Optional: additional data
}
```

**Note:** If `userIds` is empty or not provided, notifications are sent to all users.

**Response:**
```json
{
  "success": true,
  "message": "Created 150 notification(s) for all users",
  "count": 150
}
```

### GET `/api/admin/users`

Get list of all users (for admin panel).

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "user-id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "plan": "Pro"
    }
  ],
  "count": 150
}
```

### GET `/api/admin/check`

Check if current user is admin.

**Response:**
```json
{
  "isAdmin": true,
  "user": {
    "id": "user-id",
    "email": "admin@paata.ai",
    "firstName": "Admin",
    "lastName": "User"
  }
}
```

---

## 🔒 Security

- Admin access is verified on every API request
- Only users with emails in `ADMIN_EMAILS` can access admin endpoints
- All admin endpoints require authentication
- Admin panel redirects non-admin users

---

## 📝 Example Use Cases

### 1. System Maintenance Notification
```json
{
  "type": "system",
  "title": "Scheduled Maintenance",
  "message": "We'll be performing system maintenance on January 15th from 2 AM to 4 AM. The service will be temporarily unavailable.",
  "icon": "🔧"
}
```

### 2. New Feature Announcement
```json
{
  "type": "update",
  "title": "New Feature Available!",
  "message": "We've added a new exam mode feature. Try it out now!",
  "icon": "🎉"
}
```

### 3. Achievement Reminder
```json
{
  "type": "reminder",
  "title": "Keep Your Streak Going!",
  "message": "You're on a 5-day learning streak. Don't forget to study today!",
  "icon": "🔥"
}
```

---

## 🛠️ Troubleshooting

### "Access denied. Admin privileges required."
- Make sure your email is in the `ADMIN_EMAILS` environment variable
- Check that you're logged in with the correct account
- Restart the server after updating `.env`

### "Failed to load users"
- This is not critical - you can still send to all users
- Check server logs for database connection issues

### Notifications not appearing
- Check that the user is logged in
- Verify notifications are being created in the database
- Check browser console for errors

---

## 🎯 Next Steps

You can extend the admin panel to:
- View notification history
- Edit/delete notifications
- Schedule notifications
- View notification analytics
- Create notification templates

---

## 📞 Support

For issues or questions, check the server logs or contact the development team.

