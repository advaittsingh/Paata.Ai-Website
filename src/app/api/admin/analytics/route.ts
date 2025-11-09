import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-utils';
import { PrismaDatabase } from '@/lib/prisma-database';
import { prisma } from '@/lib/prisma-database';

/**
 * GET /api/admin/analytics
 * Get comprehensive analytics for admin dashboard
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
    const period = searchParams.get('period') || '30d';

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get all users
    const allUsers = await PrismaDatabase.getAllUsers();

    // Calculate user statistics
    const totalUsers = allUsers.length;
    const activeUsers = allUsers.filter(user => {
      const stats = user.stats as any || {};
      return (stats.totalInteractions || 0) > 0;
    }).length;
    
    const newUsers = allUsers.filter(user => {
      const createdAt = new Date(user.createdAt);
      return createdAt >= startDate;
    }).length;

    // Plan distribution
    const planDistribution = {
      Basic: allUsers.filter(u => u.plan === 'Basic').length,
      Pro: allUsers.filter(u => u.plan === 'Pro').length,
      Enterprise: allUsers.filter(u => u.plan === 'Enterprise').length,
    };

    // Aggregate usage statistics
    let totalInteractions = 0;
    let totalTextMessages = 0;
    let totalImageUploads = 0;
    let totalVoiceInputs = 0;
    let totalChatSessions = 0;
    let totalNotes = 0;
    let totalFlashcards = 0;
    let totalExamSessions = 0;
    let totalFocusSessions = 0;

    // Get aggregated data from database
    const [notesCount, flashcardsCount, examSessionsCount, focusSessionsCount, chatSessionsCount] = await Promise.all([
      prisma.note.count(),
      prisma.flashcard.count(),
      prisma.examSession.count(),
      prisma.focusSession.count(),
      prisma.chatSession.count(),
    ]);

    totalNotes = notesCount;
    totalFlashcards = flashcardsCount;
    totalExamSessions = examSessionsCount;
    totalFocusSessions = focusSessionsCount;
    totalChatSessions = chatSessionsCount;

    // Aggregate user stats
    allUsers.forEach(user => {
      const stats = user.stats as any || {};
      totalInteractions += stats.totalInteractions || 0;
      totalTextMessages += stats.textMessages || 0;
      totalImageUploads += stats.imageUploads || 0;
      totalVoiceInputs += stats.voiceInputs || 0;
    });

    // Feature usage ranking
    const featureUsage = [
      { name: 'Chat', count: totalChatSessions, percentage: 0 },
      { name: 'Notes', count: totalNotes, percentage: 0 },
      { name: 'Flashcards', count: totalFlashcards, percentage: 0 },
      { name: 'Exam Mode', count: totalExamSessions, percentage: 0 },
      { name: 'Focus Mode', count: totalFocusSessions, percentage: 0 },
    ];

    const totalFeatureUsage = featureUsage.reduce((sum, f) => sum + f.count, 0);
    featureUsage.forEach(f => {
      f.percentage = totalFeatureUsage > 0 ? Math.round((f.count / totalFeatureUsage) * 100) : 0;
    });

    featureUsage.sort((a, b) => b.count - a.count);

    // Daily activity (last 30 days)
    const dailyActivity = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateKey = date.toISOString().split('T')[0];
      
      // Count users active on this date (simplified - would need actual activity tracking)
      let activeCount = 0;
      allUsers.forEach(user => {
        const stats = user.stats as any || {};
        const dailyUsage = stats.dailyUsage || {};
        if (dailyUsage[dateKey] && dailyUsage[dateKey].interactions > 0) {
          activeCount++;
        }
      });

      dailyActivity.push({
        date: dateKey,
        activeUsers: activeCount,
        interactions: 0, // Would need to aggregate from dailyUsage
      });
    }

    // User growth over time
    const userGrowth = [];
    const growthStartDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    for (let i = 89; i >= 0; i--) {
      const date = new Date(growthStartDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dateKey = date.toISOString().split('T')[0];
      
      const usersOnDate = allUsers.filter(user => {
        const createdAt = new Date(user.createdAt);
        return createdAt.toISOString().split('T')[0] <= dateKey;
      }).length;

      userGrowth.push({
        date: dateKey,
        count: usersOnDate,
      });
    }

    // Most active users (top 10)
    const mostActiveUsers = allUsers
      .map(user => {
        const stats = user.stats as any || {};
        return {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          plan: user.plan,
          interactions: stats.totalInteractions || 0,
          streakDays: stats.streakDays || 0,
        };
      })
      .sort((a, b) => b.interactions - a.interactions)
      .slice(0, 10);

    // Input method distribution
    const inputMethodDistribution = {
      text: totalTextMessages,
      image: totalImageUploads,
      voice: totalVoiceInputs,
    };

    const totalInputs = totalTextMessages + totalImageUploads + totalVoiceInputs;
    const inputMethodPercentages = {
      text: totalInputs > 0 ? Math.round((totalTextMessages / totalInputs) * 100) : 0,
      image: totalInputs > 0 ? Math.round((totalImageUploads / totalInputs) * 100) : 0,
      voice: totalInputs > 0 ? Math.round((totalVoiceInputs / totalInputs) * 100) : 0,
    };

    return NextResponse.json({
      success: true,
      analytics: {
        overview: {
          totalUsers,
          activeUsers,
          newUsers,
          inactiveUsers: totalUsers - activeUsers,
        },
        planDistribution,
        usage: {
          totalInteractions,
          totalTextMessages,
          totalImageUploads,
          totalVoiceInputs,
          totalChatSessions,
          totalNotes,
          totalFlashcards,
          totalExamSessions,
          totalFocusSessions,
        },
        featureUsage,
        inputMethodDistribution: {
          ...inputMethodDistribution,
          percentages: inputMethodPercentages,
        },
        dailyActivity,
        userGrowth,
        mostActiveUsers,
        period,
      },
    });

  } catch (error: any) {
    console.error('Admin analytics error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch analytics',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}


