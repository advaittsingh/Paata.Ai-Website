import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth-utils';
import { PrismaDatabase } from './prisma-database';

/**
 * Verify authentication from request
 * Returns user if authenticated, null otherwise
 */
export async function verifyAuth(request: NextRequest): Promise<{ user: any; error: null } | { user: null; error: string }> {
  try {
    // Try to get token from cookie first
    let token = request.cookies.get('auth_token')?.value;
    
    // If not in cookie, try Authorization header
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return { user: null, error: 'No authentication token provided' };
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return { user: null, error: 'Invalid or expired token' };
    }

    // Fetch user from database
    const user = await PrismaDatabase.getUserById(decoded.userId);
    if (!user) {
      return { user: null, error: 'User not found' };
    }

    return { user, error: null };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { user: null, error: 'Authentication failed' };
  }
}

/**
 * Middleware helper to protect API routes
 */
export async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
  const authResult = await verifyAuth(request);
  
  if (authResult.error) {
    return NextResponse.json(
      { 
        error: 'Authentication required',
        message: authResult.error,
        requiresAuth: true
      },
      { status: 401 }
    );
  }

  return null; // Auth successful, continue
}

