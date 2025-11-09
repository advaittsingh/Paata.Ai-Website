import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma-database';
import { verifyAdmin } from '@/lib/admin-utils';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const adminResult = await verifyAdmin(request);
    if (!adminResult.isAdmin) {
      return NextResponse.json(
        { error: adminResult.error || 'Admin access required' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const videoFile = formData.get('video') as File;
    const chapterId = formData.get('chapterId') as string;
    const title = formData.get('title') as string;

    if (!videoFile || !chapterId || !title) {
      return NextResponse.json(
        { error: 'Video file, chapter ID, and title are required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!videoFile.type.startsWith('video/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only video files are allowed.' },
        { status: 400 }
      );
    }

    // Check file size (500MB limit)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (videoFile.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size: 500MB' },
        { status: 400 }
      );
    }

    // Verify chapter exists
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
    });

    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }

    // Get the highest order number for this chapter
    const maxOrder = await prisma.video.findFirst({
      where: { chapterId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const order = (maxOrder?.order || 0) + 1;

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = videoFile.name.split('.').pop() || 'mp4';
    const fileName = `video_${chapterId}_${timestamp}.${fileExtension}`;

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'videos');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Save file to public/uploads/videos
    const filePath = join(uploadsDir, fileName);
    const bytes = await videoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Create database record
    const videoUrl = `/uploads/videos/${fileName}`;
    const video = await prisma.video.create({
      data: {
        chapterId,
        title,
        url: videoUrl,
        order,
        // Note: thumbnail and duration would need to be extracted from video
        // For now, we'll leave them optional
      },
      include: {
        chapter: {
          include: {
            subject: {
              include: {
                class: {
                  include: { board: true }
                }
              }
            }
          }
        }
      },
    });

    return NextResponse.json({ video });
  } catch (error: any) {
    console.error('Error uploading video:', error);
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 }
    );
  }
}

