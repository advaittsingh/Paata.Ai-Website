import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { PrismaDatabase } from '@/lib/prisma-database';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { subscriptionId, cancelAtPeriodEnd = true } = await request.json();

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    const user = authResult.user;

    // Verify subscription belongs to user
    const subscription = await PrismaDatabase.getActiveSubscription(user.id);
    if (!subscription || subscription.id !== subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Cancel subscription
    await PrismaDatabase.cancelSubscription(subscriptionId, cancelAtPeriodEnd);

    // Update user subscription status
    if (!cancelAtPeriodEnd) {
      await PrismaDatabase.updateUser(user.id, {
        subscriptionStatus: 'Cancelled',
        cancelAtPeriodEnd: false,
      });
    } else {
      await PrismaDatabase.updateUser(user.id, {
        cancelAtPeriodEnd: true,
      });
    }

    return NextResponse.json({
      success: true,
      message: cancelAtPeriodEnd
        ? 'Subscription will be cancelled at the end of the billing period'
        : 'Subscription cancelled immediately',
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

