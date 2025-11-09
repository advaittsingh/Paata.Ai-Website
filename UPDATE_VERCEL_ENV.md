# Update Vercel Environment Variables

## Current Situation
You have PostgreSQL variables in Vercel, but `DATABASE_URL` is pointing to a different database (not Neon).

## Solution: Update DATABASE_URL to Neon

### Step 1: Update DATABASE_URL in Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. Find the existing `DATABASE_URL` variable

3. Click on it to **Edit**

4. **Replace** the value with your Neon connection string:
   ```
   postgresql://neondb_owner:npg_vZrVuJxfsH35@ep-raspy-sky-a10osabj-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```

5. Make sure it's set for **Production, Preview, Development** (all environments)

6. Click **Save**

### Step 2: Add Stack Auth Variables (If Not Already Added)

Add these new variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_STACK_PROJECT_ID` | `ef8407b1-8c45-4ceb-a563-51aa3e89ef9d` |
| `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY` | `pck_18q387k7csfn55pd9a9ea2c0jn96827h2k71dwq793sk8` |
| `STACK_SECRET_SERVER_KEY` | `ssk_ktks9ebjg41frfqxd5xa2gfyzmkv59q93qtz8rv32ty88` |

### Step 3: Add/Update NEXT_PUBLIC_APP_URL

If it doesn't exist, add:
- Key: `NEXT_PUBLIC_APP_URL`
- Value: Your production URL (e.g., `https://paata-ai-xxxxx.vercel.app`)

### Step 4: Push Schema to Neon Database

Run locally (if you haven't already):

```bash
# Make sure your local .env has the Neon DATABASE_URL
npx prisma db push
```

This will create all tables in your Neon database.

### Step 5: Redeploy

After updating environment variables:

1. Go to **Vercel Dashboard** → Your Project → **Deployments**
2. Click the **three dots** (⋯) on the latest deployment
3. Click **Redeploy**

Or just push a new commit:
```bash
git commit --allow-empty -m "Trigger redeploy after env var update"
git push origin main
```

## Important Notes

### About Existing Variables
- **POSTGRES_URL**: You can keep this if it's used elsewhere, or remove it
- **PRISNA_DATABASE_URL**: This looks like Prisma Accelerate - keep it if you're using Accelerate
- **DATABASE_URL**: **This is the one Prisma uses** - must be updated to Neon

### Which Database to Use?

You have two options:

**Option A: Use Neon (Recommended)**
- ✅ Update `DATABASE_URL` to Neon connection string
- ✅ Push schema to Neon
- ✅ All data will be in Neon

**Option B: Use Existing PostgreSQL**
- ✅ Keep existing `DATABASE_URL`
- ✅ Push schema to that database instead
- ⚠️ Need to know what service it's from

Since you provided Neon credentials, I recommend **Option A**.

## After Update

1. ✅ Test database: `https://your-app.vercel.app/api/test-db`
2. ✅ Try signup
3. ✅ Try login

## Troubleshooting

### If DATABASE_URL update doesn't work:
- Make sure you saved the variable
- Redeploy the application
- Check Vercel function logs for connection errors

### If tables don't exist:
- Run `npx prisma db push` locally with Neon DATABASE_URL
- Verify connection string is correct

### If you want to keep both databases:
- Use `DATABASE_URL` for Neon (Prisma will use this)
- Keep `POSTGRES_URL` for other services if needed

