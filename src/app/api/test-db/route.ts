import { NextRequest, NextResponse } from 'next/server';
import { PrismaDatabase } from '@/lib/prisma-database';

/**
 * Test endpoint to check database connectivity
 * GET /api/test-db
 */
export async function GET(request: NextRequest) {
  try {
    console.log('[Test DB] Starting database connectivity test...');
    console.log('[Test DB] DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('[Test DB] PRISMA_DATABASE_URL exists:', !!process.env.PRISMA_DATABASE_URL);
    console.log('[Test DB] DATABASE_URL preview:', process.env.DATABASE_URL?.substring(0, 50) + '...');
    console.log('[Test DB] PRISMA_DATABASE_URL preview:', process.env.PRISMA_DATABASE_URL?.substring(0, 50) + '...');
    
    // Determine which URL will be used
    const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL;
    console.log('[Test DB] Using database URL:', databaseUrl ? (databaseUrl.startsWith('prisma+') ? 'Prisma Accelerate' : 'Direct connection') : 'NONE');
    console.log('[Test DB] Database URL starts with:', databaseUrl?.substring(0, 20));
    
    // Try to connect to database
    const testUser = await PrismaDatabase.getUserByEmail('test@example.com');
    
    // If we get here, database connection works (even if user doesn't exist)
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      databaseUrlExists: !!process.env.DATABASE_URL,
      prismaDatabaseUrlExists: !!process.env.PRISMA_DATABASE_URL,
      usingUrl: databaseUrl ? (databaseUrl.startsWith('prisma+') ? 'Prisma Accelerate' : 'Direct') : 'None',
      userFound: !!testUser,
    });
  } catch (error: any) {
    console.error('[Test DB] Database connection failed:', error);
    console.error('[Test DB] Error name:', error?.name);
    console.error('[Test DB] Error code:', error?.code);
    console.error('[Test DB] Error message:', error?.message);
    console.error('[Test DB] Error stack:', error?.stack);
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      message: error?.message || 'Unknown error',
      code: error?.code,
      name: error?.name,
      databaseUrlExists: !!process.env.DATABASE_URL,
      prismaDatabaseUrlExists: !!process.env.PRISMA_DATABASE_URL,
      details: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
    }, { status: 500 });
  }
}

