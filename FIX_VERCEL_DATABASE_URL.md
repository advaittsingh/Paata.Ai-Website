# Fix: Can't Edit DATABASE_URL in Vercel

## Problem
Vercel is preventing you from editing `DATABASE_URL` because it's connected to a Vercel Postgres database integration.

## Solution Options

### Option 1: Disconnect Vercel Postgres Integration (Recommended)

If you want to use Neon or Prisma Accelerate:

1. **Go to Vercel Dashboard** → Your Project → **Storage** tab
2. Find the **Postgres** database
3. Click on it to open details
4. Look for **"Disconnect"** or **"Delete"** option
5. Confirm disconnection

**After disconnecting:**
- You can now edit `DATABASE_URL` freely
- Set it to your Neon or Prisma Accelerate connection string

### Option 2: Use a Different Variable Name

Keep the Vercel Postgres `DATABASE_URL` and use a different variable for your database:

1. **Keep** `DATABASE_URL` as is (Vercel Postgres)
2. **Add a new variable** called `PRISMA_DATABASE_URL` with your Neon/Accelerate connection string
3. **Update the code** to use `PRISMA_DATABASE_URL` if it exists, otherwise fall back to `DATABASE_URL`

### Option 3: Use Vercel Postgres (Easiest)

If you want to keep using Vercel Postgres:

1. **Keep** `DATABASE_URL` as is
2. **Push schema** to Vercel Postgres:
   ```bash
   npx prisma db push
   ```
3. Make sure your local `.env` has the Vercel Postgres connection string

## Recommended: Option 1 (Disconnect & Use Neon/Accelerate)

### Steps:

1. **Disconnect Vercel Postgres:**
   - Vercel Dashboard → Your Project → **Storage**
   - Find Postgres → Click **"..."** menu → **"Disconnect"** or **"Delete"**

2. **Update DATABASE_URL:**
   - Go to **Settings** → **Environment Variables**
   - Now you can edit `DATABASE_URL`
   - Set it to your Prisma Accelerate connection string:
     ```
     prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19WOEd5MHlMOVZRUkMtdjFoOWdCQjUiLCJhcGlfa2V5IjoiMDFLOU1TMUc5Q1hSUFJGOTFQTUJIRUpNR00iLCJ0ZW5hbnRfaWQiOiJjNmQ0ZjRmMjM5MGM4YWExOTY1Zjg5ZTc4NDRkMWNjOTk2MmY4NGY1ZjVhM2RmZjM0NDFhMjRjOGM0NjgzNmUxIiwiaW50ZXJuYWxfc2VjcmV0IjoiZWNiMDkxNGYtN2M3MC00ZWQ4LTk0YWQtMjkxNmI3YjM5NjI3In0.QxX62RNBFgthbzWEZdSH3n0_KBxc5b_xY4hRMU51YKs
     ```

3. **Push Schema to Neon:**
   ```bash
   # Use Neon connection string for schema operations
   DATABASE_URL="postgresql://neondb_owner:npg_vZrVuJxfsH35@ep-raspy-sky-a10osabj-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require" npx prisma db push
   ```

4. **Redeploy:**
   - Vercel will automatically redeploy after you update the variable

## Alternative: Option 2 (Use Different Variable)

If you can't disconnect or want to keep both:

1. **Add new variable** `PRISMA_DATABASE_URL`:
   - Value: Your Prisma Accelerate or Neon connection string
   - Environment: Production, Preview, Development

2. **Update code** to check `PRISMA_DATABASE_URL` first:
   ```typescript
   const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL;
   ```

3. **Update Prisma client** to use this:
   ```typescript
   const baseClient = new PrismaClient({
     datasources: {
       db: {
         url: process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL,
       },
     },
   });
   ```

## Which Option Should You Choose?

**Choose Option 1 if:**
- ✅ You want to use Neon database
- ✅ You want to use Prisma Accelerate
- ✅ You don't need the Vercel Postgres database

**Choose Option 2 if:**
- ✅ You want to keep Vercel Postgres for other purposes
- ✅ You want to use Neon/Accelerate for Prisma
- ✅ You need both databases

**Choose Option 3 if:**
- ✅ You're happy with Vercel Postgres
- ✅ You don't need Neon or Accelerate
- ✅ You want the simplest solution

## After Fixing

1. ✅ Test database: `https://your-app.vercel.app/api/test-db`
2. ✅ Try signup
3. ✅ Try login

## Need Help?

If you're unsure which option to choose, I recommend **Option 1** (disconnect and use Neon/Accelerate) for the best performance and flexibility.

