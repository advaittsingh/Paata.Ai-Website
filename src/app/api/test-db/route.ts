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
    console.log('[Test DB] DATABASE_URL preview:', process.env.DATABASE_URL?.substring(0, 30) + '...');
    
    // Try to connect to database
    const testUser = await PrismaDatabase.getUserByEmail('test@example.com');
    
    // If we get here, database connection works (even if user doesn't exist)
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      databaseUrlExists: !!process.env.DATABASE_URL,
      userFound: !!testUser,
    });
  } catch (error: any) {
    console.error('[Test DB] Database connection failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      message: error?.message || 'Unknown error',
      code: error?.code,
      details: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
    }, { status: 500 });
  }
}

