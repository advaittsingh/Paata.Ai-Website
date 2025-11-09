# 🔍 Vercel Authentication Debugging Guide

## Quick Fixes to Try

### 1. **Temporarily Disable CSRF Protection** (Quick Test)

In Vercel Dashboard → Environment Variables:
- Add: `ENABLE_CSRF_PROTECTION` = `false`
- Redeploy

This will help determine if CSRF is the issue.

### 2. **Check Cookie Settings**

The issue might be with `sameSite: 'strict'`. Let's make it more flexible for Vercel.

### 3. **Verify Environment Variables**

Ensure these are set in Vercel:
- ✅ `DATABASE_URL`
- ✅ `JWT_SECRET`
- ✅ `NEXT_PUBLIC_APP_URL` (must be your Vercel URL with https://)
- ✅ `NODE_ENV` (automatically set to 'production' by Vercel)

### 4. **Check Browser Console**

Open DevTools → Console and look for:
- CSRF token errors
- Network request failures
- Cookie errors

### 5. **Test CSRF Token Endpoint**

```bash
curl https://your-app.vercel.app/api/csrf-token -v
```

Check if:
- Response returns a token
- Cookie is set in response headers
- Cookie has correct attributes

## Common Issues

1. **CSRF Token Cookie Not Being Set**
   - Check if `secure: true` requires HTTPS (should be fine on Vercel)
   - `sameSite: 'strict'` might be too restrictive

2. **Request Body Reading Issues**
   - The body can only be read once
   - Our fix should handle this, but edge cases might exist

3. **Environment Variables**
   - Missing `JWT_SECRET` will cause token generation to fail
   - Missing `DATABASE_URL` will cause database errors

## Next Steps

1. Check Vercel function logs for specific errors
2. Test with CSRF disabled
3. Verify all environment variables
4. Check browser console for client-side errors

