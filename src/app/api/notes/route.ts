import { NextRequest, NextResponse } from 'next/server';
import { PrismaDatabase } from '@/lib/prisma-database';
import { checkAndAwardAchievements } from '@/lib/achievement-system';

// GET - Retrieve user notes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const category = searchParams.get('category');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const notes = await PrismaDatabase.getUserNotes(userId, category || undefined);
    
    return NextResponse.json({
      success: true,
      notes,
      count: notes.length
    });

  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

// POST - Create new note
export async function POST(request: NextRequest) {
  try {
    const { title, content, category, tags, userId, metadata } = await request.json();

    if (!title || !content || !userId) {
      return NextResponse.json(
        { error: 'title, content, and userId are required' },
        { status: 400 }
      );
    }

    // Convert tags array to string if needed (Prisma schema expects String)
    const tagsString = Array.isArray(tags) 
      ? tags.join(', ') 
      : (tags || '');

    // Convert metadata object to JSON string if needed (Prisma schema expects String)
    const metadataString = metadata 
      ? (typeof metadata === 'string' ? metadata : JSON.stringify(metadata))
      : null;

    const note = await PrismaDatabase.createNote({
      title,
      content,
      category: category || null,
      tags: tagsString || null,
      userId,
      metadata: metadataString
    });

    // Check achievements after creating note
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
      note
    });

  } catch (error: any) {
    console.error('Error creating note:', error);
    const errorMessage = error?.message || 'Failed to create note';
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// PUT - Update existing note
export async function PUT(request: NextRequest) {
  try {
    const { id, title, content, category, tags, metadata } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Note id is required' },
        { status: 400 }
      );
    }

    // Convert tags array to string if needed (Prisma schema expects String)
    const tagsString = Array.isArray(tags) 
      ? tags.join(', ') 
      : (tags || null);

    // Convert metadata object to JSON string if needed (Prisma schema expects String)
    const metadataString = metadata 
      ? (typeof metadata === 'string' ? metadata : JSON.stringify(metadata))
      : null;

    const note = await PrismaDatabase.updateNote(id, {
      title,
      content,
      category: category || null,
      tags: tagsString,
      metadata: metadataString
    });

    return NextResponse.json({
      success: true,
      note
    });

  } catch (error: any) {
    console.error('Error updating note:', error);
    const errorMessage = error?.message || 'Failed to update note';
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete note
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Note id is required' },
        { status: 400 }
      );
    }

    await PrismaDatabase.deleteNote(id);

    return NextResponse.json({
      success: true,
      message: 'Note deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    );
  }
}
