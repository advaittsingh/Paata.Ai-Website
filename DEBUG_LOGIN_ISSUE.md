# Debugging Login Issue on Vercel

## Steps to Diagnose

### 1. Test Database Connectivity
After deployment, visit this URL in your browser:
```
https://your-app.vercel.app/api/test-db
```

This will tell you if:
- ✅ Database connection is working
- ❌ Database connection is failing (and why)

### 2. Check Vercel Function Logs
1. Go to Vercel Dashboard → Your Project → Functions
2. Click on a recent `/api/auth/login` function execution
3. Check the logs for:
   - `[Login] Attempting to find user with email: ...`
   - `[PrismaDatabase] Getting user by email: ...`
   - `[PrismaDatabase] DATABASE_URL exists: ...`
   - Any error messages

### 3. Verify Environment Variables
Go to Vercel Dashboard → Settings → Environment Variables and verify:

**Required:**
- ✅ `DATABASE_URL` - Must be set and valid
- ✅ `JWT_SECRET` - Must be set
- ✅ `NEXT_PUBLIC_APP_URL` - Your production URL

**Check DATABASE_URL format:**
- For SQLite: `file:./dev.db` (won't work on Vercel!)
- For PostgreSQL: `postgresql://user:password@host:port/database?sslmode=require`
- For MySQL: `mysql://user:password@host:port/database`

### 4. Common Issues

#### Issue 1: SQLite Database
**Problem:** If your `DATABASE_URL` points to a SQLite file (`file:./dev.db`), it won't work on Vercel because:
- Vercel functions are stateless
- File system is read-only
- SQLite requires a writable file system

**Solution:** Use a cloud database (PostgreSQL, MySQL, etc.)

#### Issue 2: Database Not Accessible
**Problem:** Database might be:
- Not accessible from Vercel's IP addresses
- Behind a firewall
- Using wrong connection string

**Solution:** 
- Check database provider's IP whitelist
- Ensure database allows connections from anywhere (0.0.0.0/0)
- Verify connection string format

#### Issue 3: User Doesn't Exist
**Problem:** The user might not exist in the production database

**Solution:**
- Try signing up first
- Check if signup works
- Verify users exist in your database

#### Issue 4: Password Mismatch
**Problem:** Password in database doesn't match what you're entering

**Solution:**
- Try resetting password
- Check if password was hashed correctly during signup
- Verify password field exists in database

### 5. Test Signup First
If login doesn't work, try signup:
1. Go to `/auth/signup`
2. Create a new account
3. Check if signup succeeds
4. If signup works but login doesn't, it's a password verification issue

### 6. Check Browser Console
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to login
4. Check the `/api/auth/login` request:
   - Status code (should be 200 for success, 401 for invalid credentials, 500 for server error)
   - Response body (check error message)
   - Request payload (verify email/password are sent)

### 7. Manual API Test
Test the login endpoint directly:

```bash
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","password":"your-password"}' \
  -v
```

This will show you:
- HTTP status code
- Response body
- Any error messages

## Next Steps Based on Results

### If `/api/test-db` returns error:
- Database connection is the problem
- Check `DATABASE_URL` environment variable
- Verify database is accessible from Vercel
- Consider using a cloud database service (Supabase, PlanetScale, Neon, etc.)

### If `/api/test-db` works but login fails:
- Database connection is fine
- Issue is with user lookup or password verification
- Check logs for specific error messages
- Verify user exists in database
- Check password hashing/verification logic

### If signup works but login doesn't:
- Database connection is fine
- User creation works
- Issue is with password verification
- Check password hashing during signup
- Check password verification during login

## Quick Fixes to Try

1. **Temporarily disable password hashing check:**
   - This is for testing only!
   - Modify login route to accept plain text passwords temporarily

2. **Check if user exists:**
   - Query database directly to verify user exists
   - Check if password field has a value

3. **Reset password:**
   - Use forgot password feature
   - Or manually update password in database

4. **Check Prisma Client:**
   - Ensure Prisma client is generated (`prisma generate`)
   - Verify schema matches database structure

