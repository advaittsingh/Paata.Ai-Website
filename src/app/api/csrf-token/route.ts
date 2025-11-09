import { NextRequest, NextResponse } from 'next/server';
import { generateCsrfToken } from '@/lib/csrf';

/**
 * GET /api/csrf-token
 * Get or generate CSRF token for the current session
 */
export async function GET(request: NextRequest) {
  try {
    // Generate new CSRF token
    const token = generateCsrfToken();

    // Create response with token
    const response = NextResponse.json({ csrfToken: token });

    // Set CSRF token in HTTP-only cookie
    // Use 'lax' instead of 'strict' for better compatibility with Vercel
    response.cookies.set('csrf_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed from 'strict' to 'lax' for better Vercel compatibility
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('CSRF token generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}

