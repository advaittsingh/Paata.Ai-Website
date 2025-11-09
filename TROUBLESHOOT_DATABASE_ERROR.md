# Troubleshooting "Database connection error"

## Quick Diagnostic Steps

### 1. Test Database Connection

After deployment, visit:
```
https://your-app.vercel.app/api/test-db
```

This will show you:
- ✅ Which database URL is being used
- ✅ If connection string exists
- ✅ Detailed error messages

### 2. Check Vercel Function Logs

1. Go to **Vercel Dashboard** → Your Project → **Functions**
2. Click on a recent `/api/auth/login` or `/api/test-db` execution
3. Look for these log messages:
   - `[Prisma] Creating client with: ...`
   - `[Prisma] Connection string preview: ...`
   - `[Test DB] DATABASE_URL exists: ...`
   - `[Test DB] PRISMA_DATABASE_URL exists: ...`
   - Any error messages

## Common Issues & Fixes

### Issue 1: Quotes in Environment Variable

**Problem:** If you copied the connection string with quotes, Vercel might include them.

**Check:**
- Go to Vercel → Settings → Environment Variables
- Click on `DATABASE_URL`
- Make sure there are **NO quotes** around the value

**Correct:**
```
postgresql://neondb_owner:npg_vZrVuJxfsH35@ep-raspy-sky-a10osabj-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

**Wrong:**
```
"postgresql://neondb_owner:npg_vZrVuJxfsH35@ep-raspy-sky-a10osabj-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
```

### Issue 2: Neon Database Not Accessible

**Problem:** Neon database might not allow connections from Vercel's IP addresses.

**Solution:**
1. Go to **Neon Dashboard** → Your Project → **Settings**
2. Check **"Connection pooling"** settings
3. Make sure **"Allow connections from anywhere"** is enabled
4. Or check IP whitelist settings

### Issue 3: Wrong Connection String Format

**Problem:** Connection string might be missing required parts.

**Check your connection string has:**
- ✅ Protocol: `postgresql://`
- ✅ Username: `neondb_owner`
- ✅ Password: `npg_vZrVuJxfsH35`
- ✅ Host: `ep-raspy-sky-a10osabj-pooler.ap-southeast-1.aws.neon.tech`
- ✅ Database: `neondb`
- ✅ SSL: `?sslmode=require`

**Full format:**
```
postgresql://USERNAME:PASSWORD@HOST/DATABASE?sslmode=require
```

### Issue 4: Using Pooler vs Direct Connection

**Problem:** Neon has two connection types:
- **Pooler** (recommended): `-pooler` in hostname
- **Direct**: No `-pooler` in hostname

**Your connection string uses pooler** (good!):
```
ep-raspy-sky-a10osabj-pooler.ap-southeast-1.aws.neon.tech
```

This is correct for serverless environments like Vercel.

### Issue 5: Database Doesn't Exist

**Problem:** The database `neondb` might not exist in Neon.

**Solution:**
1. Go to **Neon Dashboard** → Your Project
2. Check if database `neondb` exists
3. If not, create it or use the correct database name

### Issue 6: Password Changed

**Problem:** The password in connection string might be outdated.

**Solution:**
1. Go to **Neon Dashboard** → Your Project → **Connection Details**
2. Get the **latest connection string**
3. Update `DATABASE_URL` in Vercel with the new string

## Step-by-Step Fix

### Step 1: Verify Connection String in Neon

1. Go to **Neon Dashboard** → Your Project
2. Click **"Connection Details"** or **"Connection String"**
3. Copy the **Pooler** connection string (not direct)
4. It should look like:
   ```
   postgresql://neondb_owner:PASSWORD@ep-raspy-sky-a10osabj-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```

### Step 2: Update in Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Find `DATABASE_URL`
3. Click **Edit**
4. **Paste the connection string** (no quotes!)
5. Make sure it's set for **Production, Preview, Development**
6. Click **Save**

### Step 3: Verify No Quotes

After saving, click on `DATABASE_URL` again to verify:
- ✅ No quotes at the start or end
- ✅ Starts with `postgresql://`
- ✅ Contains your password
- ✅ Ends with `?sslmode=require`

### Step 4: Test Connection

1. Wait for Vercel to redeploy (or manually redeploy)
2. Visit: `https://your-app.vercel.app/api/test-db`
3. Check the response:
   - If `success: true` → Database connection works! ✅
   - If `success: false` → Check the error message

### Step 5: Check Logs

If still failing:
1. Go to **Vercel Dashboard** → **Functions**
2. Find `/api/test-db` execution
3. Check logs for:
   - `[Prisma] Creating client with: ...`
   - `[Test DB] Error message: ...`
   - `[Test DB] Error code: ...`

## Alternative: Use PRISMA_DATABASE_URL

If `DATABASE_URL` is managed by Vercel Postgres and you can't edit it:

1. **Add new variable** `PRISMA_DATABASE_URL`:
   - Value: Your Neon connection string (no quotes)
   - Environment: Production, Preview, Development

2. **The code will automatically use** `PRISMA_DATABASE_URL` if it exists

3. **Keep** `DATABASE_URL` as is (Vercel Postgres)

## Still Not Working?

If you've tried everything:

1. **Get fresh connection string from Neon:**
   - Neon Dashboard → Connection Details → Copy Pooler connection string

2. **Test connection locally:**
   ```bash
   DATABASE_URL="your-neon-connection-string" npx prisma db push
   ```
   If this works locally, the connection string is correct.

3. **Check Neon dashboard:**
   - Is the database active?
   - Are there any connection limits?
   - Is the project paused?

4. **Check Vercel logs:**
   - Look for specific error codes (P1001, P1000, etc.)
   - These Prisma error codes tell you exactly what's wrong

## Prisma Error Codes

- **P1000**: Authentication failed
- **P1001**: Can't reach database server
- **P1002**: Database server doesn't exist
- **P1003**: Database doesn't exist
- **P1009**: Database already exists
- **P1011**: TLS connection error
- **P1017**: Server closed connection

Check which error code you're getting in the logs!

