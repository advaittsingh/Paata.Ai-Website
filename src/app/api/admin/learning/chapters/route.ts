import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma-database';
import { verifyAdmin } from '@/lib/admin-utils';

export async function GET(request: NextRequest) {
  try {
    const adminResult = await verifyAdmin(request);
    if (!adminResult.isAdmin) {
      return NextResponse.json(
        { error: adminResult.error || 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get('chapterId');

    // If chapterId is provided, return single chapter with full details
    if (chapterId) {
      const chapter = await prisma.chapter.findUnique({
        where: { id: chapterId },
        include: {
          subject: {
            include: {
              class: {
                include: { board: true }
              }
            }
          },
          videos: {
            orderBy: { order: 'asc' }
          },
          pdfs: {
            orderBy: { order: 'asc' }
          }
        },
      });

      if (!chapter) {
        return NextResponse.json(
          { error: 'Chapter not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ chapter });
    }

    // Runtime check: Verify Chapter model exists
    const chapterModel = (prisma as any).chapter;
    if (!chapterModel || typeof chapterModel !== 'object' || typeof chapterModel.findMany !== 'function') {
      console.error('[API] Chapter model not found in Prisma client');
      return NextResponse.json(
        { 
          error: 'Database model not available',
          message: 'The Chapter model is not available in Prisma client.',
          details: 'Please restart your Next.js dev server and ensure Prisma client is regenerated.'
        },
        { status: 500 }
      );
    }

    // Otherwise return all chapters
    const chapters = await prisma.chapter.findMany({
      include: {
        subject: {
          include: {
            class: {
              include: { board: true }
            }
          }
        },
        videos: {
          orderBy: { order: 'asc' }
        },
        pdfs: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: [
        { subject: { class: { board: { name: 'asc' } } } },
        { subject: { class: { number: 'asc' } } },
        { subject: { name: 'asc' } },
        { number: 'asc' }
      ],
    });

    return NextResponse.json({ chapters });
  } catch (error: any) {
    console.error('Error fetching chapters:', error);
    
    // Check if it's a Prisma model error
    if (error.message?.includes("Cannot read properties of undefined") || 
        error.message?.includes("reading 'findMany'") ||
        error.message?.includes("chapter is not defined")) {
      return NextResponse.json(
        { 
          error: 'Database model not available',
          message: 'The Chapter model is not available in Prisma client.',
          details: 'Please restart your Next.js dev server.'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch chapters', message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminResult = await verifyAdmin(request);
    if (!adminResult.isAdmin) {
      return NextResponse.json(
        { error: adminResult.error || 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { subjectId, title, description, number, topics } = body;

    if (!subjectId || !title || !number) {
      return NextResponse.json(
        { error: 'Subject ID, title, and number are required' },
        { status: 400 }
      );
    }

    // Parse topics if it's a string
    let topicsJson = null;
    if (topics) {
      if (typeof topics === 'string') {
        const topicsArray = topics.split(',').map(t => t.trim()).filter(t => t);
        topicsJson = JSON.stringify(topicsArray);
      } else {
        topicsJson = JSON.stringify(topics);
      }
    }

    const chapter = await prisma.chapter.create({
      data: {
        subjectId,
        title,
        description: description || undefined,
        number: parseInt(number),
        topics: topicsJson || undefined,
      },
      include: {
        subject: {
          include: {
            class: {
              include: { board: true }
            }
          }
        },
        videos: true,
        pdfs: true,
      },
    });

    return NextResponse.json({ chapter });
  } catch (error: any) {
    console.error('Error creating chapter:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Chapter with this number already exists for this subject' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create chapter' },
      { status: 500 }
    );
  }
}

