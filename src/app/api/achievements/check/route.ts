import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { PrismaDatabase } from '@/lib/prisma-database';
import { prisma } from '@/lib/prisma-database';
import { checkAndAwardAchievements, initializeAchievementsAndBadges } from '@/lib/achievement-system';

// Force dynamic rendering - don't execute during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/achievements/check
 * Check and award achievements for the authenticated user
 * This should be called after significant actions (creating notes, flashcards, completing exams, etc.)
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Initialize achievements if they don't exist
    const achievementCount = await prisma.achievement.count();
    if (achievementCount === 0) {
      console.log('No achievements found, initializing...');
      await initializeAchievementsAndBadges();
    }

    // Get user with stats
    const user = await PrismaDatabase.getUserById(authResult.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check and award achievements
    const result = await checkAndAwardAchievements(user.id, user.stats || {});

    return NextResponse.json({
      success: true,
      newlyUnlocked: result.newlyUnlocked || [],
      message: result.newlyUnlocked?.length > 0 
        ? `Congratulations! You've unlocked ${result.newlyUnlocked.length} new achievement(s)!`
        : 'Achievements checked'
    });

  } catch (error: any) {
    console.error('Error checking achievements:', error);
    return NextResponse.json(
      { error: 'Failed to check achievements: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}

