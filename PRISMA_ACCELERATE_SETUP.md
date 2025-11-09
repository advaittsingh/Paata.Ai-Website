# Prisma Accelerate Setup Guide

## ✅ What You Have
- ✅ Prisma Accelerate extension installed (`@prisma/extension-accelerate`)
- ✅ Prisma Accelerate connection string
- ✅ Code updated to use Accelerate

## Environment Variables Setup

### In Vercel Dashboard

Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

#### Option 1: Use Prisma Accelerate (Recommended for Production)

Set `DATABASE_URL` to your Prisma Accelerate connection string:

```
prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19WOEd5MHlMOVZRUkMtdjFoOWdCQjUiLCJhcGlfa2V5IjoiMDFLOU1TMUc5Q1hSUFJGOTFQTUJIRUpNR00iLCJ0ZW5hbnRfaWQiOiJjNmQ0ZjRmMjM5MGM4YWExOTY1Zjg5ZTc4NDRkMWNjOTk2MmY4NGY1ZjVhM2RmZjM0NDFhMjRjOGM0NjgzNmUxIiwiaW50ZXJuYWxfc2VjcmV0IjoiZWNiMDkxNGYtN2M3MC00ZWQ4LTk0YWQtMjkxNmI3YjM5NjI3In0.QxX62RNBFgthbzWEZdSH3n0_KBxc5b_xY4hRMU51YKs
```

**Benefits:**
- ✅ Connection pooling
- ✅ Query caching
- ✅ Better performance
- ✅ Works with Neon database

#### Option 2: Use Neon Directly

If you prefer to connect directly to Neon (without Accelerate):

```
postgresql://neondb_owner:npg_vZrVuJxfsH35@ep-raspy-sky-a10osabj-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

### Other Required Variables

Also add these:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_STACK_PROJECT_ID` | `ef8407b1-8c45-4ceb-a563-51aa3e89ef9d` |
| `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY` | `pck_18q387k7csfn55pd9a9ea2c0jn96827h2k71dwq793sk8` |
| `STACK_SECRET_SERVER_KEY` | `ssk_ktks9ebjg41frfqxd5xa2gfyzmkv59q93qtz8rv32ty88` |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |

## How It Works

The code automatically detects if you're using Prisma Accelerate by checking if `DATABASE_URL` starts with `prisma+`:

- ✅ If `DATABASE_URL` starts with `prisma+` → Uses Accelerate extension
- ✅ Otherwise → Uses regular Prisma Client

## Push Schema to Database

### If Using Prisma Accelerate

Prisma Accelerate connects to your underlying database (Neon). You still need to push the schema:

```bash
# Use the direct Neon connection string for schema operations
DATABASE_URL="postgresql://neondb_owner:npg_vZrVuJxfsH35@ep-raspy-sky-a10osabj-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require" npx prisma db push
```

Or temporarily update your `.env` file:

```env
# For schema operations, use direct Neon connection
DATABASE_URL="postgresql://neondb_owner:npg_vZrVuJxfsH35@ep-raspy-sky-a10osabj-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
```

Then:
```bash
npx prisma db push
```

After pushing, change back to Accelerate connection string in Vercel.

### If Using Neon Directly

```bash
npx prisma db push
```

## Testing

1. **Test Database Connection:**
   Visit: `https://your-app.vercel.app/api/test-db`
   Should return: `{"success": true}`

2. **Test Login/Signup:**
   - Try signing up
   - Try logging in

## Important Notes

### Prisma Accelerate Benefits
- 🚀 **Connection Pooling**: Manages database connections efficiently
- ⚡ **Query Caching**: Caches frequently used queries
- 📊 **Better Performance**: Faster response times
- 🔒 **Secure**: Encrypted connections

### When to Use Each

**Use Prisma Accelerate (Recommended):**
- ✅ Production deployments
- ✅ High traffic applications
- ✅ When you want connection pooling
- ✅ When you want query caching

**Use Direct Connection:**
- ✅ Development/testing
- ✅ When you need direct database access
- ✅ When debugging connection issues

## Troubleshooting

### Schema Push Fails with Accelerate
- Use direct Neon connection string for `npx prisma db push`
- Accelerate is for queries, not schema operations

### Connection Errors
- Verify `DATABASE_URL` is set correctly in Vercel
- Check that Accelerate API key is valid
- Ensure underlying database (Neon) is accessible

### Performance Issues
- Accelerate should improve performance
- If not, check Accelerate dashboard for metrics
- Verify you're using the Accelerate connection string

## Next Steps

1. ✅ Code updated to use Accelerate
2. ⏳ Set `DATABASE_URL` in Vercel (use Accelerate connection string)
3. ⏳ Push schema to Neon database
4. ⏳ Add Stack Auth variables
5. ⏳ Test login/signup

