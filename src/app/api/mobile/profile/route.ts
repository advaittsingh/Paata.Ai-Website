import { NextRequest, NextResponse } from 'next/server';
import { PrismaDatabase } from '@/lib/prisma-database';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify JWT token
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';
    const includeWeekly = searchParams.get('includeWeekly') === 'true';

    // Get user data
    const user = await PrismaDatabase.getUserById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        },
        { status: 404 }
      );
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
    
    const userStats = { ...defaultStats, ...stats };
    
    // Calculate weekly data (last 7 days) if requested
    let weeklyData = [];
    if (includeWeekly) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const userCreatedDate = new Date(user.createdAt);
      const daysSinceCreation = Math.floor((now.getTime() - userCreatedDate.getTime()) / (1000 * 60 * 60 * 24));
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = days[date.getDay()];
        
        const dayUsage = userStats.dailyUsage[dateStr] || {
          interactions: 0,
          timeSpent: 0,
          textMessages: 0,
          imageUploads: 0,
          voiceInputs: 0
        };
        
        weeklyData.push({
          day: dayName,
          date: dateStr,
          interactions: dayUsage.interactions,
          timeSpent: dayUsage.timeSpent,
          textMessages: dayUsage.textMessages,
          imageUploads: dayUsage.imageUploads,
          voiceInputs: dayUsage.voiceInputs
        });
      }
    }

    // Calculate streak
    let currentStreak = 0;
    const today = now.toISOString().split('T')[0];
    let checkDate = new Date(now);
    
    while (checkDate >= new Date(user.createdAt)) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const dayUsage = userStats.dailyUsage[dateStr];
      
      if (dayUsage && dayUsage.interactions > 0) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculate average session time
    const totalMinutes = parseInt(userStats.totalTimeSpent?.replace(/[^\d]/g, '') || '0');
    const sessionCount = userStats.sessionCount || userStats.totalInteractions || 1;
    const avgMinutes = Math.round(totalMinutes / sessionCount);
    const avgHours = Math.floor(avgMinutes / 60);
    const avgMins = avgMinutes % 60;
    const averageSessionTime = `${avgHours}h ${avgMins}m`;

    // Remove password from user object
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      analytics: {
        period,
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
        totalInteractions: userStats.totalInteractions,
        textMessages: userStats.textMessages,
        imageUploads: userStats.imageUploads,
        voiceInputs: userStats.voiceInputs,
        totalTimeSpent: userStats.totalTimeSpent,
        averageSessionTime,
        streakDays: currentStreak,
        lastActiveDate: userStats.lastActiveDate,
        weeklyData,
        subjectBreakdown: userStats.subjectBreakdown || {},
        plan: user.plan,
        joinDate: user.joinDate
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Mobile analytics error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        code: 'ANALYTICS_ERROR'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify JWT token
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        },
        { status: 401 }
      );
    }

    const updates = await request.json();
    
    // Remove sensitive fields that shouldn't be updated via this endpoint
    const allowedUpdates = {
      firstName: updates.firstName,
      lastName: updates.lastName,
      phone: updates.phone,
      bio: updates.bio,
      location: updates.location,
      website: updates.website,
      avatar: updates.avatar,
      preferences: updates.preferences
    };

    // Filter out undefined values
    const filteredUpdates = Object.fromEntries(
      Object.entries(allowedUpdates).filter(([_, value]) => value !== undefined)
    );

    const updatedUser = await PrismaDatabase.updateUser(decoded.userId, filteredUpdates);
    
    if (!updatedUser) {
      return NextResponse.json(
        { 
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Mobile profile update error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        code: 'UPDATE_ERROR'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
