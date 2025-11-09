import { NextRequest, NextResponse } from 'next/server';
import { PrismaDatabase } from '@/lib/prisma-database';
import { hashPassword, isResetTokenExpired } from '@/lib/auth-utils';
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

    // Check rate limit for password reset
    const rateLimit = checkRateLimitEnhanced(request, 'reset-password');
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many password reset attempts. Please try again later.',
          retryAfter: rateLimit.retryAfter
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimit.retryAfter?.toString() || '3600'
          }
        }
      );
    }

    const { token, newPassword } = requestBody;

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token and new password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Find user by reset token
    const allUsers = await PrismaDatabase.getAllUsers();
    const user = allUsers.find(
      (u) => u.resetPasswordToken === token && 
             !isResetTokenExpired(u.resetPasswordExpiry)
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password and clear reset token
    await PrismaDatabase.updateUser(user.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpiry: null,
    });

    return NextResponse.json({
      message: 'Password has been reset successfully. You can now login with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Also support GET to verify token validity
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Find user by reset token
    const allUsers = await PrismaDatabase.getAllUsers();
    const user = allUsers.find(
      (u) => u.resetPasswordToken === token && 
             !isResetTokenExpired(u.resetPasswordExpiry)
    );

    if (!user) {
      return NextResponse.json(
        { valid: false, error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    return NextResponse.json({ valid: true, email: user.email });
  } catch (error) {
    console.error('Verify reset token error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

