import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';

/**
 * Verify authentication status
 * Returns current user if authenticated
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);

    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { 
          authenticated: false,
          error: authResult.error || 'Not authenticated'
        },
        { status: 401 }
      );
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = authResult.user;

    return NextResponse.json({
      authenticated: true,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Auth verify error:', error);
    return NextResponse.json(
      { 
        authenticated: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

