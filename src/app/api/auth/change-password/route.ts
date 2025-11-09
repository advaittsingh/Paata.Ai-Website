import { NextRequest, NextResponse } from 'next/server';
import { PrismaDatabase } from '@/lib/prisma-database';
import { verifyPassword, hashPassword } from '@/lib/auth-utils';
import { verifyAuth } from '@/lib/auth-middleware';
import { checkRateLimitEnhanced } from '@/lib/rate-limit-enhanced';
import { extractCsrfToken, verifyCsrfToken } from '@/lib/csrf';

export async function POST(request: NextRequest) {
  try {
    // Extract CSRF token and request body
    const { token: csrfToken, body: requestBody } = await extractCsrfToken(request);
    
    // Verify CSRF token (only in production or if explicitly enabled)
    if (process.env.ENABLE_CSRF_PROTECTION === 'true' || process.env.NODE_ENV === 'production') {
      if (!csrfToken) {
        return NextResponse.json(
          { error: 'CSRF token is required' },
          { status: 403 }
        );
      }
      
      const isValid = await verifyCsrfToken(request, csrfToken);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid CSRF token' },
          { status: 403 }
        );
      }
    }

    // Check rate limit for password changes
    const rateLimit = checkRateLimitEnhanced(request, 'change-password');
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many password change attempts. Please try again later.',
          retryAfter: rateLimit.retryAfter
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimit.retryAfter?.toString() || '900'
          }
        }
      );
    }

    // Verify authentication
    const authResult = await verifyAuth(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = requestBody;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    // Validate new password strength
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const user = authResult.user;

    // Verify current password
    let passwordValid = false;
    
    // Check if password is hashed
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      passwordValid = await verifyPassword(currentPassword, user.password);
    } else {
      // Plain text password (shouldn't happen, but handle it)
      passwordValid = user.password === currentPassword;
    }

    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Check if new password is different
    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: 'New password must be different from current password' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await PrismaDatabase.updateUser(user.id, {
      password: hashedPassword,
    });

    return NextResponse.json({
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

