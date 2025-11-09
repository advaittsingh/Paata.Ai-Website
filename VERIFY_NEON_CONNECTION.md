# Verify Neon Database Connection

## From Neon Dashboard

You're currently in the Neon dashboard. Let's verify everything is set up correctly:

### 1. Get Connection String from Neon

1. In Neon Dashboard, click on **"Connection Details"** or look for **"Connection string"**
2. Copy the **Pooler** connection string (recommended for Vercel)
3. It should look like:
   ```
   postgresql://neondb_owner:npg_BPFcJ1rX8aRZ@ep-lucky-tooth-a4m0pkav-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

### 2. Verify in Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Find `DATABASE_URL`
3. Compare it with the connection string from Neon
4. Make sure they match exactly (no quotes!)

### 3. Test Connection from Neon

In Neon Dashboard:
1. Click **"SQL Editor"** in the left sidebar
2. Run a test query:
   ```sql
   SELECT COUNT(*) FROM "User";
   ```
3. This will tell you if:
   - ✅ Connection works
   - ✅ Tables exist
   - ✅ How many users you have

### 4. Check if Tables Exist

In Neon SQL Editor, run:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see tables like:
- User
- Note
- Flashcard
- ExamSession
- etc.

### 5. Check if Users Exist

```sql
SELECT email, "firstName", "lastName" FROM "User" LIMIT 5;
```

If this returns rows, users exist. If empty, you need to sign up first.

## Common Issues

### Issue: Connection String Mismatch
- Neon connection string might have changed
- Get fresh one from Neon Dashboard
- Update in Vercel

### Issue: Database Paused
- Check if database is active (not paused)
- Neon free tier pauses inactive databases

### Issue: No Tables
- Tables weren't created
- Run: `npx prisma db push` locally with Neon connection string

### Issue: No Users
- Database is empty
- Try signing up to create first user

## Next Steps

1. ✅ Get connection string from Neon
2. ✅ Verify it matches Vercel DATABASE_URL
3. ✅ Test connection: `/api/test-db`
4. ✅ Check if users exist in database
5. ✅ Try signup (creates first user)
6. ✅ Try login (with created user)

