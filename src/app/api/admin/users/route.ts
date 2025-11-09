import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-utils';
import { PrismaDatabase } from '@/lib/prisma-database';
import { prisma } from '@/lib/prisma-database';

/**
 * GET /api/admin/users
 * Get all users (Admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const adminResult = await verifyAdmin(request);
    if (!adminResult.isAdmin) {
      return NextResponse.json(
        { error: adminResult.error || 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get('includeStats') === 'true';
    const userId = searchParams.get('userId');

    if (userId) {
      // Get single user with full details
      const user = await PrismaDatabase.getUserById(userId);
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      const stats = user.stats as any || {};
      const preferences = user.preferences as any || {};

      // Get user's data counts
      const [notesCount, flashcardsCount, examSessionsCount, chatSessionsCount] = await Promise.all([
        prisma.note.count({ where: { userId } }),
        prisma.flashcard.count({ where: { userId } }),
        prisma.examSession.count({ where: { userId } }),
        prisma.chatSession.count({ where: { userId } }),
      ]);

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          bio: user.bio,
          location: user.location,
          avatar: user.avatar,
          plan: user.plan,
          subscriptionStatus: user.subscriptionStatus,
          emailVerified: user.emailVerified,
          twoFactorEnabled: user.twoFactorEnabled || false,
          joinDate: user.joinDate,
          createdAt: user.createdAt,
          preferences,
          stats: includeStats ? stats : undefined,
          counts: {
            notes: notesCount,
            flashcards: flashcardsCount,
            examSessions: examSessionsCount,
            chatSessions: chatSessionsCount,
          },
        },
      });
    }

    const users = await PrismaDatabase.getAllUsers();

    return NextResponse.json({
      success: true,
      users: users.map(user => {
        const stats = user.stats as any || {};
        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          plan: user.plan,
          subscriptionStatus: user.subscriptionStatus,
          emailVerified: user.emailVerified,
          totalInteractions: stats.totalInteractions || 0,
          streakDays: stats.streakDays || 0,
          createdAt: user.createdAt,
        };
      }),
      count: users.length,
    });

  } catch (error: any) {
    console.error('Admin get users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

