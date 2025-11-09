# Debug Login/Signup Issues

## Step 1: Test Database Connection

Visit this URL in your browser:
```
https://paata-ai-8y5bzf9m9-curvvtech.vercel.app/api/test-db
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Database connection successful",
  "databaseUrlExists": true,
  "prismaDatabaseUrlExists": false,
  "usingUrl": "Direct",
  "userFound": false
}
```

**If you get an error:**
- Check the error message
- Note the error code
- Check if DATABASE_URL is set

## Step 2: Check Browser Console

1. Open your browser DevTools (F12)
2. Go to **Console** tab
3. Try to login
4. Look for error messages

**Common errors:**
- `Network error` - API endpoint not reachable
- `Invalid credentials` - User doesn't exist or wrong password
- `Database connection error` - DATABASE_URL not set or wrong

## Step 3: Check Network Tab

1. Open DevTools → **Network** tab
2. Try to login
3. Find the `/api/auth/login` request
4. Click on it to see:
   - **Status Code** (200 = success, 401 = invalid credentials, 500 = server error)
   - **Response** (the error message)
   - **Request Payload** (what was sent)

## Step 4: Check Vercel Function Logs

1. Go to **Vercel Dashboard** → Your Project → **Functions**
2. Find a recent `/api/auth/login` execution
3. Click on it to see logs
4. Look for:
   - `[Login] Attempting to find user with email: ...`
   - `[PrismaDatabase] Getting user by email: ...`
   - `[PrismaDatabase] DATABASE_URL exists: ...`
   - Any error messages

## Step 5: Verify Environment Variables

Go to **Vercel Dashboard** → **Settings** → **Environment Variables**

**Required:**
- ✅ `DATABASE_URL` - Must be set to Neon connection string
- ✅ `JWT_SECRET` - Must be set
- ✅ `NEXT_PUBLIC_APP_URL` - Your production URL

**Check DATABASE_URL:**
- Should start with `postgresql://`
- Should NOT have quotes
- Should be set for Production, Preview, Development

## Common Issues & Fixes

### Issue 1: "Database connection error"
**Problem:** DATABASE_URL not set or incorrect

**Fix:**
1. Go to Vercel → Settings → Environment Variables
2. Verify `DATABASE_URL` is set correctly
3. Should be: `postgresql://neondb_owner:npg_BPFcJ1rX8aRZ@ep-lucky-tooth-a4m0pkav-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require`
4. Redeploy after updating

### Issue 2: "Invalid credentials"
**Problem:** User doesn't exist or wrong password

**Fix:**
1. Try signing up first (create a new account)
2. If signup works but login doesn't, it's a password issue
3. Check if user exists in Neon database

### Issue 3: "Network error"
**Problem:** API endpoint not reachable or CORS issue

**Fix:**
1. Check if the API route exists
2. Check browser console for CORS errors
3. Verify the deployment is live

### Issue 4: SQLite Error
**Problem:** Prisma client still using SQLite

**Fix:**
1. Clear Vercel build cache
2. Redeploy
3. Verify DATABASE_URL is PostgreSQL connection string

## Quick Test Commands

### Test Database Connection
```bash
curl https://paata-ai-8y5bzf9m9-curvvtech.vercel.app/api/test-db
```

### Test Login Endpoint
```bash
curl -X POST https://paata-ai-8y5bzf9m9-curvvtech.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## What to Share for Help

If you need help, share:
1. Error message from browser console
2. Response from `/api/test-db`
3. Status code from `/api/auth/login` request
4. Error message from Vercel function logs

