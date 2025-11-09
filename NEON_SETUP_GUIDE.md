# Neon Database + Stack Auth Setup Guide

## ✅ What You Have
- ✅ Neon PostgreSQL database connection string
- ✅ Stack Auth credentials
- ✅ Prisma schema updated to use PostgreSQL

## Step 1: Update Local Environment Variables

Create/update your local `.env` file with:

```env
# Neon Database
DATABASE_URL='postgresql://neondb_owner:npg_vZrVuJxfsH35@ep-raspy-sky-a10osabj-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'

# Stack Auth
NEXT_PUBLIC_STACK_PROJECT_ID='ef8407b1-8c45-4ceb-a563-51aa3e89ef9d'
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY='pck_18q387k7csfn55pd9a9ea2c0jn96827h2k71dwq793sk8'
STACK_SECRET_SERVER_KEY='ssk_ktks9ebjg41frfqxd5xa2gfyzmkv59q93qtz8rv32ty88'

# JWT Secret (if you're using custom JWT)
JWT_SECRET='your-jwt-secret-here'

# App URL
NEXT_PUBLIC_APP_URL='https://your-app.vercel.app'

# Optional: Other API keys
OPENAI_API_KEY='your-openai-key'
GEMINI_API_KEY='your-gemini-key'
```

## Step 2: Push Database Schema to Neon

Run these commands locally:

```bash
# Generate Prisma client for PostgreSQL
npx prisma generate

# Push schema to Neon database (creates all tables)
npx prisma db push

# Optional: Open Prisma Studio to verify tables were created
npx prisma studio
```

## Step 3: Set Environment Variables in Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. Add these variables (one by one):

   **DATABASE_URL**
   - Key: `DATABASE_URL`
   - Value: `postgresql://neondb_owner:npg_vZrVuJxfsH35@ep-raspy-sky-a10osabj-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`
   - Environment: Production, Preview, Development (select all)

   **NEXT_PUBLIC_STACK_PROJECT_ID**
   - Key: `NEXT_PUBLIC_STACK_PROJECT_ID`
   - Value: `ef8407b1-8c45-4ceb-a563-51aa3e89ef9d`
   - Environment: Production, Preview, Development (select all)

   **NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY**
   - Key: `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`
   - Value: `pck_18q387k7csfn55pd9a9ea2c0jn96827h2k71dwq793sk8`
   - Environment: Production, Preview, Development (select all)

   **STACK_SECRET_SERVER_KEY**
   - Key: `STACK_SECRET_SERVER_KEY`
   - Value: `ssk_ktks9ebjg41frfqxd5xa2gfyzmkv59q93qtz8rv32ty88`
   - Environment: Production, Preview, Development (select all)

   **JWT_SECRET** (if using custom JWT)
   - Key: `JWT_SECRET`
   - Value: `your-secret-key-here` (generate a random string)
   - Environment: Production, Preview, Development (select all)

   **NEXT_PUBLIC_APP_URL**
   - Key: `NEXT_PUBLIC_APP_URL`
   - Value: `https://your-app.vercel.app` (replace with your actual Vercel URL)
   - Environment: Production, Preview, Development (select all)

3. Click **Save** after adding each variable

## Step 4: Verify Database Connection

After deploying, test the database connection:

1. Visit: `https://your-app.vercel.app/api/test-db`
2. Should return: `{"success": true, "message": "Database connection successful"}`

## Step 5: Deploy to Vercel

```bash
# Commit the schema changes
git add prisma/schema.prisma
git commit -m "Switch from SQLite to Neon PostgreSQL"
git push origin main
```

Vercel will automatically:
1. Detect the push
2. Run `prisma generate` (from build script)
3. Build and deploy your app

## Step 6: Test Login/Signup

After deployment completes:

1. Go to your production site
2. Try signing up with a new account
3. Try logging in
4. Check Vercel function logs if there are errors

## Troubleshooting

### Database Connection Fails
- Verify `DATABASE_URL` is set correctly in Vercel
- Check Neon dashboard to ensure database is active
- Ensure connection string includes `?sslmode=require`

### Tables Don't Exist
- Run `npx prisma db push` locally first
- Or use `npx prisma migrate dev` for migrations

### Prisma Client Errors
- Run `npx prisma generate` locally
- Verify build script includes `prisma generate`

### Stack Auth Not Working
- Verify all Stack Auth environment variables are set
- Check that `NEXT_PUBLIC_*` variables are accessible on client side
- Verify Stack Auth project is active

## Next Steps

1. ✅ Database is now PostgreSQL (works on Vercel)
2. ✅ Environment variables are set
3. ✅ Schema is pushed to Neon
4. ✅ Login/signup should work!

## Important Notes

- 🔒 **Never commit `.env` file** - it contains secrets
- ✅ **Do commit `prisma/schema.prisma`** - it's safe
- 🔄 **Redeploy after adding environment variables** in Vercel
- 📝 **Keep your connection strings secure** - don't share them publicly

