import { NextRequest, NextResponse } from 'next/server';
import { PrismaDatabase } from '@/lib/prisma-database';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('avatar') as File;
    const userId = formData.get('userId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Get user to verify they exist
    const user = await PrismaDatabase.getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Convert file to base64 for storage (simplified approach for Vercel)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Update user's avatar in database with base64 data URL
    const updatedUser = await PrismaDatabase.updateUser(userId, {
      avatar: dataUrl
    });

    if (!updatedUser) {
      return NextResponse.json({ error: 'Failed to update user avatar' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      avatarUrl: dataUrl,
      user: updatedUser
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get user to verify they exist
    const user = await PrismaDatabase.getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user's avatar to default
    const updatedUser = await PrismaDatabase.updateUser(userId, {
      avatar: '/image/avatar1.jpg' // Default avatar
    });

    if (!updatedUser) {
      return NextResponse.json({ error: 'Failed to update user avatar' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      avatarUrl: '/image/avatar1.jpg',
      user: updatedUser
    });

  } catch (error) {
    console.error('Avatar delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
