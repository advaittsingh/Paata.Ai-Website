import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-utils';
import { PrismaDatabase } from '@/lib/prisma-database';

/**
 * POST /api/admin/notifications
 * Create notifications for users (Admin only)
 * 
 * Body:
 * - userIds: string[] (optional) - Specific user IDs to notify. If empty, sends to all users
 * - type: string - Notification type (achievement, reminder, update, system, exam, subscription)
 * - title: string - Notification title
 * - message: string - Notification message
 * - icon: string (optional) - Emoji or icon identifier
 * - metadata: object (optional) - Additional metadata
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const adminResult = await verifyAdmin(request);
    if (!adminResult.isAdmin) {
      return NextResponse.json(
        { error: adminResult.error || 'Admin access required' },
        { status: 403 }
      );
    }

    const { userIds, type, title, message, icon, metadata } = await request.json();

    // Validate required fields
    if (!type || !title || !message) {
      return NextResponse.json(
        { error: 'type, title, and message are required' },
        { status: 400 }
      );
    }

    // If userIds is provided, send to specific users
    if (userIds && Array.isArray(userIds) && userIds.length > 0) {
      const notifications = [];
      for (const userId of userIds) {
        try {
          const notification = await PrismaDatabase.createNotification({
            userId,
            type,
            title,
            message,
            icon,
            metadata: metadata ? JSON.stringify(metadata) : undefined,
          });
          notifications.push(notification);
        } catch (error) {
          console.error(`Failed to create notification for user ${userId}:`, error);
        }
      }

      return NextResponse.json({
        success: true,
        message: `Created ${notifications.length} notification(s)`,
        notifications: notifications.map(n => ({
          id: n.id,
          userId: n.userId,
          title: n.title,
        })),
      });
    }

    // If no userIds provided, send to all users
    const allUsers = await PrismaDatabase.getAllUsers();
    const notifications = [];
    
    for (const user of allUsers) {
      try {
        const notification = await PrismaDatabase.createNotification({
          userId: user.id,
          type,
          title,
          message,
          icon,
          metadata: metadata ? JSON.stringify(metadata) : undefined,
        });
        notifications.push(notification);
      } catch (error) {
        console.error(`Failed to create notification for user ${user.id}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Created ${notifications.length} notification(s) for all users`,
      count: notifications.length,
    });

  } catch (error: any) {
    console.error('Admin create notification error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create notifications',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/notifications
 * Get all notifications across all users (Admin only)
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
    const userId = searchParams.get('userId');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;

    // If userId is provided, get notifications for that user
    if (userId) {
      const notifications = await PrismaDatabase.getUserNotifications(userId, { limit, offset });
      return NextResponse.json({
        success: true,
        notifications: notifications.map((n) => ({
          id: n.id,
          userId: n.userId,
          type: n.type,
          title: n.title,
          message: n.message,
          icon: n.icon,
          read: n.read,
          createdAt: n.createdAt.toISOString(),
        })),
      });
    }

    // Otherwise, get all notifications (would need a new method in PrismaDatabase)
    // For now, return a message that userId is required
    return NextResponse.json(
      { error: 'userId query parameter is required' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('Admin get notifications error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
