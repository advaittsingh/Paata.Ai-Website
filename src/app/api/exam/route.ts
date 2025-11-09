import { NextRequest, NextResponse } from 'next/server';
import { PrismaDatabase } from '@/lib/prisma-database';
import { verifyAuth } from '@/lib/auth-middleware';
import { checkRateLimitEnhanced } from '@/lib/rate-limit-enhanced';
import { checkAndAwardAchievements } from '@/lib/achievement-system';

export async function GET(request: NextRequest) {
  // Rate limiting for GET requests (lighter limit)
  const rateLimit = checkRateLimitEnhanced(request, 'exam');
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      { 
        status: 429,
        headers: {
          'Retry-After': rateLimit.retryAfter?.toString() || '60'
        }
      }
    );
  }
  try {
    const authResult = await verifyAuth(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || authResult.user.id;
    const status = searchParams.get('status');

    // Ensure user can only access their own sessions
    if (userId !== authResult.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const sessions = await PrismaDatabase.getExamSessions(userId, status || undefined);
    
    // Parse JSON strings back to objects for client
    const parsedSessions = sessions.map(session => ({
      ...session,
      questions: typeof session.questions === 'string' ? JSON.parse(session.questions) : session.questions,
      userAnswers: session.userAnswers ? (typeof session.userAnswers === 'string' ? JSON.parse(session.userAnswers) : session.userAnswers) : null,
      metadata: session.metadata ? (typeof session.metadata === 'string' ? JSON.parse(session.metadata) : session.metadata) : null,
    }));
    
    return NextResponse.json({
      success: true,
      sessions: parsedSessions,
      count: parsedSessions.length
    });

  } catch (error) {
    console.error('Error fetching exam sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exam sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting for POST requests
    const rateLimit = checkRateLimitEnhanced(request, 'exam');
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimit.retryAfter?.toString() || '60'
          }
        }
      );
    }

    const authResult = await verifyAuth(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { title, questions, totalQuestions, userId, metadata } = await request.json();

    if (!title || !questions || !userId) {
      return NextResponse.json(
        { error: 'title, questions, and userId are required' },
        { status: 400 }
      );
    }

    // Ensure user can only create sessions for themselves
    if (userId !== authResult.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Validate questions array
    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: 'Questions must be a non-empty array' },
        { status: 400 }
      );
    }

    // Convert questions to JSON string (database schema expects String, not Json)
    const questionsString = JSON.stringify(questions);
    const metadataString = metadata ? JSON.stringify(metadata) : null;

    const session = await PrismaDatabase.createExamSession({
      title,
      questions: questionsString,
      totalQuestions: totalQuestions || questions.length,
      userId,
      metadata: metadataString || undefined
    });

    // Parse JSON strings back to objects for client
    const parsedSession = {
      ...session,
      questions: typeof session.questions === 'string' ? JSON.parse(session.questions) : session.questions,
      userAnswers: session.userAnswers ? (typeof session.userAnswers === 'string' ? JSON.parse(session.userAnswers) : session.userAnswers) : null,
      metadata: session.metadata ? (typeof session.metadata === 'string' ? JSON.parse(session.metadata) : session.metadata) : null,
    };

    return NextResponse.json({
      success: true,
      session: parsedSession
    });

  } catch (error: any) {
    console.error('Error creating exam session:', error);
    console.error('Error details:', error.message, error.stack);
    return NextResponse.json(
      { 
        error: 'Failed to create exam session',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Rate limiting for PUT requests
    const rateLimit = checkRateLimitEnhanced(request, 'exam');
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimit.retryAfter?.toString() || '60'
          }
        }
      );
    }

    const authResult = await verifyAuth(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id, userAnswers, score, timeSpent, status } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Session id is required' },
        { status: 400 }
      );
    }

    // Verify session belongs to user
    const existingSession = await PrismaDatabase.getExamSession(id);
    if (!existingSession || existingSession.userId !== authResult.user.id) {
      return NextResponse.json(
        { error: 'Session not found or unauthorized' },
        { status: 404 }
      );
    }

    // Convert userAnswers to JSON string if it's an array
    const userAnswersString = Array.isArray(userAnswers) ? JSON.stringify(userAnswers) : userAnswers;

    // Store timeSpent in metadata
    const existingMetadata = existingSession.metadata 
      ? (typeof existingSession.metadata === 'string' 
          ? JSON.parse(existingSession.metadata) 
          : existingSession.metadata)
      : {};
    
    const updatedMetadata = {
      ...existingMetadata,
      timeSpent: timeSpent || existingMetadata.timeSpent,
      completedAt: status === 'completed' ? new Date().toISOString() : existingMetadata.completedAt
    };

    const session = await PrismaDatabase.updateExamSession(id, {
      userAnswers: userAnswersString,
      score,
      timeSpent,
      status,
      metadata: JSON.stringify(updatedMetadata),
      completedAt: status === 'completed' ? new Date() : undefined
    });

    // Check achievements after completing exam session
    if (status === 'completed') {
      try {
        const user = await PrismaDatabase.getUserById(authResult.user.id);
        if (user) {
          await checkAndAwardAchievements(authResult.user.id, user.stats || {});
        }
      } catch (error) {
        console.error('Error checking achievements:', error);
        // Don't fail the request if achievement check fails
      }
    }

    // Parse JSON strings back to objects for client
    const parsedSession = {
      ...session,
      questions: typeof session.questions === 'string' ? JSON.parse(session.questions) : session.questions,
      userAnswers: session.userAnswers ? (typeof session.userAnswers === 'string' ? JSON.parse(session.userAnswers) : session.userAnswers) : null,
      metadata: session.metadata ? (typeof session.metadata === 'string' ? JSON.parse(session.metadata) : session.metadata) : null,
    };

    return NextResponse.json({
      success: true,
      session: parsedSession
    });

  } catch (error) {
    console.error('Error updating exam session:', error);
    return NextResponse.json(
      { error: 'Failed to update exam session' },
      { status: 500 }
    );
  }
}
