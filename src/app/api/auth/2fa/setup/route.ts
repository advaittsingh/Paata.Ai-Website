import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { PrismaDatabase } from '@/lib/prisma-database';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

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

    const user = authResult.user;

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `PAATA.AI (${user.email})`,
      issuer: 'PAATA.AI',
      length: 32,
    });

    // Generate backup codes (10 codes)
    const backupCodes = Array.from({ length: 10 }, () => 
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );

    // Store secret and backup codes (temporarily, user needs to verify first)
    await PrismaDatabase.updateUser(user.id, {
      twoFactorSecret: secret.base32,
      twoFactorBackupCodes: JSON.stringify(backupCodes),
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url || '');

    return NextResponse.json({
      secret: secret.base32,
      qrCode: qrCodeUrl,
      backupCodes: backupCodes,
      message: 'Scan the QR code with your authenticator app and verify with a code to enable 2FA.',
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

