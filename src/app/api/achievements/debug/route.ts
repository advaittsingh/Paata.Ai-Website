import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { PrismaDatabase } from '@/lib/prisma-database';
import { prisma } from '@/lib/prisma-database';
import { checkAndAwardAchievements } from '@/lib/achievement-system';

/**
 * GET /api/achievements/debug
 * Debug endpoint to check achievement system status
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = authResult.user.id;

    // Check if achievements exist
    const achievementCount = await prisma.achievement.count();
    const badgeCount = await prisma.badge.count();

    // Get user data
    const user = await PrismaDatabase.getUserById(userId);
    const stats = user?.stats as any || {};

    // Get user's achievements
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true }
    });

    // Get user's badges
    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true }
    });

    // Get activity counts
    const [flashcardsCount, examSessionsCount, focusSessionsCount, notesCount, mindMapsCount, questionsCount] = await Promise.all([
      prisma.flashcard.count({ where: { userId } }),
      prisma.examSession.count({ where: { userId } }),
      prisma.focusSession.count({ where: { userId } }),
      prisma.note.count({ where: { userId } }),
      prisma.mindMap.count({ where: { userId } }),
      prisma.questionContext.count({ where: { userId } }),
    ]);

    // Check a sample achievement criteria parsing
    const sampleAchievement = await prisma.achievement.findFirst();
    let criteriaSample = null;
    if (sampleAchievement) {
      criteriaSample = {
        raw: sampleAchievement.criteria,
        type: typeof sampleAchievement.criteria,
        parsed: typeof sampleAchievement.criteria === 'string' 
          ? JSON.parse(sampleAchievement.criteria) 
          : sampleAchievement.criteria
      };
    }

    return NextResponse.json({
      success: true,
      debug: {
        achievementsInDatabase: achievementCount,
        badgesInDatabase: badgeCount,
        userStats: {
          totalInteractions: stats.totalInteractions || 0,
          streakDays: stats.streakDays || 0,
          totalTimeSpent: stats.totalTimeSpent || '0h 0m',
        },
        userActivity: {
          flashcards: flashcardsCount,
          examSessions: examSessionsCount,
          focusSessions: focusSessionsCount,
          notes: notesCount,
          mindMaps: mindMapsCount,
          questions: questionsCount,
        },
        userAchievements: {
          total: userAchievements.length,
          unlocked: userAchievements.filter(ua => ua.isUnlocked).length,
          list: userAchievements.map(ua => ({
            name: ua.achievement.name,
            progress: ua.progress,
            isUnlocked: ua.isUnlocked,
            criteria: ua.achievement.criteria
          }))
        },
        userBadges: {
          total: userBadges.length,
          list: userBadges.map(ub => ub.badge.name)
        },
        criteriaSample,
        needsInitialization: achievementCount === 0 || badgeCount === 0
      }
    });

  } catch (error: any) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { 
        error: 'Debug failed', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/achievements/debug
 * Manually trigger achievement check and return results
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
    const user = await PrismaDatabase.getUserById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Manually trigger achievement check
    const result = await checkAndAwardAchievements(userId, user.stats || {});

    // Get updated achievements
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true }
    });

    // Get updated badges
    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true }
    });

    return NextResponse.json({
      success: true,
      newlyUnlocked: result.newlyUnlocked || [],
      achievements: userAchievements.map(ua => ({
        name: ua.achievement.name,
        progress: ua.progress,
        isUnlocked: ua.isUnlocked
      })),
      badges: userBadges.map(ub => ub.badge.name),
      message: result.newlyUnlocked?.length > 0 
        ? `Unlocked ${result.newlyUnlocked.length} new achievement(s)!`
        : 'No new achievements unlocked'
    });

  } catch (error: any) {
    console.error('Debug check error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check achievements', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

