# 🔧 Vercel Authentication Troubleshooting Guide

## Common Issues When Login/Signup Works on Localhost but Fails on Vercel

### 1. ⚠️ **CSRF Token Extraction Bug (CRITICAL)**

**Problem**: The `extractCsrfToken` function tries to read the request body twice, which fails on Vercel.

**Location**: `src/lib/csrf.ts` line 90-108

**Fix**: The function needs to be refactored to read the body only once.

### 2. 🔐 **Missing Environment Variables**

Check that these are set in Vercel Dashboard → Settings → Environment Variables:

**Required:**
- ✅ `DATABASE_URL` - PostgreSQL connection string
- ✅ `JWT_SECRET` - Secret for JWT token generation
- ✅ `NEXT_PUBLIC_APP_URL` - Your Vercel app URL (e.g., `https://your-app.vercel.app`)

**Optional but Recommended:**
- `ENABLE_CSRF_PROTECTION` - Set to `false` to disable CSRF (for testing)
- `NODE_ENV` - Automatically set to `production` by Vercel

### 3. 🍪 **Cookie Issues**

**Problem**: Cookies might not be set properly due to:
- Domain mismatch
- SameSite policy
- Secure flag requirements

**Check:**
- Ensure `NEXT_PUBLIC_APP_URL` uses `https://` (not `http://`)
- Cookies require HTTPS in production
- Check browser console for cookie errors

### 4. 🗄️ **Database Connection**

**Problem**: Database might not be accessible from Vercel.

**Check:**
- Database allows connections from Vercel's IP addresses
- `DATABASE_URL` is correct and accessible
- Database is not blocked by firewall
- Check Vercel function logs for database connection errors

### 5. 🔍 **How to Debug**

#### Step 1: Check Vercel Function Logs
1. Go to Vercel Dashboard → Your Project → Functions
2. Click on a failed function
3. Check the logs for specific error messages

#### Step 2: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors related to:
   - CSRF token
   - Network requests
   - Cookie errors

#### Step 3: Check Network Tab
1. Open browser DevTools → Network tab
2. Try to login/signup
3. Check the failed request:
   - Status code
   - Response body
   - Request headers
   - Response headers

#### Step 4: Test CSRF Token Endpoint
```bash
# Test if CSRF token endpoint works
curl https://your-app.vercel.app/api/csrf-token -v
```

Check if:
- Response returns a token
- Cookie is set in response headers
- Cookie has correct attributes (Secure, SameSite, HttpOnly)

### 6. 🛠️ **Quick Fixes**

#### Option A: Temporarily Disable CSRF Protection
1. In Vercel Dashboard → Environment Variables
2. Add: `ENABLE_CSRF_PROTECTION` = `false`
3. Redeploy

#### Option B: Fix the CSRF Token Extraction Bug
The code needs to be updated to read the request body only once.

#### Option C: Check Cookie Settings
Ensure cookies are being set with correct attributes:
- `secure: true` (for HTTPS)
- `sameSite: 'lax'` or `'none'` (if cross-domain)
- `httpOnly: true` (for security)

### 7. 📋 **Checklist**

Before deploying to Vercel, ensure:

- [ ] All environment variables are set in Vercel
- [ ] `DATABASE_URL` is accessible from Vercel
- [ ] `JWT_SECRET` is set and secure
- [ ] `NEXT_PUBLIC_APP_URL` uses `https://`
- [ ] Database allows connections from Vercel
- [ ] CSRF token endpoint works (`/api/csrf-token`)
- [ ] Cookies are being set correctly
- [ ] No CORS issues
- [ ] API routes are accessible

### 8. 🐛 **Common Error Messages**

| Error Message | Likely Cause | Solution |
|-------------|-------------|----------|
| "CSRF token is required" | CSRF token not being sent | Check CSRF token fetch |
| "Invalid CSRF token" | Token mismatch | Fix CSRF token extraction |
| "Database connection failed" | Database not accessible | Check DATABASE_URL and firewall |
| "JWT_SECRET is not defined" | Missing env variable | Add JWT_SECRET to Vercel |
| "Network error" | CORS or connection issue | Check API endpoint accessibility |

### 9. 📞 **Next Steps**

1. Check Vercel function logs for specific errors
2. Verify all environment variables are set
3. Test the CSRF token endpoint
4. Check browser console for errors
5. Review the fixes in the code

