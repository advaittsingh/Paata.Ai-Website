import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { PrismaDatabase } from '@/lib/prisma-database';

/**
 * GET /api/notifications
 * Get user notifications
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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const read = searchParams.get('read');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    // Get notifications
    let notifications;
    try {
      notifications = await PrismaDatabase.getUserNotifications(
        authResult.user.id,
        {
          type: type || undefined,
          read: read === 'true' ? true : read === 'false' ? false : undefined,
          limit,
          offset,
        }
      );
    } catch (dbError: any) {
      console.error('Database query error:', dbError);
      throw new Error(`Database query failed: ${dbError.message || String(dbError)}`);
    }

    // Get unread count
    let unreadCount;
    try {
      unreadCount = await PrismaDatabase.getUnreadNotificationCount(authResult.user.id);
    } catch (dbError: any) {
      console.error('Unread count query error:', dbError);
      unreadCount = 0; // Default to 0 if count fails
    }

    return NextResponse.json({
      success: true,
      notifications: notifications.map((n) => {
        let parsedMetadata = null;
        if (n.metadata) {
          try {
            parsedMetadata = JSON.parse(n.metadata);
          } catch (e) {
            // If metadata is not valid JSON, just use the string
            parsedMetadata = n.metadata;
          }
        }
        return {
          id: n.id,
          type: n.type,
          title: n.title,
          message: n.message,
          icon: n.icon,
          read: n.read,
          readAt: n.readAt?.toISOString(),
          createdAt: n.createdAt.toISOString(),
          metadata: parsedMetadata,
        };
      }),
      unreadCount,
    });
  } catch (error: any) {
    console.error('Get notifications error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { 
        error: 'Failed to fetch notifications',
        details: process.env.NODE_ENV === 'development' ? (error.message || String(error)) : undefined,
        type: error.name || 'UnknownError'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notifications
 * Create a new notification
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

    const { type, title, message, icon, metadata } = await request.json();

    if (!type || !title || !message) {
      return NextResponse.json(
        { error: 'type, title, and message are required' },
        { status: 400 }
      );
    }

    const notification = await PrismaDatabase.createNotification({
      userId: authResult.user.id,
      type,
      title,
      message,
      icon,
      metadata: metadata ? JSON.stringify(metadata) : undefined,
    });

    return NextResponse.json({
      success: true,
      notification: {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        icon: notification.icon,
        read: notification.read,
        createdAt: notification.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Create notification error:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/notifications
 * Mark notification(s) as read
 */
export async function PUT(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id, markAll } = await request.json();

    if (markAll) {
      await PrismaDatabase.markAllNotificationsAsRead(authResult.user.id);
      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read',
      });
    }

    if (!id) {
      return NextResponse.json(
        { error: 'Notification id is required' },
        { status: 400 }
      );
    }

    await PrismaDatabase.markNotificationAsRead(id);

    return NextResponse.json({
      success: true,
      message: 'Notification marked as read',
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    return NextResponse.json(
      { error: 'Failed to mark notification as read' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/notifications
 * Delete notification(s)
 */
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const deleteAll = searchParams.get('deleteAll') === 'true';

    if (deleteAll) {
      await PrismaDatabase.deleteAllNotifications(authResult.user.id);
      return NextResponse.json({
        success: true,
        message: 'All notifications deleted',
      });
    }

    if (!id) {
      return NextResponse.json(
        { error: 'Notification id is required' },
        { status: 400 }
      );
    }

    await PrismaDatabase.deleteNotification(id);

    return NextResponse.json({
      success: true,
      message: 'Notification deleted',
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    );
  }
}
