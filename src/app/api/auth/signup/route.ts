import { NextRequest, NextResponse } from 'next/server';
import { PrismaDatabase } from '@/lib/prisma-database';
import { hashPassword, generateToken } from '@/lib/auth-utils';
import { checkRateLimit } from '@/lib/rate-limit';
import { extractCsrfToken, verifyCsrfToken } from '@/lib/csrf';

export async function POST(request: NextRequest) {
  try {
    // Extract CSRF token and request body
    const { token: csrfToken, body: requestBody } = await extractCsrfToken(request);
    
    // Verify CSRF token (only in production or if explicitly enabled)
    // Allow disabling CSRF for debugging by setting ENABLE_CSRF_PROTECTION to 'false'
    if (process.env.ENABLE_CSRF_PROTECTION !== 'false' && (process.env.ENABLE_CSRF_PROTECTION === 'true' || process.env.NODE_ENV === 'production')) {
      if (!csrfToken) {
        console.error('[Signup] CSRF token missing');
        return NextResponse.json(
          { error: 'CSRF token is required' },
          { status: 403 }
        );
      }
      
      const isValid = await verifyCsrfToken(request, csrfToken);
      if (!isValid) {
        console.error('[Signup] CSRF token validation failed');
        return NextResponse.json(
          { error: 'Invalid CSRF token' },
          { status: 403 }
        );
      }
      console.log('[Signup] CSRF token validated successfully');
    } else {
      console.log('[Signup] CSRF protection disabled');
    }

    // Check rate limit for signup
    const rateLimit = checkRateLimit(request, 'signup');
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many signup attempts. Please try again later.',
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

    const userData = requestBody;

    if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
      return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Validate password strength (minimum 6 characters)
    if (userData.password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await PrismaDatabase.getUserByEmail(userData.email);
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);

    // Generate email verification token
    const crypto = require('crypto');
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiry = new Date();
    verificationExpiry.setHours(verificationExpiry.getHours() + 24); // 24 hours expiry

    // Create new user with default values
    const newUser = await PrismaDatabase.createUser({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: hashedPassword,
      phone: userData.phone || '',
      bio: userData.bio || 'New PAATA.AI user',
      location: userData.location || '',
      website: userData.website || '',
      avatar: userData.avatar || '/image/avatar1.jpg',
      plan: 'Enterprise',
      joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      preferences: {
        theme: 'system',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          weeklyDigest: userData.subscribeNewsletter || false,
          marketing: userData.subscribeNewsletter || false,
        },
        learning: {
          difficultyLevel: 'adaptive',
          learningStyle: 'mixed',
          subjectFocus: [],
          class: userData.preferences?.learning?.class || userData.class || '1',
          board: userData.preferences?.learning?.board || userData.board || 'CBSE',
        },
      },
      stats: {
        totalInteractions: 0,
        textMessages: 0,
        imageUploads: 0,
        voiceInputs: 0,
        totalTimeSpent: '0h 0m',
        averageSessionTime: '0m 0s',
        streakDays: 0,
      },
      emailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpiry: verificationExpiry,
    });

    // Send verification email (optional - don't fail signup if email fails)
    try {
      const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${verificationToken}`;
      const { sendVerificationEmail } = await import('@/lib/email-service');
      await sendVerificationEmail(newUser.email, verificationLink);
    } catch (emailError) {
      console.warn('Failed to send verification email:', emailError);
      // Don't fail signup if email fails - user can request verification later
    }

    // Generate JWT token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
    });

    // Generate refresh token
    const { generateRefreshToken, storeRefreshToken } = await import('@/lib/refresh-tokens');
    const refreshToken = generateRefreshToken();
    await storeRefreshToken(newUser.id, refreshToken);

    // Remove password from response
    const { password, ...userWithoutPassword } = newUser;

    // Create response with user data
    const response = NextResponse.json(
      { 
        user: userWithoutPassword,
        message: 'Account created successfully',
        refreshToken: refreshToken, // Include refresh token in response
      },
      { status: 201 }
    );

    // Set HTTP-only cookie with token
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed from 'strict' to 'lax' for better Vercel compatibility
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Store refresh token in HTTP-only cookie (30 days)
    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed from 'strict' to 'lax' for better Vercel compatibility
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Signup error:', error);
    console.error('Error details:', error?.message, error?.stack);
    console.error('Error name:', error?.name);
    // Return more specific error message in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? (error?.message || 'Internal server error')
      : 'Internal server error';
    return NextResponse.json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    }, { status: 500 });
  }
}
