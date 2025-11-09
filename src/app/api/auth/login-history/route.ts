import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { getLoginHistory } from '@/lib/login-tracking';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = authResult.user;
    const loginHistory = await getLoginHistory(user.id);

    // Format response
    const formattedHistory = loginHistory.map((session: any) => ({
      id: session.id,
      browser: session.browser || 'Unknown Browser',
      location: session.location || 'Unknown Location',
      loginAt: session.loginAt,
      logoutAt: session.logoutAt || null,
      isActive: session.isActive || false,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
    }));

    return NextResponse.json({
      sessions: formattedHistory,
    });
  } catch (error) {
    console.error('Get login history error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

