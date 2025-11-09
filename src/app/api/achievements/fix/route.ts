import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { PrismaDatabase } from '@/lib/prisma-database';
import { prisma } from '@/lib/prisma-database';
import { initializeAchievementsAndBadges, checkAndAwardAchievements } from '@/lib/achievement-system';

/**
 * POST /api/achievements/fix
 * Comprehensive fix endpoint that:
 * 1. Initializes achievements if missing
 * 2. Checks and awards achievements for the user
 * 3. Returns detailed status
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
    const results: any = {
      initialized: false,
      checked: false,
      newlyUnlocked: [],
      errors: []
    };

    // Step 1: Check if achievements exist, initialize if not
    try {
      const achievementCount = await prisma.achievement.count().catch(() => 0);
      const badgeCount = await prisma.badge.count().catch(() => 0);
      
      if (achievementCount === 0 || badgeCount === 0) {
        console.log('Initializing achievements and badges...');
        await initializeAchievementsAndBadges();
        results.initialized = true;
        results.message = 'Achievements and badges initialized';
      } else {
        results.message = `Found ${achievementCount} achievements and ${badgeCount} badges`;
      }
    } catch (error: any) {
      results.errors.push(`Initialization error: ${error.message}`);
      console.error('Initialization error:', error);
      // Don't fail completely - continue with check
    }

    // Step 2: Get user and check achievements
    try {
      const user = await PrismaDatabase.getUserById(userId);
      if (!user) {
        return NextResponse.json(
          { error: 'User not found', results },
          { status: 404 }
        );
      }

      const stats = user.stats as any || {};
      
      // Log current stats for debugging
      console.log('User stats:', {
        totalInteractions: stats.totalInteractions || 0,
        streakDays: stats.streakDays || 0,
        totalTimeSpent: stats.totalTimeSpent || '0h 0m'
      });

      // Check and award achievements with timeout protection
      try {
        const checkResult = await Promise.race([
          checkAndAwardAchievements(userId, stats),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Achievement check timed out after 20 seconds')), 20000)
          )
        ]) as any;
        
        results.checked = true;
        results.newlyUnlocked = checkResult?.newlyUnlocked || [];
      } catch (checkError: any) {
        results.errors.push(`Achievement check error: ${checkError.message}`);
        console.error('Achievement check error:', checkError);
        results.checked = false;
      }

      // Get updated counts
      const [achievementsCount, badgesCount, unlockedCount, earnedBadgesCount] = await Promise.all([
        prisma.achievement.count(),
        prisma.badge.count(),
        prisma.userAchievement.count({ where: { userId, isUnlocked: true } }),
        prisma.userBadge.count({ where: { userId } })
      ]);

      // Get activity counts
      const [notesCount, flashcardsCount, mindMapsCount, examSessionsCount, focusSessionsCount, questionsCount] = await Promise.all([
        prisma.note.count({ where: { userId } }),
        prisma.flashcard.count({ where: { userId } }),
        prisma.mindMap.count({ where: { userId } }),
        prisma.examSession.count({ where: { userId } }),
        prisma.focusSession.count({ where: { userId } }),
        prisma.questionContext.count({ where: { userId } }),
      ]);

      results.status = {
        totalAchievements: achievementsCount,
        totalBadges: badgesCount,
        unlockedAchievements: unlockedCount,
        earnedBadges: earnedBadgesCount,
        activity: {
          notes: notesCount,
          flashcards: flashcardsCount,
          mindMaps: mindMapsCount,
          examSessions: examSessionsCount,
          focusSessions: focusSessionsCount,
          questions: questionsCount,
          interactions: stats.totalInteractions || 0,
          streakDays: stats.streakDays || 0
        }
      };

    } catch (error: any) {
      results.errors.push(`Check error: ${error.message}`);
      console.error('Check error:', error);
    }

    return NextResponse.json({
      success: true,
      results,
      message: results.newlyUnlocked.length > 0
        ? `Success! Unlocked ${results.newlyUnlocked.length} new achievement(s): ${results.newlyUnlocked.join(', ')}`
        : results.checked
        ? 'Achievements checked. No new unlocks at this time.'
        : 'Fix process completed with errors. Check results for details.'
    });

  } catch (error: any) {
    console.error('Fix endpoint error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fix achievements', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

