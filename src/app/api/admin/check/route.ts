import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-utils';

/**
 * GET /api/admin/check
 * Check if current user is admin
 */
export async function GET(request: NextRequest) {
  try {
    const adminResult = await verifyAdmin(request);
    
    return NextResponse.json({
      isAdmin: adminResult.isAdmin,
      error: adminResult.error,
      user: adminResult.isAdmin ? {
        id: adminResult.user.id,
        email: adminResult.user.email,
        firstName: adminResult.user.firstName,
        lastName: adminResult.user.lastName,
      } : null,
    });

  } catch (error: any) {
    console.error('Admin check error:', error);
    return NextResponse.json(
      { isAdmin: false, error: 'Failed to check admin status' },
      { status: 500 }
    );
  }
}


