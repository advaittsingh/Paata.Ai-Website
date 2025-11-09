import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

/**
 * Generate CSRF token
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Get CSRF token from cookie
 */
export async function getCsrfToken(request: NextRequest): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('csrf_token')?.value;
    return token || null;
  } catch (error) {
    console.error('Error getting CSRF token:', error);
    return null;
  }
}

/**
 * Verify CSRF token
 * Returns true if token is valid, false otherwise
 */
export async function verifyCsrfToken(request: NextRequest, token: string | null): Promise<boolean> {
  try {
    if (!token) {
      return false;
    }

    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('csrf_token')?.value;

    if (!cookieToken) {
      return false;
    }

    // Ensure both tokens are the same length
    if (cookieToken.length !== token.length) {
      return false;
    }

    // Use constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(cookieToken),
      Buffer.from(token)
    );
  } catch (error) {
    console.error('Error verifying CSRF token:', error);
    return false;
  }
}

/**
 * Require CSRF token verification
 * Use this in API routes that modify data
 * Note: This reads the request body, so it should be called before reading the body again
 * @deprecated Use extractCsrfToken and verifyCsrfToken separately for better control
 */
export async function requireCsrfToken(request: NextRequest): Promise<{ valid: boolean; error?: string; body?: any }> {
  try {
    const { token: csrfToken, body } = await extractCsrfToken(request);

    if (!csrfToken) {
      return { valid: false, error: 'CSRF token is required', body };
    }

    const isValid = await verifyCsrfToken(request, csrfToken);
    
    if (!isValid) {
      return { valid: false, error: 'Invalid CSRF token', body };
    }

    return { valid: true, body };
  } catch (error) {
    console.error('CSRF verification error:', error);
    return { valid: false, error: 'CSRF verification failed' };
  }
}

/**
 * Extract CSRF token from request (non-destructive)
 * Returns the token and the parsed body
 * IMPORTANT: This function reads the request body ONCE
 */
export async function extractCsrfToken(request: NextRequest): Promise<{ token: string | null; body: any }> {
  try {
    // Check header first (doesn't require reading body)
    const headerToken = request.headers.get('X-CSRF-Token');
    
    // Read body only once - we need it anyway for the actual data
    let body: any = {};
    try {
      body = await request.json().catch(() => ({}));
    } catch (error) {
      console.warn('Could not read request body:', error);
      body = {};
    }
    
    // If token is in header, use it (preferred)
    if (headerToken) {
      return { token: headerToken, body };
    }
    
    // Otherwise, try to get token from body
    const bodyToken = body.csrfToken || null;
    return { token: bodyToken, body };
  } catch (error) {
    console.error('Error extracting CSRF token:', error);
    return { token: null, body: {} };
  }
}

/**
 * Set CSRF token in cookie (for API routes)
 */
export function setCsrfTokenCookie(response: NextResponse, token: string): void {
  response.cookies.set('csrf_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60, // 1 hour
    path: '/',
  });
}

