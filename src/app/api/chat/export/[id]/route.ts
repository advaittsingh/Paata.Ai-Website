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
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';

    // Verify session belongs to user
    const session = await PrismaDatabase.getChatSession(sessionId);
    if (!session || session.userId !== authResult.user.id) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    const messages = await PrismaDatabase.getSessionMessages(sessionId);

    if (format === 'json') {
      const exportData = {
        session: {
          id: session.id,
          title: session.title,
          createdAt: session.createdAt.toISOString(),
          updatedAt: session.updatedAt.toISOString(),
        },
        messages: messages.map((msg) => ({
          text: msg.text,
          isUser: msg.isUser,
          timestamp: msg.timestamp.toISOString(),
          metadata: msg.metadata ? JSON.parse(msg.metadata) : null,
        })),
      };

      return new NextResponse(JSON.stringify(exportData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="chat-${session.id}.json"`,
        },
      });
    } else if (format === 'txt') {
      const exportText = `Chat Session: ${session.title}\nCreated: ${session.createdAt.toISOString()}\n\n${messages.map((msg, idx) => `${idx + 1}. ${msg.isUser ? 'You' : 'PAATA.AI'}: ${msg.text}`).join('\n\n')}`;

      return new NextResponse(exportText, {
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': `attachment; filename="chat-${session.id}.txt"`,
        },
      });
    }

    return NextResponse.json(
      { error: 'Invalid format. Use json or txt' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Export chat error:', error);
    return NextResponse.json(
      { error: 'Failed to export chat' },
      { status: 500 }
    );
  }
}

