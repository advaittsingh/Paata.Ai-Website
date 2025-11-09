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

    // Runtime check: Verify Board model exists before using it
    const boardModel = (prisma as any).board;
    if (!boardModel || typeof boardModel !== 'object' || typeof boardModel.findMany !== 'function') {
      console.error('[API] Board model not found in Prisma client');
      console.error('[API] Board model type:', typeof boardModel);
      console.error('[API] Available models:', Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')));
      return NextResponse.json(
        { 
          error: 'Database model not available',
          message: 'The Board model is not available in Prisma client.',
          details: 'The Prisma client instance does not have the Board model. This usually happens when the server was started before the Prisma client was regenerated. Please: 1) Stop the server (Ctrl+C), 2) Run: npx prisma generate, 3) Restart: npm run dev'
        },
        { status: 500 }
      );
    }

    try {
      const boards = await prisma.board.findMany({
        orderBy: { name: 'asc' },
      });

      return NextResponse.json({ boards });
    } catch (dbError: any) {
      console.error('Database error fetching boards:', dbError);
      
      // Check if it's a "cannot read property" error (model not in Prisma client)
      if (dbError.message?.includes("Cannot read properties of undefined") || 
          dbError.message?.includes("reading 'findMany'") ||
          dbError.message?.includes("board is not defined") ||
          dbError.message?.includes("Cannot read property 'board'")) {
        return NextResponse.json(
          { 
            error: 'Database model not available',
            message: 'The Board model is not available in Prisma client.',
            details: 'Please RESTART your Next.js dev server. The Prisma client was initialized before the Board model was added. Run: 1) Stop server (Ctrl+C), 2) npx prisma generate, 3) npm run dev'
          },
          { status: 500 }
        );
      }
      
      // Check if it's a Prisma schema issue
      if (dbError.code === 'P2021' || dbError.message?.includes('does not exist')) {
        return NextResponse.json(
          { 
            error: 'Database table not found. Please run database migrations.',
            details: dbError.message 
          },
          { status: 500 }
        );
      }
      throw dbError; // Re-throw to be caught by outer catch
    }
  } catch (error: any) {
    console.error('Error fetching boards:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch boards',
        message: error.message || 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
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
    const { name, code } = body;

    if (!name || !code) {
      return NextResponse.json(
        { error: 'Name and code are required' },
        { status: 400 }
      );
    }

    const board = await prisma.board.create({
      data: {
        name,
        code: code.toLowerCase(),
      },
    });

    return NextResponse.json({ board });
  } catch (error: any) {
    console.error('Error creating board:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Board with this name or code already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create board' },
      { status: 500 }
    );
  }
}

