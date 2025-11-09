# Quick Setup Checklist

## ✅ Completed
- [x] Prisma schema updated to PostgreSQL
- [x] Prisma client generated

## 🔄 Next Steps (Do These Now)

### 1. Push Schema to Neon Database
```bash
npx prisma db push
```

This will create all your tables in the Neon database.

### 2. Set Environment Variables in Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these **5 variables**:

| Variable Name | Value |
|--------------|-------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_vZrVuJxfsH35@ep-raspy-sky-a10osabj-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require` |
| `NEXT_PUBLIC_STACK_PROJECT_ID` | `ef8407b1-8c45-4ceb-a563-51aa3e89ef9d` |
| `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY` | `pck_18q387k7csfn55pd9a9ea2c0jn96827h2k71dwq793sk8` |
| `STACK_SECRET_SERVER_KEY` | `ssk_ktks9ebjg41frfqxd5xa2gfyzmkv59q93qtz8rv32ty88` |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` (replace with your actual URL) |

**Important:** Select **Production, Preview, Development** for all variables.

### 3. Commit and Push
```bash
git add prisma/schema.prisma
git commit -m "Switch to Neon PostgreSQL database"
git push origin main
```

### 4. Wait for Deployment
Vercel will automatically redeploy. Wait 2-3 minutes.

### 5. Test
1. Visit: `https://your-app.vercel.app/api/test-db`
   - Should show: `{"success": true}`
2. Try signing up
3. Try logging in

## 🎉 That's It!

Once these steps are done, login/signup should work perfectly!

