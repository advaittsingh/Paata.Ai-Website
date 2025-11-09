import { NextRequest, NextResponse } from 'next/server';
import { PrismaDatabase } from '@/lib/prisma-database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Verification token is required' }, { status: 400 });
    }

    // Find user by verification token
    const allUsers = await PrismaDatabase.getAllUsers();
    const user = allUsers.find(
      (u) => u.emailVerificationToken === token && 
             u.emailVerificationExpiry &&
             new Date(u.emailVerificationExpiry) > new Date()
    );

    if (!user) {
      return NextResponse.redirect(new URL('/auth/verify-email?error=invalid', request.url));
    }

    // Verify email
    await PrismaDatabase.updateUser(user.id, {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpiry: null,
    });

    // Redirect to success page
    return NextResponse.redirect(new URL('/auth/verify-email?success=true', request.url));
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.redirect(new URL('/auth/verify-email?error=server', request.url));
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Find user
    const user = await PrismaDatabase.getUserByEmail(email);
    
    if (!user) {
      // Always return success to prevent email enumeration
      return NextResponse.json({ message: 'If an account with that email exists, a verification email has been sent.' });
    }

    // If already verified, return success
    if (user.emailVerified) {
      return NextResponse.json({ message: 'Email is already verified.' });
    }

    // Generate verification token
    const crypto = require('crypto');
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiry = new Date();
    verificationExpiry.setHours(verificationExpiry.getHours() + 24); // 24 hours expiry

    // Update user with verification token
    await PrismaDatabase.updateUser(user.id, {
      emailVerificationToken: verificationToken,
      emailVerificationExpiry: verificationExpiry,
    });

    // Send verification email
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${verificationToken}`;
    const { sendVerificationEmail } = await import('@/lib/email-service');
    await sendVerificationEmail(user.email, verificationLink);

    return NextResponse.json({
      message: 'If an account with that email exists, a verification email has been sent.',
    });
  } catch (error) {
    console.error('Resend verification email error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

