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

    // Runtime check: Verify Class model exists
    const classModel = (prisma as any).class;
    if (!classModel || typeof classModel !== 'object' || typeof classModel.findMany !== 'function') {
      console.error('[API] Class model not found in Prisma client');
      return NextResponse.json(
        { 
          error: 'Database model not available',
          message: 'The Class model is not available in Prisma client.',
          details: 'Please restart your Next.js dev server and ensure Prisma client is regenerated.'
        },
        { status: 500 }
      );
    }

    const classes = await prisma.class.findMany({
      include: { board: true },
      orderBy: [{ board: { name: 'asc' } }, { number: 'asc' }],
    });

    return NextResponse.json({ classes });
  } catch (error: any) {
    console.error('Error fetching classes:', error);
    
    // Check if it's a Prisma model error
    if (error.message?.includes("Cannot read properties of undefined") || 
        error.message?.includes("reading 'findMany'") ||
        error.message?.includes("class is not defined")) {
      return NextResponse.json(
        { 
          error: 'Database model not available',
          message: 'The Class model is not available in Prisma client.',
          details: 'Please restart your Next.js dev server.'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch classes', message: error.message },
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
    const { boardId, number, name } = body;

    if (!boardId || !number) {
      return NextResponse.json(
        { error: 'Board ID and class number are required' },
        { status: 400 }
      );
    }

    const classData = await prisma.class.create({
      data: {
        boardId,
        number,
        name: name || undefined,
      },
      include: { board: true },
    });

    return NextResponse.json({ class: classData });
  } catch (error: any) {
    console.error('Error creating class:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Class with this number already exists for this board' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create class' },
      { status: 500 }
    );
  }
}

