import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { PrismaDatabase } from '@/lib/prisma-database';
import PDFDocument from 'pdfkit';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const invoiceId = params.id;

    // Get invoice
    const invoices = await PrismaDatabase.getUserInvoices(user.id);
    const invoice = invoices.find((inv) => inv.id === invoiceId);

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Get subscription details
    const subscription = invoice.subscriptionId
      ? await PrismaDatabase.getSubscription(invoice.subscriptionId)
      : null;

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => {});

    // PDF Content
    doc.fontSize(24).text('PAATA.AI', { align: 'center' });
    doc.moveDown();
    doc.fontSize(18).text('Invoice', { align: 'center' });
    doc.moveDown(2);

    // Invoice details
    doc.fontSize(12);
    doc.text(`Invoice ID: ${invoice.invoiceId}`, { align: 'left' });
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, { align: 'left' });
    doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, { align: 'left' });
    doc.moveDown();

    // Customer info
    doc.text('Bill To:', { continued: false });
    doc.moveDown(0.5);
    doc.text(`${user.firstName} ${user.lastName}`);
    doc.text(user.email);
    doc.moveDown(2);

    // Invoice items
    doc.fontSize(14).text('Invoice Details', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);

    const planName = subscription?.plan || 'Subscription';
    const amount = invoice.amount;
    const currency = invoice.currency;

    doc.text(`Plan: ${planName}`, { indent: 20 });
    doc.text(`Amount: ${currency} ${amount.toFixed(2)}`, { indent: 20 });
    doc.text(`Status: ${invoice.status}`, { indent: 20 });

    if (invoice.paidAt) {
      doc.text(`Paid At: ${new Date(invoice.paidAt).toLocaleString()}`, { indent: 20 });
    }

    doc.moveDown(2);

    // Total
    doc.fontSize(14);
    doc.text(`Total: ${currency} ${amount.toFixed(2)}`, { align: 'right' });

    doc.moveDown(3);

    // Footer
    doc.fontSize(10);
    doc.text('Thank you for using PAATA.AI!', { align: 'center' });
    doc.text('For support, contact: support@paataai.com', { align: 'center' });

    doc.end();

    // Wait for PDF to be generated
    await new Promise<void>((resolve) => {
      doc.on('end', resolve);
    });

    const pdfBuffer = Buffer.concat(chunks);

    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoice.invoiceId}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Invoice PDF download error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

