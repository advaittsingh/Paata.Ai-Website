# 🔧 Admin Dashboard Troubleshooting Guide

## Issues & Solutions

### 1. "View User Details" Error

**Problem:** Clicking "View Details" on a user shows an error or crashes.

**Root Cause:** The modal tries to access properties (`totalInteractions`, `streakDays`) that may not be directly on the user object but are nested in `stats`.

**Solution:** Fixed in the code to:
- Properly merge user data from API response
- Safely access nested properties with fallbacks
- Show additional user statistics (notes, flashcards, exam sessions, chat sessions)

**Fixed Code:**
```typescript
const fetchUserDetails = async (userId: string) => {
  try {
    const response = await fetch(`/api/admin/users?userId=${userId}&includeStats=true`, {
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.user) {
        // Merge the fetched user data with the existing user object
        const fullUserData = {
          ...data.user,
          totalInteractions: data.user.stats?.totalInteractions || data.user.totalInteractions || 0,
          streakDays: data.user.stats?.streakDays || data.user.streakDays || 0,
        };
        setSelectedUser(fullUserData);
      }
    }
  } catch (err) {
    console.error('Fetch user details error:', err);
    setError(err.message || 'Failed to load user details');
  }
};
```

---

### 2. Disk Usage Warning (100%)

**What it means:**
- The monitoring system is checking the **ephemeral filesystem** of the Vercel serverless function
- In serverless environments, disk space is **extremely limited** (typically 512MB-1GB)
- The warning shows: `Disk usage: 100.00%, 23.75 MB / 23.75 MB`

**Is this a problem?**
- **Usually NO** - This is expected in serverless environments
- Vercel functions have a small temporary filesystem that gets cleared after each invocation
- The 23.75 MB limit is the **ephemeral storage** allocated to the function, not your actual database or storage

**When to worry:**
- If you're writing large files to the filesystem in your functions
- If you're caching large amounts of data locally
- If you're processing large uploads without streaming

**Solutions:**
1. **Use external storage** (S3, Cloudflare R2) for file uploads
2. **Stream large files** instead of loading them into memory
3. **Use database** for data storage, not filesystem
4. **Clear temporary files** after processing

**Note:** The monitoring system tries to check disk usage, but in serverless environments, this is often not meaningful. The warning can be safely ignored if you're not writing large files to the filesystem.

---

### 3. Memory Usage Warning (92.89%)

**What it means:**
- The monitoring is checking the **Node.js process memory** (heap usage)
- Shows: `Memory usage: 92.89%, 26.52 MB / 28.55 MB`
- This is the memory used by the **current function invocation**

**Is this a problem?**
- **Usually NO** - This is normal for serverless functions
- Each function invocation gets a limited amount of memory
- The function memory is cleared after execution completes
- Vercel functions typically have 128MB-3008MB of memory available

**When to worry:**
- If memory usage consistently hits 100% and functions crash
- If you're processing very large datasets in memory
- If you have memory leaks (memory growing over time)

**Solutions:**
1. **Increase function memory** in Vercel settings (if needed)
2. **Process data in chunks** instead of loading everything into memory
3. **Use streaming** for large data processing
4. **Optimize database queries** to fetch only needed data
5. **Clear large objects** after use

**Note:** 92% memory usage during a function execution is normal, especially when:
- Processing database queries
- Handling large API responses
- Running diagnostics/health checks

---

## Understanding Vercel Serverless Limits

### Memory Limits
- **Hobby Plan:** 1024 MB per function
- **Pro Plan:** Up to 3008 MB per function
- **Enterprise:** Custom limits

### Disk/Storage Limits
- **Ephemeral storage:** ~512MB-1GB (temporary, cleared after execution)
- **Persistent storage:** Use external services (S3, R2, etc.)

### Function Timeout
- **Hobby Plan:** 10 seconds
- **Pro Plan:** 60 seconds (or up to 300 seconds with config)
- **Enterprise:** Custom limits

---

## Monitoring Best Practices

### What to Monitor
✅ **Database connection health** - Critical
✅ **API response times** - Important
✅ **Error rates** - Critical
✅ **Function execution time** - Important

### What to Ignore (in Serverless)
⚠️ **Disk usage warnings** - Usually not meaningful
⚠️ **Memory usage during execution** - Normal if < 95%
⚠️ **CPU usage spikes** - Normal for serverless

### When to Take Action

**Immediate Action Required:**
- Database connection failures
- API endpoints not responding
- Error rates > 5%
- Function timeouts

**Monitor Closely:**
- Memory usage consistently > 95%
- Response times increasing
- Disk errors (if writing files)

**Can Ignore:**
- Disk usage warnings (if not writing files)
- Memory usage 80-95% (normal for serverless)
- CPU spikes during execution

---

## Fixing the Monitoring Display

If you want to hide or adjust the disk/memory warnings for serverless environments, you can modify the monitoring API:

**File:** `src/app/api/admin/monitoring/route.ts`

Add a check for serverless environment:

```typescript
// In performHealthChecks function
const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

if (isServerless) {
  // Adjust thresholds or skip disk check
  checks.disk = {
    status: 'healthy',
    message: 'Disk check skipped (serverless environment)',
    usage: 0,
  };
  
  // Adjust memory warning threshold
  if (memoryPercent > 95) {
    checks.memory.status = 'warning';
  } else if (memoryPercent > 98) {
    checks.memory.status = 'unhealthy';
  }
}
```

---

## Testing the Fixes

### Test User Details Modal
1. Go to Admin Dashboard → Users tab
2. Click "View Details" on any user
3. Verify:
   - Modal opens without errors
   - User information displays correctly
   - Stats (interactions, streak) show properly
   - Additional counts (notes, flashcards, etc.) display

### Test Monitoring
1. Go to Admin Dashboard → Monitoring tab
2. Click "Refresh Status"
3. Verify:
   - Health checks complete
   - Database and API show as healthy
   - Disk/Memory warnings are informational (not critical)

---

## Common Errors & Solutions

### Error: "Failed to load user details"
**Solution:**
- Check browser console for API errors
- Verify user ID is valid
- Check network tab for failed requests
- Ensure admin authentication is valid

### Error: "Something went wrong" page
**Solution:**
- Check Vercel function logs
- Look for unhandled exceptions
- Verify database connection
- Check environment variables

### Monitoring shows "unknown" status
**Solution:**
- Health checks may have timed out
- Click "Run Diagnostics" to retry
- Check Vercel function logs
- Verify database connection

---

**Last Updated:** 2024  
**Maintained By:** PAATA.AI Development Team

