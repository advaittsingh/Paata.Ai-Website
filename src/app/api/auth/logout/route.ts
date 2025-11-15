import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json({ 
      message: 'Logged out successfully',
      success: true
    });

    // Delete auth token cookie - use both methods to ensure it's cleared
    response.cookies.delete('auth_token');
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
      expires: new Date(0), // Set to epoch time
    });

    // Delete refresh token cookie - use both methods to ensure it's cleared
    response.cookies.delete('refresh_token');
    response.cookies.set('refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
      expires: new Date(0), // Set to epoch time
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Also support GET for easier logout
export async function GET(request: NextRequest) {
  return POST(request);
}

