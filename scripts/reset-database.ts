/**
 * Database Reset Script
 * 
 * This script resets the database to a fresh state by:
 * 1. Dropping all tables
 * 2. Running migrations to recreate the schema
 * 3. Clearing any cached data
 * 
 * WARNING: This will delete ALL data in the database!
 * 
 * Usage: npx ts-node scripts/reset-database.ts
 */

import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function resetDatabase() {
  console.log('🔄 Starting database reset...\n');

  try {
    // Step 1: Drop all tables
    console.log('📋 Step 1: Dropping all tables...');
    await prisma.$executeRaw`PRAGMA foreign_keys = OFF;`;
    
    const tables = await prisma.$queryRaw<Array<{ name: string }>>`
      SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';
    `;

    for (const table of tables) {
      console.log(`  Dropping table: ${table.name}`);
      await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS ${table.name};`);
    }

    await prisma.$executeRaw`PRAGMA foreign_keys = ON;`;
    console.log('✅ All tables dropped\n');

    // Step 2: Reset Prisma migrations
    console.log('📋 Step 2: Resetting Prisma migrations...');
    const migrationsDir = path.join(process.cwd(), 'prisma', 'migrations');
    if (fs.existsSync(migrationsDir)) {
      const migrations = fs.readdirSync(migrationsDir).filter(dir => 
        fs.statSync(path.join(migrationsDir, dir)).isDirectory() && dir !== '20251027174500_init'
      );
      
      // Keep the initial migration, remove others
      for (const migration of migrations) {
        const migrationPath = path.join(migrationsDir, migration);
        console.log(`  Removing migration: ${migration}`);
        fs.rmSync(migrationPath, { recursive: true, force: true });
      }
    }
    console.log('✅ Migrations reset\n');

    // Step 3: Run migrations to recreate schema
    console.log('📋 Step 3: Running migrations to recreate schema...');
    try {
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      console.log('✅ Schema recreated\n');
    } catch (error) {
      console.log('⚠️  Migration deploy failed, trying migrate reset...');
      execSync('npx prisma migrate reset --force', { stdio: 'inherit' });
      console.log('✅ Schema recreated\n');
    }

    // Step 4: Generate Prisma Client
    console.log('📋 Step 4: Regenerating Prisma Client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma Client regenerated\n');

    console.log('✅ Database reset complete!');
    console.log('\n📝 Next steps:');
    console.log('  1. Create a new user account at /auth/signup');
    console.log('  2. Start using the app to generate real data');
    console.log('  3. Check /app/progress and /profile/usage to see real analytics\n');

  } catch (error) {
    console.error('❌ Error resetting database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the reset
resetDatabase()
  .then(() => {
    console.log('✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });

