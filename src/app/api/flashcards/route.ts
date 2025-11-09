import { NextRequest, NextResponse } from 'next/server';
import { PrismaDatabase } from '@/lib/prisma-database';
import { checkAndAwardAchievements } from '@/lib/achievement-system';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const category = searchParams.get('category');
    const reviewOnly = searchParams.get('reviewOnly') === 'true';

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const flashcards = await PrismaDatabase.getUserFlashcards(userId, category, reviewOnly);
    
    return NextResponse.json({
      success: true,
      flashcards,
      count: flashcards.length
    });

  } catch (error) {
    console.error('Error fetching flashcards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flashcards' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { question, answer, category, difficulty, userId, metadata } = await request.json();

    if (!question || !answer || !userId) {
      return NextResponse.json(
        { error: 'question, answer, and userId are required' },
        { status: 400 }
      );
    }

    const flashcard = await PrismaDatabase.createFlashcard({
      question,
      answer,
      category,
      difficulty: difficulty || 'medium',
      userId,
      metadata: metadata || {}
    });

    // Check achievements after creating flashcard
    try {
      const user = await PrismaDatabase.getUserById(userId);
      if (user) {
        await checkAndAwardAchievements(userId, user.stats || {});
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
      // Don't fail the request if achievement check fails
    }

    return NextResponse.json({
      success: true,
      flashcard
    });

  } catch (error) {
    console.error('Error creating flashcard:', error);
    return NextResponse.json(
      { error: 'Failed to create flashcard' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, masteryLevel, lastReviewed } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Flashcard id is required' },
        { status: 400 }
      );
    }

    const flashcard = await PrismaDatabase.updateFlashcard(id, {
      masteryLevel,
      lastReviewed: lastReviewed ? new Date(lastReviewed) : new Date()
    });

    return NextResponse.json({
      success: true,
      flashcard
    });

  } catch (error) {
    console.error('Error updating flashcard:', error);
    return NextResponse.json(
      { error: 'Failed to update flashcard' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Flashcard id is required' },
        { status: 400 }
      );
    }

    await PrismaDatabase.deleteFlashcard(id);

    return NextResponse.json({
      success: true,
      message: 'Flashcard deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting flashcard:', error);
    return NextResponse.json(
      { error: 'Failed to delete flashcard' },
      { status: 500 }
    );
  }
}
