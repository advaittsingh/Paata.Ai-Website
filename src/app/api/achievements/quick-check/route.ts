import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { PrismaDatabase } from '@/lib/prisma-database';
import { prisma } from '@/lib/prisma-database';
import { initializeAchievementsAndBadges } from '@/lib/achievement-system';

/**
 * POST /api/achievements/quick-check
 * Quick check that just initializes achievements and returns current status
 * This is faster and won't hang
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

    const userId = authResult.user.id;

    // Step 1: Initialize achievements if needed
    const achievementCount = await prisma.achievement.count().catch(() => 0);
    const badgeCount = await prisma.badge.count().catch(() => 0);
    
    if (achievementCount === 0 || badgeCount === 0) {
      console.log('Initializing achievements and badges...');
      await initializeAchievementsAndBadges();
    }

    // Step 2: Get user stats
    const user = await PrismaDatabase.getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const stats = user.stats as any || {};

    // Step 3: Get activity counts
    const [notesCount, flashcardsCount, mindMapsCount, examSessionsCount, focusSessionsCount, questionsCount] = await Promise.all([
      prisma.note.count({ where: { userId } }).catch(() => 0),
      prisma.flashcard.count({ where: { userId } }).catch(() => 0),
      prisma.mindMap.count({ where: { userId } }).catch(() => 0),
      prisma.examSession.count({ where: { userId } }).catch(() => 0),
      prisma.focusSession.count({ where: { userId } }).catch(() => 0),
      prisma.questionContext.count({ where: { userId } }).catch(() => 0),
    ]);

    // Step 4: Get current achievements and badges
    const [allAchievements, userAchievements, allBadges, userBadges] = await Promise.all([
      prisma.achievement.findMany().catch(() => []),
      prisma.userAchievement.findMany({ where: { userId } }).catch(() => []),
      prisma.badge.findMany().catch(() => []),
      prisma.userBadge.findMany({ where: { userId } }).catch(() => []),
    ]);

    // Step 5: Calculate which achievements should be unlocked
    const unlockedAchievements = userAchievements.filter(ua => ua.isUnlocked);
    const earnedBadges = userBadges.map(ub => ub.badgeId);

    return NextResponse.json({
      success: true,
      initialized: achievementCount === 0 || badgeCount === 0,
      stats: {
        totalAchievements: allAchievements.length,
        unlockedAchievements: unlockedAchievements.length,
        totalBadges: allBadges.length,
        earnedBadges: userBadges.length,
      },
      activity: {
        interactions: stats.totalInteractions || 0,
        notes: notesCount,
        flashcards: flashcardsCount,
        mindMaps: mindMapsCount,
        examSessions: examSessionsCount,
        focusSessions: focusSessionsCount,
        questions: questionsCount,
      },
      message: 'Quick check completed. Use the full check to award achievements.'
    });

  } catch (error: any) {
    console.error('Quick check error:', error);
    return NextResponse.json(
      { 
        error: 'Quick check failed', 
        details: error.message
      },
      { status: 500 }
    );
  }
}

