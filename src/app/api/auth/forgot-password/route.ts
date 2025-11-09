import { NextRequest, NextResponse } from 'next/server';
import { PrismaDatabase } from '@/lib/prisma-database';
import { generateResetToken, getResetTokenExpiry } from '@/lib/auth-utils';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Check rate limit for password reset requests
    const rateLimit = checkRateLimit(request, 'forgot-password');
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
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

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Find user by email
    const user = await PrismaDatabase.getUserByEmail(email);
    
    // Always return success to prevent email enumeration
    // But only actually send email if user exists
    if (user) {
      // Generate reset token
      const resetToken = generateResetToken();
      const resetTokenExpiry = getResetTokenExpiry();

      // Store reset token in database
      await PrismaDatabase.updateUser(user.id, {
        resetPasswordToken: resetToken,
        resetPasswordExpiry: resetTokenExpiry,
      });

      // Send email with reset link
      const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
      
      // Import and send email
      const { sendPasswordResetEmail } = await import('@/lib/email-service');
      await sendPasswordResetEmail(user.email, resetLink);
    }

    // Always return success message (security best practice)
    return NextResponse.json({
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

