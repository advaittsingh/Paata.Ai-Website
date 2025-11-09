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

    const { token, backupCode } = await request.json();
    const user = authResult.user;

    if (!user.twoFactorSecret) {
      return NextResponse.json(
        { error: '2FA not set up. Please set up 2FA first.' },
        { status: 400 }
      );
    }

    let verified = false;

    // Verify TOTP token
    if (token) {
      verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: token,
        window: 2, // Allow 2 time steps before/after
      });
    }

    // If TOTP failed, check backup code
    if (!verified && backupCode) {
      const backupCodes = user.twoFactorBackupCodes 
        ? JSON.parse(user.twoFactorBackupCodes) 
        : [];
      
      const codeIndex = backupCodes.indexOf(backupCode.toUpperCase());
      if (codeIndex !== -1) {
        // Remove used backup code
        backupCodes.splice(codeIndex, 1);
        await PrismaDatabase.updateUser(user.id, {
          twoFactorBackupCodes: JSON.stringify(backupCodes),
        });
        verified = true;
      }
    }

    if (!verified) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Enable 2FA
    await PrismaDatabase.updateUser(user.id, {
      twoFactorEnabled: true,
    });

    return NextResponse.json({
      message: '2FA enabled successfully',
      backupCodes: user.twoFactorBackupCodes ? JSON.parse(user.twoFactorBackupCodes) : [],
    });
  } catch (error) {
    console.error('2FA verify error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

