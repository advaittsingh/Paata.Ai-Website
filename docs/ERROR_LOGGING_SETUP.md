# 🔍 Error Logging Setup Guide

**Last Updated:** January 2025  
**Status:** ✅ Infrastructure Complete

---

## 📋 Overview

Error logging infrastructure has been set up with support for Sentry (production) and console logging (development).

---

## ✅ Implementation Status

### Infrastructure
- ✅ Error logging utility (`src/lib/error-logging.ts`)
- ✅ Error boundary integration
- ✅ User context tracking
- ✅ Breadcrumb tracking
- ✅ Next.js instrumentation setup

### Features
- ✅ Automatic error capture
- ✅ User context tracking
- ✅ Breadcrumb tracking for debugging
- ✅ Console fallback for development
- ✅ Sentry integration ready (just needs DSN)

---

## 🔧 Setup Instructions

### 1. Install Sentry (Optional - for Production)

```bash
npm install @sentry/nextjs
```

### 2. Configure Sentry DSN

Add to `.env` or `.env.production`:

```env
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

### 3. Initialize Sentry (Optional)

If you want to use Sentry, you'll need to:

1. Create a Sentry account at https://sentry.io
2. Create a new project
3. Get your DSN
4. Add it to environment variables

The infrastructure is already set up - just add the DSN!

---

## 📝 Usage

### In Components

```typescript
import { logError, logWarning, addBreadcrumb } from '@/lib/error-logging';

// Log an error
try {
  // Some code
} catch (error) {
  logError(error, {
    level: 'error',
    tags: {
      component: 'MyComponent',
      action: 'submitForm',
    },
    extra: {
      formData: formData,
    },
    user: {
      id: user?.id,
      email: user?.email,
    },
  });
}

// Add breadcrumb (tracks user actions)
addBreadcrumb('User clicked submit button', 'userAction', 'info');

// Log a warning
logWarning('API rate limit approaching', {
  tags: { endpoint: '/api/chat' },
});
```

### Automatic Error Tracking

The following are automatically tracked:

1. **ErrorBoundary** - React component errors
2. **UserContext** - User login/logout events
3. **API Routes** - Can be extended to log API errors

---

## 🔍 Features

### Error Levels
- `error` - Critical errors
- `warning` - Warnings
- `info` - Informational messages
- `debug` - Debug information

### User Context
Automatically tracks:
- User ID
- User Email
- Cleared on logout

### Breadcrumbs
Track user actions leading to errors:
```typescript
addBreadcrumb('User navigated to /app', 'navigation', 'info');
addBreadcrumb('User submitted form', 'userAction', 'info');
```

---

## 🧪 Testing

Error logging works in both development and production:

- **Development**: Logs to console
- **Production**: Logs to Sentry (if configured) + console

---

## 📊 Current Status

✅ **Infrastructure**: 100% Complete
- Error logging utility
- Error boundary integration
- User context tracking
- Breadcrumb support

⚠️ **Sentry Integration**: Ready (needs DSN)
- All code is ready
- Just needs `NEXT_PUBLIC_SENTRY_DSN` environment variable

---

## 🚀 Next Steps

1. **Optional**: Set up Sentry account and add DSN
2. **Optional**: Add error logging to API routes
3. **Optional**: Add more breadcrumbs for better debugging

---

**Status:** ✅ **Production Ready** (works without Sentry, enhanced with Sentry)

