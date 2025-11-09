import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { PrismaDatabase } from '@/lib/prisma-database';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = authResult.user;

    // Get all invoices for user
    const invoices = await PrismaDatabase.getUserInvoices(user.id);

    return NextResponse.json({
      invoices: invoices.map((invoice) => ({
        id: invoice.id,
        invoiceId: invoice.invoiceId,
        amount: invoice.amount,
        currency: invoice.currency,
        status: invoice.status,
        paidAt: invoice.paidAt?.toISOString() || null,
        dueDate: invoice.dueDate.toISOString(),
        pdfUrl: invoice.pdfUrl || null,
        createdAt: invoice.createdAt.toISOString(),
        plan: (invoice.subscription as any)?.plan || null,
      })),
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

