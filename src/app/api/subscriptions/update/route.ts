import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { PrismaDatabase } from '@/lib/prisma-database';
import { calculateNextBillingDate } from '@/lib/subscription-utils';

export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { subscriptionId, plan } = await request.json();

    if (!subscriptionId || !plan) {
      return NextResponse.json(
        { error: 'Subscription ID and plan are required' },
        { status: 400 }
      );
    }

    if (!['Basic', 'Pro', 'Enterprise'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan' },
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

    // Update subscription plan
    // In production, this would handle proration with payment provider
    const updatedSubscription = await PrismaDatabase.updateSubscription(subscriptionId, {
      plan: plan,
    });

    // Update user plan
    await PrismaDatabase.updateUser(user.id, {
      plan: plan,
    });

    return NextResponse.json({
      success: true,
      subscription: {
        id: updatedSubscription.id,
        plan: updatedSubscription.plan,
        status: updatedSubscription.status,
      },
      message: 'Subscription updated successfully',
    });
  } catch (error) {
    console.error('Update subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

