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

    const pdfId = params.id;

    // Find the PDF
    const pdf = await prisma.pdf.findUnique({
      where: { id: pdfId },
    });

    if (!pdf) {
      return NextResponse.json(
        { error: 'PDF not found' },
        { status: 404 }
      );
    }

    // Delete the file from filesystem
    if (pdf.url.startsWith('/uploads/')) {
      const filePath = join(process.cwd(), 'public', pdf.url);
      if (existsSync(filePath)) {
        try {
          await unlink(filePath);
        } catch (fileError) {
          console.error('Error deleting PDF file:', fileError);
          // Continue with database deletion even if file deletion fails
        }
      }
    }

    // Delete from database
    await prisma.pdf.delete({
      where: { id: pdfId },
    });

    return NextResponse.json({ success: true, message: 'PDF deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting PDF:', error);
    return NextResponse.json(
      { error: 'Failed to delete PDF' },
      { status: 500 }
    );
  }
}

