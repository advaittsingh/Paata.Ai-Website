# 🔧 Vercel Authentication Fix Guide

## Changes Made

1. **Cookie Settings Updated**: Changed `sameSite` from `'strict'` to `'lax'` for better Vercel compatibility
2. **CSRF Protection**: Added ability to disable CSRF by setting `ENABLE_CSRF_PROTECTION=false`
3. **Better Error Logging**: Added detailed logging for debugging

## Immediate Steps to Fix

### Step 1: Set Environment Variable in Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables:

**Add/Update:**
- `ENABLE_CSRF_PROTECTION` = `false` (temporarily, for testing)

This will disable CSRF protection and help identify if CSRF is the issue.

### Step 2: Verify Required Environment Variables

Ensure these are set:
- ✅ `DATABASE_URL` - Your PostgreSQL connection string
- ✅ `JWT_SECRET` - A long random string (generate with: `openssl rand -base64 32`)
- ✅ `NEXT_PUBLIC_APP_URL` - Your Vercel URL (e.g., `https://your-app.vercel.app`)
- ✅ `OPENAI_API_KEY` - Your OpenAI API key
- ✅ `ADMIN_EMAIL` - Admin user email

### Step 3: Redeploy

After setting environment variables, redeploy:
```bash
vercel --prod
```

Or push to GitHub (if auto-deploy is enabled):
```bash
git push origin main
```

## Testing

1. **Test CSRF Token Endpoint**:
   ```bash
   curl https://your-app.vercel.app/api/csrf-token -v
   ```
   Check if cookie is set in response headers.

2. **Test Login/Signup**:
   - Open browser DevTools → Network tab
   - Try to login/signup
   - Check the request/response:
     - Status code
     - Response body (error message)
     - Request headers (check if CSRF token is sent)

3. **Check Vercel Logs**:
   - Go to Vercel Dashboard → Your Project → Functions
   - Click on `/api/auth/login` or `/api/auth/signup`
   - Check the logs for error messages

## Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "CSRF token is required" | Token not being sent | Check if `/api/csrf-token` is called before login/signup |
| "Invalid CSRF token" | Token mismatch | Set `ENABLE_CSRF_PROTECTION=false` temporarily |
| "Database connection failed" | DATABASE_URL incorrect | Verify DATABASE_URL is correct |
| "JWT_SECRET is not defined" | Missing env var | Add JWT_SECRET to Vercel |

## If Still Not Working

1. **Check Browser Console**: Look for JavaScript errors
2. **Check Network Tab**: See the exact error response
3. **Check Vercel Function Logs**: Look for server-side errors
4. **Test with CSRF Disabled**: Set `ENABLE_CSRF_PROTECTION=false` to isolate the issue

## After Fixing

Once login/signup works:
1. Re-enable CSRF protection: Set `ENABLE_CSRF_PROTECTION=true`
2. Test again to ensure CSRF works correctly
3. Monitor logs for any issues

