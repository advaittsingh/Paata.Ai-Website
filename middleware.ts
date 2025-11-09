import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'paata-ai-secret-key-change-in-production';

function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  // Redirect /docs to /documentation
  if (request.nextUrl.pathname === '/docs') {
    return NextResponse.redirect(new URL('/documentation', request.url))
  }

  // Protect /app and /profile routes
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = pathname.startsWith('/app') || pathname.startsWith('/profile');

  if (isProtectedRoute) {
    // Get token from cookie
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      // No token, redirect to login
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      // Invalid token, clear cookie and redirect to login
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.set('auth_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        path: '/',
      });
      return response;
    }

    // Token is valid, continue
    return NextResponse.next();
  }

  // Allow access to public routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/docs',
    '/app/:path*',
    '/profile/:path*'
  ]
}
