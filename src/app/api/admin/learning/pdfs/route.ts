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
    const pdfFile = formData.get('pdf') as File;
    const chapterId = formData.get('chapterId') as string;
    const title = formData.get('title') as string;

    if (!pdfFile || !chapterId || !title) {
      return NextResponse.json(
        { error: 'PDF file, chapter ID, and title are required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (pdfFile.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF files are allowed.' },
        { status: 400 }
      );
    }

    // Check file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (pdfFile.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size: 100MB' },
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
    const maxOrder = await prisma.pdf.findFirst({
      where: { chapterId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const order = (maxOrder?.order || 0) + 1;

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `pdf_${chapterId}_${timestamp}.pdf`;

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'pdfs');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Save file to public/uploads/pdfs
    const filePath = join(uploadsDir, fileName);
    const bytes = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Calculate file size in MB
    const sizeMB = (pdfFile.size / (1024 * 1024)).toFixed(2);
    const size = `${sizeMB} MB`;

    // Create database record
    const pdfUrl = `/uploads/pdfs/${fileName}`;
    const pdf = await prisma.pdf.create({
      data: {
        chapterId,
        title,
        url: pdfUrl,
        size,
        order,
        // Note: pages would need to be extracted from PDF
        // For now, we'll leave it optional
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

    return NextResponse.json({ pdf });
  } catch (error: any) {
    console.error('Error uploading PDF:', error);
    return NextResponse.json(
      { error: 'Failed to upload PDF' },
      { status: 500 }
    );
  }
}

