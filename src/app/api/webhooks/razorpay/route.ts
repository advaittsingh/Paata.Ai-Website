import { NextRequest, NextResponse } from 'next/server';
import { PrismaDatabase } from '@/lib/prisma-database';
import { prisma } from '@/lib/prisma-database';
import { verifyRazorpayWebhookSignature } from '@/lib/razorpay-service';
import { calculateNextBillingDate } from '@/lib/subscription-utils';
import { sendInvoiceEmail, sendCancellationEmail } from '@/lib/email-service';

/**
 * Razorpay webhook handler
 * Handles Razorpay events for subscription management
 */
export async function POST(request: NextRequest) {
  try {
    // Get webhook signature
    const signature = request.headers.get('x-razorpay-signature');
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    // Get webhook secret
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('RAZORPAY_WEBHOOK_SECRET not configured');
      // In development, allow without verification
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { error: 'Webhook secret not configured' },
          { status: 500 }
        );
      }
    }

    // Get raw body for signature verification
    const body = await request.text();
    
    // Verify signature (skip in development if secret not set)
    if (webhookSecret) {
      const isValid = verifyRazorpayWebhookSignature(body, signature, webhookSecret);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    const event = JSON.parse(body);

    // Handle different event types
    switch (event.event) {
      case 'subscription.created':
      case 'subscription.updated':
      case 'subscription.activated':
        await handleSubscriptionUpdate(event.payload.subscription.entity);
        break;

      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event.payload.subscription.entity);
        break;

      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity);
        break;

      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity);
        break;

      case 'invoice.paid':
        await handleInvoicePaid(event.payload.invoice.entity);
        break;

      default:
        console.log(`Unhandled event type: ${event.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle subscription update events
 */
async function handleSubscriptionUpdate(subscription: any) {
  try {
    // Find subscription by Razorpay subscription ID
    const dbSubscription = await prisma.subscription.findFirst({
      where: { subscriptionId: subscription.id },
    });

    if (!dbSubscription) {
      console.error('Subscription not found:', subscription.id);
      return;
    }

    // Update subscription status
    const status = mapRazorpayStatus(subscription.status);
    const currentPeriodStart = new Date(subscription.current_start * 1000);
    const currentPeriodEnd = new Date(subscription.current_end * 1000);

    await PrismaDatabase.updateSubscription(dbSubscription.id, {
      status: status,
      currentPeriodStart: currentPeriodStart,
      currentPeriodEnd: currentPeriodEnd,
      cancelAtPeriodEnd: subscription.end_at ? true : false,
    });

    // Update user subscription status
    const user = await PrismaDatabase.getUserById(dbSubscription.userId);
    if (user) {
      await PrismaDatabase.updateUser(user.id, {
        subscriptionStatus: status,
        currentPeriodStart: currentPeriodStart,
        currentPeriodEnd: currentPeriodEnd,
        cancelAtPeriodEnd: subscription.end_at ? true : false,
      });
    }
  } catch (error) {
    console.error('Handle subscription update error:', error);
  }
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCancelled(subscription: any) {
  try {
    const dbSubscription = await prisma.subscription.findFirst({
      where: { subscriptionId: subscription.id },
    });

    if (!dbSubscription) {
      console.error('Subscription not found:', subscription.id);
      return;
    }

    await PrismaDatabase.updateSubscription(dbSubscription.id, {
      status: 'Cancelled',
      cancelledAt: new Date(),
      cancelAtPeriodEnd: false,
    });

    const user = await PrismaDatabase.getUserById(dbSubscription.userId);
    if (user) {
      await PrismaDatabase.updateUser(user.id, {
        subscriptionStatus: 'Cancelled',
        cancelAtPeriodEnd: false,
      });

      // Send cancellation email
      sendCancellationEmail(user.email, {
        plan: dbSubscription.plan,
        cancelAtPeriodEnd: false,
      }).catch(console.error);
    }
  } catch (error) {
    console.error('Handle subscription cancelled error:', error);
  }
}

/**
 * Handle payment captured
 */
async function handlePaymentCaptured(payment: any) {
  try {
    // Find subscription by payment metadata or order ID
    if (payment.notes?.subscription_id) {
      const dbSubscription = await prisma.subscription.findFirst({
        where: { subscriptionId: payment.notes.subscription_id },
      });

      if (dbSubscription) {
        // Create invoice record
        const invoice = await PrismaDatabase.createInvoice({
          subscriptionId: dbSubscription.id,
          invoiceId: payment.id,
          amount: payment.amount / 100, // Convert from paise to rupees
          currency: payment.currency.toUpperCase(),
          status: 'paid',
          dueDate: new Date(),
          paidAt: new Date(payment.created_at * 1000),
        });

        // Send invoice email
        const user = await PrismaDatabase.getUserById(dbSubscription.userId);
        if (user) {
          sendInvoiceEmail(user.email, {
            invoiceId: payment.id,
            amount: payment.amount / 100,
            currency: payment.currency.toUpperCase(),
            plan: dbSubscription.plan,
            paidAt: new Date(payment.created_at * 1000).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            pdfUrl: undefined, // Razorpay invoice PDF URL if available
          }).catch(console.error);
        }
      }
    }
  } catch (error) {
    console.error('Handle payment captured error:', error);
  }
}

/**
 * Handle payment failed
 */
async function handlePaymentFailed(payment: any) {
  try {
    if (payment.notes?.subscription_id) {
      const dbSubscription = await prisma.subscription.findFirst({
        where: { subscriptionId: payment.notes.subscription_id },
      });

      if (dbSubscription) {
        // Update subscription status to PastDue
        await PrismaDatabase.updateSubscription(dbSubscription.id, {
          status: 'PastDue',
        });

        const user = await PrismaDatabase.getUserById(dbSubscription.userId);
        if (user) {
          await PrismaDatabase.updateUser(user.id, {
            subscriptionStatus: 'PastDue',
          });
        }
      }
    }
  } catch (error) {
    console.error('Handle payment failed error:', error);
  }
}

/**
 * Handle invoice paid
 */
async function handleInvoicePaid(invoice: any) {
  try {
    // Handle invoice payment
    // Similar to payment captured but for invoice events
    console.log('Invoice paid:', invoice);
  } catch (error) {
    console.error('Handle invoice paid error:', error);
  }
}

/**
 * Map Razorpay status to our SubscriptionStatus enum
 */
function mapRazorpayStatus(status: string): string {
  const statusMap: Record<string, string> = {
    created: 'Trialing',
    authenticated: 'Trialing',
    active: 'Active',
    pending: 'Trialing',
    halted: 'PastDue',
    cancelled: 'Cancelled',
    completed: 'Expired',
    expired: 'Expired',
  };

  return statusMap[status] || 'Inactive';
}

