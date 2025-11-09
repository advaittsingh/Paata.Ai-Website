# Update Environment Variables in Vercel

## New Connection Strings & Credentials

You have new Neon database connection strings and Stack Auth credentials. Update these in Vercel:

## Step 1: Update DATABASE_URL in Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Find `DATABASE_URL`
3. Click **Edit**
4. **Replace** with the new connection string (NO QUOTES):
   ```
   postgresql://neondb_owner:npg_BPFcJ1rX8aRZ@ep-lucky-tooth-a4m0pkav-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
5. Make sure it's set for **Production, Preview, Development**
6. Click **Save**

## Step 2: Update Stack Auth Variables

Update these three variables:

### NEXT_PUBLIC_STACK_PROJECT_ID
- **Old:** `ef8407b1-8c45-4ceb-a563-51aa3e89ef9d`
- **New:** `d5f5087e-9b0a-44bf-83bd-322f85c95fd0`

### NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY
- **Old:** `pck_18q387k7csfn55pd9a9ea2c0jn96827h2k71dwq793sk8`
- **New:** `pck_b3tv6zb5gfq8waz35zegcssyej1b4r11148jas0jxrbpr`

### STACK_SECRET_SERVER_KEY
- **Old:** `ssk_ktks9ebjg41frfqxd5xa2gfyzmkv59q93qtz8rv32ty88`
- **New:** `ssk_7969nemk6zs6gmc40aj45dqnyav15hsvgkk7ee6bh1xzg`

## Step 3: Optional - Add PRISMA_DATABASE_URL

If you want to use Prisma Accelerate or keep DATABASE_URL separate:

Add new variable `PRISMA_DATABASE_URL`:
```
postgresql://neondb_owner:npg_BPFcJ1rX8aRZ@ep-lucky-tooth-a4m0pkav-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

## Step 4: Push Schema to New Database

After updating variables, push schema to the new database:

```bash
DATABASE_URL="postgresql://neondb_owner:npg_BPFcJ1rX8aRZ@ep-lucky-tooth-a4m0pkav-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require" npx prisma db push
```

## Step 5: Redeploy

After updating all variables:

1. Go to **Vercel Dashboard** → **Deployments**
2. Click **"..."** on latest deployment
3. Select **"Redeploy"**
4. **UNCHECK** "Use existing Build Cache" (important!)
5. Click **"Redeploy"**

## Verification Checklist

After redeploying, verify:

- [ ] Visit: `https://your-app.vercel.app/api/test-db`
- [ ] Should return: `{"success": true}`
- [ ] No SQLite errors
- [ ] Try signup - should work
- [ ] Try login - should work

## Important Notes

### Connection String Format
- ✅ **Pooler** (recommended for Vercel): `ep-lucky-tooth-a4m0pkav-pooler.us-east-1.aws.neon.tech`
- ✅ **Direct** (for migrations): `ep-lucky-tooth-a4m0pkav.us-east-1.aws.neon.tech`

### No Quotes!
When adding to Vercel, make sure there are **NO QUOTES** around the connection string.

**Correct:**
```
postgresql://neondb_owner:npg_BPFcJ1rX8aRZ@ep-lucky-tooth-a4m0pkav-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Wrong:**
```
"postgresql://neondb_owner:npg_BPFcJ1rX8aRZ@ep-lucky-tooth-a4m0pkav-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

## All Environment Variables Summary

Here's what should be set in Vercel:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_BPFcJ1rX8aRZ@ep-lucky-tooth-a4m0pkav-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require` |
| `NEXT_PUBLIC_STACK_PROJECT_ID` | `d5f5087e-9b0a-44bf-83bd-322f85c95fd0` |
| `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY` | `pck_b3tv6zb5gfq8waz35zegcssyej1b4r11148jas0jxrbpr` |
| `STACK_SECRET_SERVER_KEY` | `ssk_7969nemk6zs6gmc40aj45dqnyav15hsvgkk7ee6bh1xzg` |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` (your actual URL) |
| `JWT_SECRET` | (your JWT secret if using custom JWT) |

## Troubleshooting

If you still get errors after updating:

1. **Clear Build Cache** - Most important step!
2. **Verify no quotes** in environment variables
3. **Check logs** - Look for `[Prisma] Creating client with: ...`
4. **Test connection** - Use `/api/test-db` endpoint

