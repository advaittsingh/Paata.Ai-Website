import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma-database';

// GET - Get all badges or user's badges
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const badges = await prisma.badge.findMany({
      orderBy: { rarity: 'desc' }
    });

    if (!userId) {
      return NextResponse.json({
        success: true,
        badges
      });
    }

    // Get user's earned badges
    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true }
    });

    const badgesWithStatus = badges.map(badge => {
      const userBadge = userBadges.find(ub => ub.badgeId === badge.id);
      return {
        ...badge,
        earned: !!userBadge,
        earnedAt: userBadge?.earnedAt || null
      };
    });

    return NextResponse.json({
      success: true,
      badges: badgesWithStatus,
      totalBadges: badges.length,
      earnedBadges: userBadges.length
    });

  } catch (error) {
    console.error('Error fetching badges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch badges' },
      { status: 500 }
    );
  }
}

// POST - Award a badge to a user
export async function POST(request: NextRequest) {
  try {
    const { userId, badgeId } = await request.json();

    if (!userId || !badgeId) {
      return NextResponse.json(
        { error: 'userId and badgeId are required' },
        { status: 400 }
      );
    }

    // Check if badge exists
    const badge = await prisma.badge.findUnique({
      where: { id: badgeId }
    });

    if (!badge) {
      return NextResponse.json(
        { error: 'Badge not found' },
        { status: 404 }
      );
    }

    // Check if already earned
    const existing = await prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId,
          badgeId
        }
      }
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Badge already earned',
        userBadge: existing
      });
    }

    // Award badge
    const userBadge = await prisma.userBadge.create({
      data: {
        userId,
        badgeId,
        earnedAt: new Date()
      },
      include: { badge: true }
    });

    return NextResponse.json({
      success: true,
      newlyEarned: true,
      userBadge
    });

  } catch (error) {
    console.error('Error awarding badge:', error);
    return NextResponse.json(
      { error: 'Failed to award badge' },
      { status: 500 }
    );
  }
}




