# PostgreSQL Migration Guide

**Version:** 1.0  
**Last Updated:** January 2025

This guide will help you migrate from SQLite (development database) to PostgreSQL (production database).

---

## 🎯 Overview

**Current Setup:** SQLite (`file:./dev.db`)  
**Production Target:** PostgreSQL (recommended for scalability)

---

## 📋 Prerequisites

Before starting, ensure you have:
- [ ] A PostgreSQL database (local or cloud-hosted)
- [ ] Database credentials (host, port, username, password, database name)
- [ ] Network access to your PostgreSQL instance
- [ ] Backup of your current SQLite database (recommended)

---

## 🌐 PostgreSQL Hosting Options

### Option 1: Supabase (Recommended for Quick Setup)
1. Go to https://supabase.com
2. Create a new project
3. Get connection string from Settings → Database → Connection string

### Option 2: Vercel Postgres
1. Go to your Vercel project
2. Add Postgres integration
3. Get connection string from project settings

### Option 3: AWS RDS
1. Create RDS PostgreSQL instance
2. Configure security groups
3. Get connection string from RDS console

### Option 4: Local PostgreSQL
1. Install PostgreSQL locally
2. Create database: `createdb paataai`
3. Connection string: `postgresql://localhost:5432/paataai`

---

## 🔧 Step-by-Step Migration

### Step 1: Update Prisma Schema

1. Open `prisma/schema.prisma`
2. Update the datasource:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Step 2: Set Environment Variable

Add to your `.env` file:

```env
# PostgreSQL Connection String
DATABASE_URL="postgresql://username:password@host:5432/database_name?schema=public"
```

**Example formats:**
```
# Standard PostgreSQL
DATABASE_URL="postgresql://user:pass@localhost:5432/paataai?schema=public"

# Supabase
DATABASE_URL="postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres?schema=public"

# Vercel Postgres
DATABASE_URL="postgres://default:password@ep-xxxxx.us-east-1.postgres.vercel-storage.com:5432/verceldb"
```

### Step 3: Install PostgreSQL Client (if needed)

```bash
# If you get connection errors, you may need to install PostgreSQL client libraries
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql-client

# Windows
# Install PostgreSQL from https://www.postgresql.org/download/windows/
```

### Step 4: Generate Prisma Client

```bash
npm run db:generate
```

### Step 5: Run Migrations

```bash
# Create initial migration
npx prisma migrate dev --name init

# Or if you want to apply existing migrations
npx prisma migrate deploy
```

### Step 6: Push Schema (Alternative to Migrations)

If you prefer to push schema directly (for initial setup):

```bash
npx prisma db push
```

**⚠️ Warning:** `db push` doesn't create migration files. Use `migrate dev` for production.

### Step 7: Verify Connection

```bash
# Open Prisma Studio to verify data
npm run db:studio
```

### Step 8: Seed Database (Optional)

If you have seed data:

```bash
npm run db:seed
```

---

## 📊 Data Migration (If You Have Existing Data)

### Option 1: Export from SQLite and Import to PostgreSQL

1. **Export SQLite data:**
```bash
# Export to SQL
sqlite3 dev.db .dump > dump.sql
```

2. **Clean the SQL dump:**
   - Remove SQLite-specific syntax
   - Convert to PostgreSQL format
   - Update data types if needed

3. **Import to PostgreSQL:**
```bash
psql -h host -U username -d database_name < dump.sql
```

### Option 2: Use Prisma Migrate (Recommended)

If you're starting fresh:
1. Keep your SQLite database for development
2. Use PostgreSQL for production
3. Run migrations on both databases

### Option 3: Programmatic Migration

Create a migration script:

```typescript
// scripts/migrate-to-postgres.ts
import { PrismaClient } from '@prisma/client';

const sqliteClient = new PrismaClient({
  datasources: { db: { url: 'file:./dev.db' } }
});

const postgresClient = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
});

async function migrate() {
  // Read from SQLite
  const users = await sqliteClient.user.findMany();
  
  // Write to PostgreSQL
  for (const user of users) {
    await postgresClient.user.create({ data: user });
  }
  
  // Repeat for other models...
}
```

---

## 🔍 Troubleshooting

### Connection Issues

**Error: "Connection refused"**
- Check if PostgreSQL is running
- Verify host and port
- Check firewall settings

**Error: "Authentication failed"**
- Verify username and password
- Check database permissions

**Error: "Database does not exist"**
- Create database: `CREATE DATABASE paataai;`

### SSL Connection Issues

If your PostgreSQL requires SSL:

```env
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

### Connection Pooling

For production, use connection pooling:

```env
# With PgBouncer
DATABASE_URL="postgresql://user:pass@host:5432/db?pgbouncer=true&connection_limit=1"

# Or use Prisma's connection pooler
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=10"
```

---

## ✅ Verification Checklist

After migration, verify:

- [ ] Database connection works
- [ ] All tables created successfully
- [ ] Can create new users
- [ ] Can login with existing credentials (if migrated)
- [ ] API endpoints work correctly
- [ ] No errors in application logs

---

## 🚀 Production Deployment

### For Vercel:

1. Add `DATABASE_URL` to Vercel environment variables
2. Run migrations during build:
   ```bash
   npx prisma migrate deploy
   ```
3. Or add to `vercel.json`:
   ```json
   {
     "buildCommand": "prisma generate && prisma migrate deploy && next build"
   }
   ```

### For Other Platforms:

1. Set `DATABASE_URL` in environment variables
2. Run migrations before deployment
3. Ensure PostgreSQL is accessible from your hosting platform

---

## 📝 Best Practices

1. **Use Migrations:** Always use `prisma migrate` for production
2. **Backup Regularly:** Set up automated backups for PostgreSQL
3. **Connection Pooling:** Use connection pooling for production
4. **Monitor:** Set up monitoring for database performance
5. **Indexes:** Add indexes for frequently queried fields
6. **Environment Variables:** Never commit `.env` files

---

## 🔄 Rollback (If Needed)

If you need to rollback:

1. Update `DATABASE_URL` back to SQLite
2. Run `npx prisma migrate reset` (if needed)
3. Restore from backup

---

## 📚 Additional Resources

- [Prisma PostgreSQL Guide](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)

---

## 🆘 Support

If you encounter issues:
1. Check Prisma logs: `npx prisma migrate dev --verbose`
2. Check PostgreSQL logs
3. Verify connection string format
4. Test connection with `psql` command-line tool

---

**Status:** ✅ Ready for migration

