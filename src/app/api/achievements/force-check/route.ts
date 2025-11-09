import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { PrismaDatabase } from '@/lib/prisma-database';
import { prisma } from '@/lib/prisma-database';
import { initializeAchievementsAndBadges, checkAndAwardAchievements } from '@/lib/achievement-system';

/**
 * POST /api/achievements/force-check
 * Force check and unlock achievements - more aggressive checking
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

    // Initialize if needed
    const achievementCount = await prisma.achievement.count().catch(() => 0);
    if (achievementCount === 0) {
      await initializeAchievementsAndBadges();
    }

    // Get user
    const user = await PrismaDatabase.getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const stats = user.stats as any || {};

    // Get all achievements
    const achievements = await prisma.achievement.findMany();
    
    // Get activity counts
    const [flashcardsCount, examSessionsCount, focusSessionsCount, notesCount, mindMapsCount, questionsCount] = await Promise.all([
      prisma.flashcard.count({ where: { userId } }).catch(() => 0),
      prisma.examSession.count({ where: { userId } }).catch(() => 0),
      prisma.focusSession.count({ where: { userId } }).catch(() => 0),
      prisma.note.count({ where: { userId } }).catch(() => 0),
      prisma.mindMap.count({ where: { userId } }).catch(() => 0),
      prisma.questionContext.count({ where: { userId } }).catch(() => 0),
    ]);

    const newlyUnlocked: string[] = [];
    const updatedAchievements: any[] = [];

    // Manually check each achievement
    for (const achievement of achievements) {
      try {
        let criteria: any;
        if (typeof achievement.criteria === 'string') {
          try {
            criteria = JSON.parse(achievement.criteria);
          } catch (e) {
            console.warn(`Failed to parse criteria for achievement ${achievement.id}:`, e);
            continue;
          }
        } else {
          criteria = achievement.criteria;
        }

        if (!criteria || !criteria.type || !criteria.target) {
          console.warn(`Invalid criteria for achievement ${achievement.id}`);
          continue;
        }

        let currentValue = 0;
        let progress = 0;

        switch (criteria.type) {
          case 'interactions':
            currentValue = stats.totalInteractions || 0;
            progress = Math.min((currentValue / criteria.target) * 100, 100);
            break;
          case 'streak':
            currentValue = stats.streakDays || 0;
            progress = Math.min((currentValue / criteria.target) * 100, 100);
            break;
          case 'flashcards':
            currentValue = flashcardsCount;
            progress = Math.min((currentValue / criteria.target) * 100, 100);
            break;
          case 'exams_completed':
            currentValue = examSessionsCount;
            progress = Math.min((currentValue / criteria.target) * 100, 100);
            break;
          case 'focus_sessions':
            currentValue = focusSessionsCount;
            progress = Math.min((currentValue / criteria.target) * 100, 100);
            break;
          default:
            continue;
        }

        const existing = await prisma.userAchievement.findUnique({
          where: {
            userId_achievementId: {
              userId,
              achievementId: achievement.id
            }
          }
        });

        const wasUnlocked = existing?.isUnlocked || false;
        const isNowUnlocked = progress >= 100;
        const roundedProgress = Math.round(progress);

        if (progress > 0 || existing) {
          const now = new Date();
          
          await prisma.userAchievement.upsert({
            where: {
              userId_achievementId: {
                userId,
                achievementId: achievement.id
              }
            },
            update: {
              progress: roundedProgress,
              isUnlocked: isNowUnlocked,
              unlockedAt: isNowUnlocked && !wasUnlocked ? now : (existing?.unlockedAt || null)
            },
            create: {
              userId,
              achievementId: achievement.id,
              progress: roundedProgress,
              isUnlocked: isNowUnlocked,
              unlockedAt: isNowUnlocked ? now : null
            }
          });

          if (isNowUnlocked && !wasUnlocked) {
            newlyUnlocked.push(achievement.name);
          }

          updatedAchievements.push({
            name: achievement.name,
            progress: roundedProgress,
            isUnlocked: isNowUnlocked,
            currentValue,
            target: criteria.target
          });
        }
      } catch (error: any) {
        console.error(`Error processing achievement ${achievement.id} (${achievement.name}):`, error);
        // Continue with next achievement
      }
    }

    // Now check badges
    let userAchievements: any[] = [];
    let allBadges: any[] = [];
    let userBadges: any[] = [];
    let earnedBadgeNames: string[] = [];
    
    try {
      userAchievements = await prisma.userAchievement.findMany({
        where: { userId, isUnlocked: true },
        include: { achievement: true }
      });
    } catch (e: any) {
      console.error('Error fetching user achievements:', e);
    }

    try {
      allBadges = await prisma.badge.findMany();
    } catch (e: any) {
      console.error('Error fetching badges:', e);
    }

    try {
      userBadges = await prisma.userBadge.findMany({
        where: { userId },
        include: { badge: true }
      });
      earnedBadgeNames = userBadges.map(ub => ub.badge?.name).filter(Boolean);
    } catch (e: any) {
      console.error('Error fetching user badges:', e);
    }

    const newlyEarnedBadges: string[] = [];

    // Check badge conditions
    const badgeRules = [
      {
        badgeName: 'Newbie',
        condition: () => (stats.totalInteractions || 0) >= 1,
      },
      {
        badgeName: 'Quick Learner',
        condition: () => (stats.totalInteractions || 0) >= 10,
      },
      {
        badgeName: 'Curious Cat',
        condition: () => questionsCount >= 50,
      },
      {
        badgeName: 'Scholar',
        condition: () => userAchievements.length >= 5,
      },
    ];

    for (const rule of badgeRules) {
      try {
        const badge = allBadges.find(b => b?.name === rule.badgeName);
        if (!badge) {
          console.warn(`Badge not found: ${rule.badgeName}`);
          continue;
        }
        
        if (earnedBadgeNames.includes(rule.badgeName)) {
          continue;
        }

        if (rule.condition()) {
          try {
            await prisma.userBadge.create({
              data: {
                userId,
                badgeId: badge.id,
                earnedAt: new Date()
              }
            });
            newlyEarnedBadges.push(rule.badgeName);
            console.log(`✅ Badge awarded: ${rule.badgeName}`);
          } catch (error: any) {
            // Ignore unique constraint errors (badge already earned)
            if (error.code === 'P2002' || error.message?.includes('Unique constraint')) {
              console.log(`Badge ${rule.badgeName} already earned`);
            } else {
              console.error(`Error awarding badge ${rule.badgeName}:`, error);
            }
          }
        }
      } catch (error: any) {
        console.error(`Error processing badge rule ${rule.badgeName}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      newlyUnlocked,
      newlyEarnedBadges,
      updatedAchievements,
      stats: {
        totalInteractions: stats.totalInteractions || 0,
        notes: notesCount,
        flashcards: flashcardsCount,
        mindMaps: mindMapsCount,
        questions: questionsCount,
      },
      message: newlyUnlocked.length > 0 || newlyEarnedBadges.length > 0
        ? `Unlocked ${newlyUnlocked.length} achievement(s) and earned ${newlyEarnedBadges.length} badge(s)!`
        : 'Checked all achievements. No new unlocks at this time.'
    });

  } catch (error: any) {
    console.error('Force check error:', error);
    return NextResponse.json(
      { 
        error: 'Force check failed', 
        details: error.message
      },
      { status: 500 }
    );
  }
}

