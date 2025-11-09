import { NextRequest, NextResponse } from 'next/server';
import { PrismaDatabase } from '@/lib/prisma-database';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const { email, password, deviceInfo } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Email and password are required',
          code: 'MISSING_CREDENTIALS'
        }, 
        { status: 400 }
      );
    }

    const user = await PrismaDatabase.getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        }, 
        { status: 401 }
      );
    }

    // In production, use proper password hashing (bcrypt, etc.)
    if (user.password !== password) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        }, 
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        plan: user.plan,
        deviceInfo: deviceInfo || 'mobile-app'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Update last login timestamp
    const updatedStats = {
      ...user.stats,
      lastLoginAt: new Date().toISOString(),
      deviceInfo: deviceInfo || 'mobile-app'
    };

    await PrismaDatabase.updateUser(user.id, { stats: updatedStats });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token,
      expiresIn: '7d'
    });

  } catch (error) {
    console.error('Mobile login error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      }, 
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
