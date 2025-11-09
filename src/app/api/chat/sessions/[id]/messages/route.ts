import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { PrismaDatabase } from '@/lib/prisma-database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAuth(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const sessionId = params.id;

    // Verify session belongs to user
    const session = await PrismaDatabase.getChatSession(sessionId);
    if (!session || session.userId !== authResult.user.id) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    const messages = await PrismaDatabase.getSessionMessages(sessionId);

    return NextResponse.json({
      success: true,
      messages: messages.map((msg) => ({
        id: msg.id,
        text: msg.text,
        isUser: msg.isUser,
        timestamp: msg.timestamp.toISOString(),
        metadata: msg.metadata ? JSON.parse(msg.metadata) : null,
      })),
    });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAuth(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const sessionId = params.id;
    const { text, isUser, metadata } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Message text is required' },
        { status: 400 }
      );
    }

    // Verify session belongs to user
    const session = await PrismaDatabase.getChatSession(sessionId);
    if (!session || session.userId !== authResult.user.id) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    const message = await PrismaDatabase.createMessage({
      sessionId,
      text,
      isUser: isUser ?? true,
      metadata: metadata ? JSON.stringify(metadata) : undefined,
    });

    // Update session timestamp
    await PrismaDatabase.updateChatSession(sessionId, {});

    return NextResponse.json({
      success: true,
      message: {
        id: message.id,
        text: message.text,
        isUser: message.isUser,
        timestamp: message.timestamp.toISOString(),
        metadata: message.metadata ? JSON.parse(message.metadata) : null,
      },
    });
  } catch (error) {
    console.error('Create message error:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}

