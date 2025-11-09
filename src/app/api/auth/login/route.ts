import { NextRequest, NextResponse } from 'next/server';
import { PrismaDatabase } from '@/lib/prisma-database';
import { verifyPassword, generateToken } from '@/lib/auth-utils';
import { checkRateLimit, clearRateLimit } from '@/lib/rate-limit';
import { trackLogin } from '@/lib/login-tracking';
import { extractCsrfToken, verifyCsrfToken } from '@/lib/csrf';

export async function POST(request: NextRequest) {
  try {
    // Extract CSRF token and request body
    const { token: csrfToken, body: requestBody } = await extractCsrfToken(request);
    
    // Verify CSRF token (only if explicitly enabled)
    // CSRF protection is now opt-in via ENABLE_CSRF_PROTECTION=true (disabled by default for better compatibility)
    if (process.env.ENABLE_CSRF_PROTECTION === 'true') {
      if (!csrfToken) {
        console.error('[Login] CSRF token missing');
        return NextResponse.json(
          { error: 'CSRF token is required' },
          { status: 403 }
        );
      }
      
      const isValid = await verifyCsrfToken(request, csrfToken);
      if (!isValid) {
        console.error('[Login] CSRF token validation failed');
        return NextResponse.json(
          { error: 'Invalid CSRF token' },
          { status: 403 }
        );
      }
      console.log('[Login] CSRF token validated successfully');
    } else {
      console.log('[Login] CSRF protection disabled (set ENABLE_CSRF_PROTECTION=true to enable)');
    }

    // Check rate limit
    const rateLimit = checkRateLimit(request, 'login');
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many login attempts. Please try again later.',
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

    const { email, password } = requestBody;

    if (!email || !password) {
      console.error('[Login] Missing email or password');
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    console.log(`[Login] Attempting to find user with email: ${email}`);
    
    let user;
    try {
      user = await PrismaDatabase.getUserByEmail(email);
    } catch (dbError: any) {
      console.error('[Login] Database error:', dbError);
      console.error('[Login] Database error message:', dbError?.message);
      console.error('[Login] Database error stack:', dbError?.stack);
      return NextResponse.json({ 
        error: 'Database connection error. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? dbError?.message : undefined
      }, { status: 500 });
    }
    
    if (!user) {
      console.log(`[Login] User not found for email: ${email}`);
      // Don't reveal if user exists or not for security
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    console.log(`[Login] User found: ${user.email}, checking password...`);
    
    // Check if password field exists
    if (!user.password) {
      console.error(`[Login] User ${user.email} has no password field!`);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    console.log(`[Login] Password hash starts with: ${user.password.substring(0, Math.min(10, user.password.length))}...`);

    // Verify password (supports both hashed and plain text for migration)
    let passwordValid = false;
    
    // Check if password is already hashed (starts with $2a$ or $2b$)
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      // Password is hashed, verify with bcrypt
      console.log('[Login] Password is hashed, verifying with bcrypt...');
      passwordValid = await verifyPassword(password, user.password);
      console.log(`[Login] Bcrypt verification result: ${passwordValid}`);
    } else {
      // Plain text password (for backward compatibility during migration)
      // This allows existing users to log in and then their password will be updated
      console.log('[Login] Password appears to be plain text, comparing directly...');
      passwordValid = user.password === password;
      console.log(`[Login] Plain text comparison result: ${passwordValid}`);
      
      // If login successful with plain text, hash the password for next time
      if (passwordValid) {
        console.log('[Login] Plain text password valid, hashing for future use...');
        const { hashPassword } = await import('@/lib/auth-utils');
        const hashedPassword = await hashPassword(password);
        await PrismaDatabase.updateUser(user.id, { password: hashedPassword });
        console.log('[Login] Password hashed and saved successfully');
      }
    }

    if (!passwordValid) {
      console.log(`[Login] Password validation failed for user: ${user.email}`);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    console.log(`[Login] Password validated successfully for user: ${user.email}`);

    // Clear rate limit on successful login
    clearRateLimit(request, 'login');

    // Track login session
    await trackLogin(user.id, request);

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    // Generate refresh token
    const { generateRefreshToken, storeRefreshToken } = await import('@/lib/refresh-tokens');
    const refreshToken = generateRefreshToken();
    await storeRefreshToken(user.id, refreshToken);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Create response with user data
    const response = NextResponse.json({
      user: userWithoutPassword,
      message: 'Login successful',
      refreshToken: refreshToken, // Include refresh token in response
    });

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
    console.error('Login error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
