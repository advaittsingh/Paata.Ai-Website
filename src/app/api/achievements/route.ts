import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma-database';
import { initializeAchievementsAndBadges } from '@/lib/achievement-system';

// GET - Get user's achievements
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

    // Initialize achievements if they don't exist
    const achievementCount = await prisma.achievement.count();
    if (achievementCount === 0) {
      console.log('No achievements found, initializing...');
      await initializeAchievementsAndBadges();
    }

    // Get all achievements
    const allAchievements = await prisma.achievement.findMany({
      orderBy: { category: 'asc' }
    });

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

    // Calculate progress for each achievement
    const achievementsWithProgress = allAchievements.map(achievement => {
      const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id);
      return {
        ...achievement,
        isUnlocked: userAchievement?.isUnlocked || false,
        progress: userAchievement?.progress || 0,
        unlockedAt: userAchievement?.unlockedAt || null
      };
    });

    // Get all badges
    const allBadges = await prisma.badge.findMany({
      orderBy: { rarity: 'desc' }
    });

    const badgesWithStatus = allBadges.map(badge => {
      const userBadge = userBadges.find(ub => ub.badgeId === badge.id);
      return {
        ...badge,
        earned: !!userBadge,
        earnedAt: userBadge?.earnedAt || null
      };
    });

    return NextResponse.json({
      success: true,
      achievements: achievementsWithProgress,
      badges: badgesWithStatus,
      stats: {
        totalAchievements: allAchievements.length,
        unlockedAchievements: achievementsWithProgress.filter(a => a.isUnlocked).length,
        totalBadges: allBadges.length,
        earnedBadges: userBadges.length
      }
    });

  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    );
  }
}

// POST - Unlock an achievement
export async function POST(request: NextRequest) {
  try {
    const { userId, achievementId, progress } = await request.json();

    if (!userId || !achievementId) {
      return NextResponse.json(
        { error: 'userId and achievementId are required' },
        { status: 400 }
      );
    }

    // Check if achievement exists
    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId }
    });

    if (!achievement) {
      return NextResponse.json(
        { error: 'Achievement not found' },
        { status: 404 }
      );
    }

    // Check if already unlocked
    const existing = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId
        }
      }
    });

    if (existing?.isUnlocked) {
      return NextResponse.json({
        success: true,
        message: 'Achievement already unlocked',
        userAchievement: existing
      });
    }

    // Update or create user achievement
    const userAchievement = await prisma.userAchievement.upsert({
      where: {
        userId_achievementId: {
          userId,
          achievementId
        }
      },
      update: {
        progress: progress || existing?.progress || 0,
        isUnlocked: progress === 100 || false
      },
      create: {
        userId,
        achievementId,
        progress: progress || 0,
        isUnlocked: progress === 100 || false,
        unlockedAt: progress === 100 ? new Date() : undefined
      }
    });

    return NextResponse.json({
      success: true,
      userAchievement,
      newlyUnlocked: progress === 100 && !existing?.isUnlocked
    });

  } catch (error) {
    console.error('Error unlocking achievement:', error);
    return NextResponse.json(
      { error: 'Failed to unlock achievement' },
      { status: 500 }
    );
  }
}




