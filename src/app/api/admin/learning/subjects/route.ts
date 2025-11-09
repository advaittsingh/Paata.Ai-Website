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

    // Runtime check: Verify Subject model exists
    const subjectModel = (prisma as any).subject;
    if (!subjectModel || typeof subjectModel !== 'object' || typeof subjectModel.findMany !== 'function') {
      console.error('[API] Subject model not found in Prisma client');
      return NextResponse.json(
        { 
          error: 'Database model not available',
          message: 'The Subject model is not available in Prisma client.',
          details: 'Please restart your Next.js dev server and ensure Prisma client is regenerated.'
        },
        { status: 500 }
      );
    }

    const subjects = await prisma.subject.findMany({
      include: { class: { include: { board: true } } },
      orderBy: [{ class: { board: { name: 'asc' } } }, { class: { number: 'asc' } }, { name: 'asc' }],
    });

    return NextResponse.json({ subjects });
  } catch (error: any) {
    console.error('Error fetching subjects:', error);
    
    // Check if it's a Prisma model error
    if (error.message?.includes("Cannot read properties of undefined") || 
        error.message?.includes("reading 'findMany'") ||
        error.message?.includes("subject is not defined")) {
      return NextResponse.json(
        { 
          error: 'Database model not available',
          message: 'The Subject model is not available in Prisma client.',
          details: 'Please restart your Next.js dev server.'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch subjects', message: error.message },
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
    const { classId, name, slug, description, icon, color } = body;

    if (!classId || !name || !slug) {
      return NextResponse.json(
        { error: 'Class ID, name, and slug are required' },
        { status: 400 }
      );
    }

    const subject = await prisma.subject.create({
      data: {
        classId,
        name,
        slug: slug.toLowerCase(),
        description: description || undefined,
        icon: icon || undefined,
        color: color || undefined,
      },
      include: { class: { include: { board: true } } },
    });

    return NextResponse.json({ subject });
  } catch (error: any) {
    console.error('Error creating subject:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Subject with this slug already exists for this class' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create subject' },
      { status: 500 }
    );
  }
}

