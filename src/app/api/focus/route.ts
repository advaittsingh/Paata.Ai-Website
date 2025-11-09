import { NextRequest, NextResponse } from 'next/server';
import { PrismaDatabase } from '@/lib/prisma-database';
import { prisma } from '@/lib/prisma-database';
import { checkAndAwardAchievements } from '@/lib/achievement-system';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const sessions = await PrismaDatabase.getFocusSessions(userId);
    
    const totalFocusTime = sessions.reduce((sum, s) => sum + s.duration, 0);
    
    return NextResponse.json({
      success: true,
      sessions,
      count: sessions.length,
      totalFocusTime
    });

  } catch (error) {
    console.error('Error fetching focus sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch focus sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { duration, mode, userId, metadata } = await request.json();

    if (!duration || !mode || !userId) {
      return NextResponse.json(
        { error: 'duration, mode, and userId are required' },
        { status: 400 }
      );
    }

    const session = await PrismaDatabase.createFocusSession({
      duration,
      mode,
      userId,
      metadata: metadata || {}
    });

    return NextResponse.json({
      success: true,
      session
    });

  } catch (error) {
    console.error('Error creating focus session:', error);
    return NextResponse.json(
      { error: 'Failed to create focus session' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Session id is required' },
        { status: 400 }
      );
    }

    const session = await PrismaDatabase.updateFocusSession(id, {
      status,
      completedAt: status === 'completed' ? new Date() : undefined
    });

    // Check achievements after completing focus session
    if (status === 'completed') {
      try {
        // Get user ID from session
        const focusSession = await prisma.focusSession.findUnique({ where: { id } });
        if (focusSession) {
          const user = await PrismaDatabase.getUserById(focusSession.userId);
          if (user) {
            await checkAndAwardAchievements(focusSession.userId, user.stats || {});
          }
        }
      } catch (error) {
        console.error('Error checking achievements:', error);
        // Don't fail the request if achievement check fails
      }
    }

    return NextResponse.json({
      success: true,
      session
    });

  } catch (error) {
    console.error('Error updating focus session:', error);
    return NextResponse.json(
      { error: 'Failed to update focus session' },
      { status: 500 }
    );
  }
}
