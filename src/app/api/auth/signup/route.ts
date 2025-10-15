import { NextRequest, NextResponse } from 'next/server';
import { PrismaDatabase } from '@/lib/prisma-database';

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();

    if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
      return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await PrismaDatabase.getUserByEmail(userData.email);
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Create new user with default values
    const newUser = await PrismaDatabase.createUser({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password, // In production, hash this
      phone: userData.phone || '',
      bio: userData.bio || 'New PAATA.AI user',
      location: userData.location || '',
      website: userData.website || '',
      avatar: userData.avatar || '/image/avatar1.jpg',
      plan: 'Enterprise',
      joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      preferences: {
        theme: 'system',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          weeklyDigest: userData.subscribeNewsletter || false,
          marketing: userData.subscribeNewsletter || false,
        },
        learning: {
          difficultyLevel: 'adaptive',
          learningStyle: 'mixed',
          subjectFocus: [],
        },
      },
      stats: {
        totalInteractions: 0,
        textMessages: 0,
        imageUploads: 0,
        voiceInputs: 0,
        totalTimeSpent: '0h 0m',
        averageSessionTime: '0m 0s',
        streakDays: 0,
      },
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
