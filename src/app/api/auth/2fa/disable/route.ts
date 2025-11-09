import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { PrismaDatabase } from '@/lib/prisma-database';
import * as speakeasy from 'speakeasy';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { token, password } = await request.json();
    const user = authResult.user;

    if (!user.twoFactorEnabled) {
      return NextResponse.json(
        { error: '2FA is not enabled' },
        { status: 400 }
      );
    }

    // Verify password OR 2FA token
    let verified = false;

    // Verify password
    if (password) {
      const { verifyPassword } = await import('@/lib/auth-utils');
      if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        verified = await verifyPassword(password, user.password);
      } else {
        verified = user.password === password;
      }
    }

    // Verify TOTP token if password not provided
    if (!verified && token && user.twoFactorSecret) {
      verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: token,
        window: 2,
      });
    }

    if (!verified) {
      return NextResponse.json(
        { error: 'Invalid password or verification code' },
        { status: 400 }
      );
    }

    // Disable 2FA
    await PrismaDatabase.updateUser(user.id, {
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorBackupCodes: null,
    });

    return NextResponse.json({
      message: '2FA disabled successfully',
    });
  } catch (error) {
    console.error('2FA disable error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

