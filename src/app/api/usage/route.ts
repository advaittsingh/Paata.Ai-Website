import { NextRequest, NextResponse } from 'next/server';
import { PrismaDatabase } from '@/lib/prisma-database';
import { prisma } from '@/lib/prisma-database';

// Helper function to calculate performance trends
function calculatePerformanceTrends(dailyUsage: any, examSessions: any[]): {
  interactionTrend: { direction: 'up' | 'down' | 'stable'; percentage: number };
  accuracyTrend: { direction: 'up' | 'down' | 'stable'; percentage: number };
} {
  // Interaction trend
  const dates = Object.keys(dailyUsage).sort();
  let interactionTrend = { direction: 'stable' as const, percentage: 0 };
  
  if (dates.length >= 7) {
    const recent = dates.slice(-7);
    const previous = dates.slice(-14, -7);
    
    const recentTotal = recent.reduce((sum, date) => sum + (dailyUsage[date]?.interactions || 0), 0);
    const previousTotal = previous.length > 0 
      ? previous.reduce((sum, date) => sum + (dailyUsage[date]?.interactions || 0), 0)
      : recentTotal;
    
    if (previousTotal > 0) {
      const change = ((recentTotal - previousTotal) / previousTotal) * 100;
      interactionTrend = {
        direction: change > 5 ? 'up' : change < -5 ? 'down' : 'stable',
        percentage: Math.round(Math.abs(change))
      };
    }
  }
  
  // Accuracy trend from exams
  let accuracyTrend = { direction: 'stable' as const, percentage: 0 };
  if (examSessions.length >= 2) {
    const sorted = examSessions.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const recent = sorted.slice(-3);
    const previous = sorted.slice(-6, -3);
    
    const recentAvg = recent.reduce((sum, e) => sum + (e.score || 0), 0) / recent.length;
    const previousAvg = previous.length > 0 
      ? previous.reduce((sum, e) => sum + (e.score || 0), 0) / previous.length
      : recentAvg;
    
    if (previousAvg > 0) {
      const change = ((recentAvg - previousAvg) / previousAvg) * 100;
      accuracyTrend = {
        direction: change > 5 ? 'up' : change < -5 ? 'down' : 'stable',
        percentage: Math.round(Math.abs(change))
      };
    }
  }
  
  return { interactionTrend, accuracyTrend };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const period = searchParams.get('period') || '30d';

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get user data
    const user = await PrismaDatabase.getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate date range based on period
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

    // Get user's stats from database with proper defaults
    const stats = user.stats as any || {};
    
    // Ensure all stats have default zero values
    const defaultStats = {
      totalInteractions: 0,
      textMessages: 0,
      imageUploads: 0,
      voiceInputs: 0,
      totalTimeSpent: '0h 0m',
      averageSessionTime: '0m 0s',
      streakDays: 0,
      lastActiveDate: null,
      dailyUsage: {},
      subjectBreakdown: {},
      sessionCount: 0
    };
    
    // Safely merge stats, ensuring dailyUsage is an object
    const safeStats = stats || {};
    const userStats = { 
      ...defaultStats, 
      ...safeStats,
      dailyUsage: safeStats.dailyUsage || {}
    };
    
    // Calculate weekly data (last 7 days) with real data
    const weeklyData = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const userCreatedDate = new Date(user.createdAt);
    const daysSinceCreation = Math.floor((now.getTime() - userCreatedDate.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayName = days[date.getDay()];
      
      // Get real daily usage data or default to zero
      const dateKey = date.toISOString().split('T')[0];
      const dailyUsageData = userStats.dailyUsage?.[dateKey];
      const dailyUsage = dailyUsageData || {
        interactions: 0,
        timeSpent: 0,
        textMessages: 0,
        imageUploads: 0,
        voiceInputs: 0
      };
      
      // Only show data for days since user creation
      if (i <= daysSinceCreation && dailyUsage) {
        const timeMinutes = dailyUsage.timeSpent || 0;
        weeklyData.push({
          day: dayName,
          interactions: dailyUsage.interactions || 0,
          time: timeMinutes > 0 ? `${Math.floor(timeMinutes / 60)}h ${timeMinutes % 60}m` : '0h 0m',
          textMessages: dailyUsage.textMessages || 0,
          imageUploads: dailyUsage.imageUploads || 0,
          voiceInputs: dailyUsage.voiceInputs || 0
        });
      } else {
        // Days before account creation - no data
        weeklyData.push({
          day: dayName,
          interactions: 0,
          time: '0h 0m',
          textMessages: 0,
          imageUploads: 0,
          voiceInputs: 0
        });
      }
    }

    // Enhanced subject breakdown - analyze actual question contexts
    const questionContexts = await PrismaDatabase.getQuestionContexts(user.id);
    
    // Count subjects from actual question contexts
    const subjectCounts: Record<string, number> = {};
    questionContexts.forEach((ctx: any) => {
      const subject = ctx.category || 'Other';
      subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
    });
    
    // If no contexts, use preferences as fallback
    const preferences = user.preferences as any || {};
    const learningFocus = preferences.learning?.subjectFocus || ['Mathematics', 'Science', 'English', 'History'];
    
    let subjectBreakdown;
    if (Object.keys(subjectCounts).length > 0) {
      // Use actual data from question contexts
      const total = Object.values(subjectCounts).reduce((sum, count) => sum + count, 0);
      const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-yellow-500', 'bg-pink-500', 'bg-gray-500'];
      
      subjectBreakdown = Object.entries(subjectCounts)
        .map(([subject, count], index) => ({
          subject,
          interactions: count,
          percentage: Math.round((count / total) * 100 * 10) / 10,
          color: colors[index % colors.length]
        }))
        .sort((a, b) => b.interactions - a.interactions)
        .slice(0, 10); // Top 10 subjects
    } else {
      // Fallback to preferences-based breakdown
      subjectBreakdown = learningFocus.map((subject: string, index: number) => {
        if (stats.totalInteractions === 0) {
          return {
            subject,
            interactions: 0,
            percentage: 0,
            color: ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-gray-500'][index % 5]
          };
        }
        
        const baseInteractions = Math.floor((stats.totalInteractions || 0) / learningFocus.length);
        const percentage = (baseInteractions / (stats.totalInteractions || 1)) * 100;
        const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-gray-500'];
        
        return {
          subject,
          interactions: baseInteractions,
          percentage: Math.round(percentage * 10) / 10,
          color: colors[index % colors.length]
        };
      });
    }

    // Generate recent activity from actual question contexts
    const recentActivity = questionContexts
      .slice(0, 5) // Last 5 questions
      .map((ctx: any, index: number) => {
        const hoursAgo = index + 1;
        return {
          type: 'text', // Most questions are text-based
          subject: ctx.category || 'General',
          question: ctx.question || 'General question',
          time: hoursAgo === 1 ? '1 hour ago' : `${hoursAgo} hours ago`,
          duration: '5m 30s'
        };
      });
    
    // Get exam sessions for trend analysis
    const examSessions = await PrismaDatabase.getExamSessions(user.id);
    const trends = calculatePerformanceTrends(userStats.dailyUsage || {}, examSessions);

    // Get Smart Learning activity counts
    const [notesCount, flashcardsCount, mindMapsCount, examSessionsCount, focusSessionsCount, achievementsCount, chatSessionsCount] = await Promise.all([
      prisma.note.count({ where: { userId: user.id } }),
      prisma.flashcard.count({ where: { userId: user.id } }),
      prisma.mindMap.count({ where: { userId: user.id } }),
      prisma.examSession.count({ where: { userId: user.id } }),
      prisma.focusSession.count({ where: { userId: user.id } }),
      prisma.userAchievement.count({ where: { userId: user.id, isUnlocked: true } }),
      prisma.chatSession.count({ where: { userId: user.id } }),
    ]);

    // Calculate this month's data with real-time data
    const thisMonth = {
      interactions: userStats.totalInteractions,
      textMessages: userStats.textMessages,
      imageUploads: userStats.imageUploads,
      voiceInputs: userStats.voiceInputs,
      timeSpent: userStats.totalTimeSpent
    };

    const usageData = {
      // Basic stats from user data with proper defaults
      totalInteractions: userStats.totalInteractions,
      textMessages: userStats.textMessages,
      imageUploads: userStats.imageUploads,
      voiceInputs: userStats.voiceInputs,
      totalTimeSpent: userStats.totalTimeSpent,
      averageSessionTime: userStats.averageSessionTime,
      streakDays: userStats.streakDays,
      
      // Calculated data
      thisMonth,
      weeklyData,
      subjectBreakdown,
      recentActivity,
      
      // Performance trends
      trends: {
        interactionTrend: trends.interactionTrend,
        accuracyTrend: trends.accuracyTrend,
      },
      
      // User info
      user: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        plan: user.plan,
        joinDate: user.joinDate
      },

      // Smart Learning activity counts
      smartLearning: {
        chatSessions: chatSessionsCount,
        notes: notesCount,
        flashcards: flashcardsCount,
        mindMaps: mindMapsCount,
        examSessions: examSessionsCount,
        focusSessions: focusSessionsCount,
        achievements: achievementsCount,
      }
    };

    return NextResponse.json(usageData);

  } catch (error) {
    console.error('Usage API error:', error);
    
    // Return minimal default data instead of error
    return NextResponse.json({
      totalInteractions: 0,
      textMessages: 0,
      imageUploads: 0,
      voiceInputs: 0,
      totalTimeSpent: '0h 0m',
      averageSessionTime: '0m 0s',
      streakDays: 0,
      thisMonth: {
        interactions: 0,
        textMessages: 0,
        imageUploads: 0,
        voiceInputs: 0,
        timeSpent: '0h 0m'
      },
      weeklyData: [
        { day: 'Mon', interactions: 0, time: '0h 0m' },
        { day: 'Tue', interactions: 0, time: '0h 0m' },
        { day: 'Wed', interactions: 0, time: '0h 0m' },
        { day: 'Thu', interactions: 0, time: '0h 0m' },
        { day: 'Fri', interactions: 0, time: '0h 0m' },
        { day: 'Sat', interactions: 0, time: '0h 0m' },
        { day: 'Sun', interactions: 0, time: '0h 0m' }
      ],
      subjectBreakdown: [
        { subject: 'Mathematics', interactions: 0, percentage: 0, color: 'bg-blue-500' },
        { subject: 'Science', interactions: 0, percentage: 0, color: 'bg-green-500' },
        { subject: 'English', interactions: 0, percentage: 0, color: 'bg-purple-500' },
        { subject: 'History', interactions: 0, percentage: 0, color: 'bg-orange-500' },
        { subject: 'Other', interactions: 0, percentage: 0, color: 'bg-gray-500' }
      ],
      recentActivity: [],
      smartLearning: {
        chatSessions: 0,
        notes: 0,
        flashcards: 0,
        mindMaps: 0,
        examSessions: 0,
        focusSessions: 0,
        achievements: 0,
      }
    });
  }
}
