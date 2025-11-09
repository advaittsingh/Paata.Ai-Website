# Fix: "Unable to open the database file" (SQLite Error)

## Problem
You're getting this error:
```
Error code 14: Unable to open the database file
```

This means Prisma is still trying to use **SQLite** instead of **PostgreSQL**, even though your schema is configured for PostgreSQL.

## Root Cause
The Prisma client was generated with SQLite before, and it's cached. Vercel might be using the old cached client.

## Solution

### Step 1: Force Regenerate Prisma Client

The build script already includes `prisma generate`, but we need to ensure it runs with the correct DATABASE_URL.

### Step 2: Clear Vercel Build Cache

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **General**
2. Scroll to **"Build & Development Settings"**
3. Click **"Clear Build Cache"** or **"Redeploy"** with **"Clear cache and redeploy"** option

### Step 3: Verify Environment Variables

Make sure `DATABASE_URL` in Vercel:
- ✅ Has **NO quotes** around it
- ✅ Starts with `postgresql://` (not `file:./dev.db`)
- ✅ Is set for **Production, Preview, Development**

### Step 4: Force Clean Build

Add this to your `package.json` build script to ensure clean Prisma generation:

```json
"build": "rm -rf node_modules/.prisma node_modules/@prisma/client && prisma generate && next build"
```

Or manually trigger a clean build:

```bash
# Locally
rm -rf node_modules/.prisma node_modules/@prisma/client .next
npm run build
```

### Step 5: Verify Schema is PostgreSQL

Check `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // ✅ Should be postgresql, NOT sqlite
  url      = env("DATABASE_URL")
}
```

## Quick Fix Commands

Run these locally to verify:

```bash
# 1. Clear Prisma cache
rm -rf node_modules/.prisma node_modules/@prisma/client

# 2. Verify schema
cat prisma/schema.prisma | grep provider

# 3. Generate with PostgreSQL
DATABASE_URL="postgresql://neondb_owner:npg_vZrVuJxfsH35@ep-raspy-sky-a10osabj-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require" npx prisma generate

# 4. Test connection
DATABASE_URL="postgresql://neondb_owner:npg_vZrVuJxfsH35@ep-raspy-sky-a10osabj-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require" npx prisma db push --skip-generate
```

## For Vercel Deployment

### Option 1: Clear Build Cache (Recommended)

1. Vercel Dashboard → Your Project → **Deployments**
2. Click **"..."** on latest deployment
3. Select **"Redeploy"**
4. Check **"Use existing Build Cache"** → **UNCHECK IT**
5. Click **"Redeploy"**

### Option 2: Update Build Command

Temporarily update `package.json`:

```json
"build": "rm -rf .next node_modules/.prisma && prisma generate && next build"
```

Then commit and push:
```bash
git add package.json
git commit -m "Force clean Prisma client generation in build"
git push origin main
```

## Verify Fix

After redeploying:

1. Visit: `https://your-app.vercel.app/api/test-db`
2. Should return: `{"success": true}` (not SQLite error)
3. Check logs - should see `[Prisma] Creating client with: Direct connection` or `Prisma Accelerate`

## Why This Happens

- Prisma client is generated during build
- If build cache has old SQLite client, it gets reused
- Environment variables might not be available during client generation
- Solution: Force regenerate and clear cache

## Still Not Working?

If you still get SQLite errors:

1. **Check Vercel build logs:**
   - Look for `prisma generate` output
   - Should see "Generated Prisma Client" with PostgreSQL

2. **Verify DATABASE_URL in build:**
   - Check if DATABASE_URL is available during build
   - Vercel should inject it, but verify in build logs

3. **Try using PRISMA_DATABASE_URL:**
   - Add `PRISMA_DATABASE_URL` with Neon connection string
   - Code will use this instead of DATABASE_URL

4. **Check for .env files:**
   - Make sure no `.env.local` or `.env` has SQLite connection string
   - These might override Vercel environment variables

