import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma-database';
import { verifyAdmin } from '@/lib/admin-utils';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminResult = await verifyAdmin(request);
    if (!adminResult.isAdmin) {
      return NextResponse.json(
        { error: adminResult.error || 'Admin access required' },
        { status: 403 }
      );
    }

    const videoId = params.id;

    // Find the video
    const video = await prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Delete the file from filesystem
    if (video.url.startsWith('/uploads/')) {
      const filePath = join(process.cwd(), 'public', video.url);
      if (existsSync(filePath)) {
        try {
          await unlink(filePath);
        } catch (fileError) {
          console.error('Error deleting video file:', fileError);
          // Continue with database deletion even if file deletion fails
        }
      }
    }

    // Delete from database
    await prisma.video.delete({
      where: { id: videoId },
    });

    return NextResponse.json({ success: true, message: 'Video deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    );
  }
}

