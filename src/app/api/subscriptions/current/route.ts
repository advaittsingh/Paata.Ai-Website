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

    // Get active subscription
    const subscription = await PrismaDatabase.getActiveSubscription(user.id);

    // Get default payment method
    const paymentMethods = await PrismaDatabase.getUserPaymentMethods(user.id);
    const defaultPaymentMethod = paymentMethods.find((pm) => pm.isDefault) || paymentMethods[0] || null;

    // Return subscription info
    return NextResponse.json({
      subscription: subscription
        ? {
            id: subscription.id,
            plan: subscription.plan,
            status: subscription.status,
            provider: subscription.provider,
            currentPeriodStart: subscription.currentPeriodStart.toISOString(),
            currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
            cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
            cancelledAt: subscription.cancelledAt?.toISOString() || null,
          }
        : null,
      paymentMethod: defaultPaymentMethod
        ? {
            id: defaultPaymentMethod.id,
            type: defaultPaymentMethod.type,
            last4: defaultPaymentMethod.last4,
            brand: defaultPaymentMethod.brand,
            expiryMonth: defaultPaymentMethod.expiryMonth,
            expiryYear: defaultPaymentMethod.expiryYear,
          }
        : null,
      userPlan: user.plan,
      subscriptionStatus: user.subscriptionStatus || 'Inactive',
    });
  } catch (error) {
    console.error('Get current subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

