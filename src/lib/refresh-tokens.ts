import { NextRequest, NextResponse } from 'next/server';
import { generateToken, verifyToken, JWTPayload } from '@/lib/auth-utils';
import { PrismaDatabase } from '@/lib/prisma-database';
import crypto from 'crypto';

/**
 * Generate refresh token
 */
export function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString('hex');
}

/**
 * Store refresh token in database
 * In a production system, you might want a separate RefreshToken model
 * For simplicity, we'll store it in user preferences as JSON
 */
export async function storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
  const user = await PrismaDatabase.getUserById(userId);
  if (!user) return;

  const preferences = typeof user.preferences === 'string' 
    ? JSON.parse(user.preferences) 
    : user.preferences;

  const refreshTokens = preferences.refreshTokens || [];
  
  // Add new token with expiry (30 days)
  refreshTokens.push({
    token: refreshToken,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  });

  // Keep only last 5 refresh tokens per user
  if (refreshTokens.length > 5) {
    refreshTokens.shift();
  }

  preferences.refreshTokens = refreshTokens;

  await PrismaDatabase.updateUser(userId, {
    preferences: JSON.stringify(preferences),
  });
}

/**
 * Verify refresh token
 */
export async function verifyRefreshToken(refreshToken: string): Promise<{ valid: boolean; userId?: string }> {
  try {
    // Get all users (inefficient for production - should use a proper index)
    const users = await PrismaDatabase.getAllUsers();
    
    for (const user of users) {
      const preferences = typeof user.preferences === 'string' 
        ? JSON.parse(user.preferences) 
        : user.preferences;

      const refreshTokens = preferences.refreshTokens || [];
      
      const tokenEntry = refreshTokens.find((t: any) => t.token === refreshToken);
      
      if (tokenEntry) {
        // Check if token is expired
        if (new Date(tokenEntry.expiresAt) < new Date()) {
          return { valid: false };
        }

        return { valid: true, userId: user.id };
      }
    }

    return { valid: false };
  } catch (error) {
    console.error('Verify refresh token error:', error);
    return { valid: false };
  }
}

/**
 * Revoke refresh token
 */
export async function revokeRefreshToken(refreshToken: string): Promise<void> {
  try {
    const users = await PrismaDatabase.getAllUsers();
    
    for (const user of users) {
      const preferences = typeof user.preferences === 'string' 
        ? JSON.parse(user.preferences) 
        : user.preferences;

      const refreshTokens = preferences.refreshTokens || [];
      const filtered = refreshTokens.filter((t: any) => t.token !== refreshToken);

      if (filtered.length !== refreshTokens.length) {
        preferences.refreshTokens = filtered;
        await PrismaDatabase.updateUser(user.id, {
          preferences: JSON.stringify(preferences),
        });
        break;
      }
    }
  } catch (error) {
    console.error('Revoke refresh token error:', error);
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(request: NextRequest): Promise<NextResponse> {
  try {
    // Try to get refresh token from cookie first, then body
    const { cookies } = await import('next/server');
    const cookieStore = await cookies();
    const cookieRefreshToken = cookieStore.get('refresh_token')?.value;
    
    let refreshToken = cookieRefreshToken;
    
    // If not in cookie, try body
    if (!refreshToken) {
      try {
        const body = await request.json();
        refreshToken = body.refreshToken;
      } catch (e) {
        // Body parsing failed
      }
    }

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 400 }
      );
    }

    // Verify refresh token
    const verification = await verifyRefreshToken(refreshToken);
    
    if (!verification.valid || !verification.userId) {
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }

    // Get user
    const user = await PrismaDatabase.getUserById(verification.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate new access token
    const newAccessToken = generateToken({
      userId: user.id,
      email: user.email,
    });

    // Optionally rotate refresh token (for better security)
    const newRefreshToken = generateRefreshToken();
    await storeRefreshToken(user.id, newRefreshToken);
    await revokeRefreshToken(refreshToken);

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      user: userWithoutPassword,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });

    // Set new access token in cookie
    response.cookies.set('auth_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Set new refresh token in cookie (30 days)
    response.cookies.set('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

