import { NextRequest, NextResponse } from 'next/server';
import { refreshAccessToken } from '@/lib/refresh-tokens';
import { cookies } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie (preferred) or request body
    const cookieStore = await cookies();
    const cookieRefreshToken = cookieStore.get('refresh_token')?.value;
    
    // Try to get from body if not in cookie
    let refreshToken = cookieRefreshToken;
    if (!refreshToken) {
      try {
        // Clone request to read body safely
        const clonedRequest = request.clone();
        const body = await clonedRequest.json().catch(() => {
          // If clone fails, try reading directly
          return request.json();
        });
        refreshToken = body?.refreshToken;
      } catch (e) {
        console.warn('Could not read refresh token from body:', e);
        // Body parsing failed, continue with cookie token only
      }
    }

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 400 }
      );
    }

    // Create a new request with refresh token in body for the refreshAccessToken function
    const modifiedRequest = new NextRequest(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify({ refreshToken }),
    });

    return await refreshAccessToken(modifiedRequest);
  } catch (error: any) {
    console.error('Refresh route error:', error);
    console.error('Error details:', error?.message, error?.stack);
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'development' ? (error?.message || 'Internal server error') : 'Internal server error' },
      { status: 500 }
    );
  }
}

