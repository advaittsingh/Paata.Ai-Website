import { NextRequest, NextResponse } from 'next/server';
import { PrismaDatabase } from '@/lib/prisma-database';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      deviceInfo,
      pushToken,
      class: userClass,
      board: userBoard,
      preferences
    } = await request.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Required fields are missing',
          code: 'MISSING_FIELDS'
        }, 
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await PrismaDatabase.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { 
          success: false,
          error: 'User already exists',
          code: 'USER_EXISTS'
        }, 
        { status: 400 }
      );
    }

    // Create new user with mobile-optimized defaults
    const newUser = await PrismaDatabase.createUser({
      firstName,
      lastName,
      email,
      password, // In production, hash this
      phone: '',
      bio: 'New PAATA.AI mobile user',
      location: '',
      website: '',
      avatar: '/image/avatar1.jpg',
      plan: 'Enterprise',
      joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      preferences: {
        theme: 'system',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          weeklyDigest: false,
          marketing: false,
        },
        learning: {
          difficultyLevel: 'adaptive',
          learningStyle: 'mixed',
          subjectFocus: [],
          class: preferences?.learning?.class || userClass || '1',
          board: preferences?.learning?.board || userBoard || 'CBSE',
        },
        mobile: {
          pushToken: pushToken || '',
          deviceInfo: deviceInfo || 'mobile-app',
          lastAppVersion: '1.0.0',
          preferredInputMethod: 'mixed'
        }
      },
      stats: {
        totalInteractions: 0,
        textMessages: 0,
        imageUploads: 0,
        voiceInputs: 0,
        totalTimeSpent: '0h 0m',
        averageSessionTime: '0m 0s',
        streakDays: 0,
        lastLoginAt: new Date().toISOString(),
        deviceInfo: deviceInfo || 'mobile-app'
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email,
        plan: newUser.plan,
        deviceInfo: deviceInfo || 'mobile-app'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token,
      expiresIn: '7d'
    }, { status: 201 });

  } catch (error) {
    console.error('Mobile signup error:', error);
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
