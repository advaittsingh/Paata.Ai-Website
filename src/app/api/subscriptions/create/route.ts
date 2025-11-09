import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { PrismaDatabase } from '@/lib/prisma-database';
import { getPlanPrice, calculateNextBillingDate } from '@/lib/subscription-utils';
import { Plan } from '@prisma/client';
import {
  createRazorpayCustomer,
  createRazorpayPlan,
  createRazorpaySubscription,
  getRazorpayPlanId,
  createPaymentLink,
} from '@/lib/razorpay-service';
import { sendSubscriptionConfirmationEmail } from '@/lib/email-service';

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

    const { plan, provider = 'razorpay', paymentMethodId, usePaymentLink = false } = await request.json();

    if (!plan || !['Basic', 'Pro', 'Enterprise'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    const user = authResult.user;

    // Check if plan is free (Basic)
    const planPricing = getPlanPrice(plan as Plan);
    const isFreePlan = planPricing.price === 0;

    // For free plans, create subscription without payment
    if (isFreePlan) {
      const now = new Date();
      const periodEnd = calculateNextBillingDate(now);

      const subscription = await PrismaDatabase.createSubscription({
        userId: user.id,
        plan: plan as Plan,
        status: 'Active',
        provider: 'manual',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
      });

      // Update user
      await PrismaDatabase.updateUser(user.id, {
        plan: plan as Plan,
        subscriptionStatus: 'Active',
        subscriptionId: subscription.id,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
      });

      // Send confirmation email (async, don't wait)
      sendSubscriptionConfirmationEmail(user.email, {
        plan: plan as Plan,
        amount: 0,
        currency: 'INR',
        nextBillingDate: periodEnd.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      }).catch(console.error);

      return NextResponse.json({
        success: true,
        subscription: {
          id: subscription.id,
          plan: subscription.plan,
          status: subscription.status,
          currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
        },
        message: 'Subscription created successfully',
      });
    }

    // For paid plans with Razorpay
    if (provider === 'razorpay') {
      try {
        // Check if Razorpay is configured
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
          return NextResponse.json(
            {
              error: 'Payment processing not configured',
              message: 'Razorpay credentials are not set up. Please contact support.',
            },
            { status: 503 }
          );
        }

        // Create or get Razorpay customer
        let customerId = user.customerId;
        if (!customerId) {
          customerId = await createRazorpayCustomer({
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            contact: user.phone || undefined,
          });

          // Update user with customer ID
          await PrismaDatabase.updateUser(user.id, {
            customerId: customerId,
          });
        }

        // Get or create Razorpay plan
        let razorpayPlanId = getRazorpayPlanId(plan as Plan, 'monthly');
        
        if (!razorpayPlanId) {
          // Create plan in Razorpay
          razorpayPlanId = await createRazorpayPlan({
            period: 'monthly',
            interval: 1,
            amount: planPricing.price * 100, // Convert to paise
            currency: planPricing.currency,
            item: {
              name: `${plan} Plan - Monthly`,
              description: `PAATA.AI ${plan} Plan subscription`,
            },
          });
        }

        // Use payment link if requested (for simpler flow)
        if (usePaymentLink) {
          const paymentLink = await createPaymentLink({
            amount: planPricing.price * 100, // Convert to paise
            currency: planPricing.currency,
            customer: {
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              contact: user.phone || undefined,
            },
            description: `PAATA.AI ${plan} Plan Subscription`,
            callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/profile/billing?payment=success`,
            notes: {
              userId: user.id,
              plan: plan,
              type: 'subscription',
            },
          });

          return NextResponse.json({
            success: true,
            paymentLink: paymentLink.short_url,
            paymentLinkId: paymentLink.id,
            message: 'Payment link created. Please complete the payment.',
          });
        }

        // Create subscription in Razorpay
        const razorpaySubscription = await createRazorpaySubscription({
          planId: razorpayPlanId,
          customerId: customerId,
          totalCount: 12, // 12 months
        });

        // Calculate billing dates
        const now = new Date();
        const periodEnd = calculateNextBillingDate(now);

        // Create subscription in database
        const subscription = await PrismaDatabase.createSubscription({
          userId: user.id,
          plan: plan as Plan,
          status: razorpaySubscription.status === 'active' ? 'Active' : 'Trialing',
          provider: 'razorpay',
          subscriptionId: razorpaySubscription.id,
          customerId: customerId,
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
        });

        // Update user
        await PrismaDatabase.updateUser(user.id, {
          plan: plan as Plan,
          subscriptionStatus: razorpaySubscription.status === 'active' ? 'Active' : 'Trialing',
          subscriptionId: subscription.id,
          customerId: customerId,
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
        });

        // Send confirmation email (async, don't wait)
        if (razorpaySubscription.status === 'active') {
          sendSubscriptionConfirmationEmail(user.email, {
            plan: plan as Plan,
            amount: planPricing.price,
            currency: planPricing.currency,
            nextBillingDate: periodEnd.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          }).catch(console.error);
        }

        return NextResponse.json({
          success: true,
          subscription: {
            id: subscription.id,
            plan: subscription.plan,
            status: subscription.status,
            currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
            razorpaySubscriptionId: razorpaySubscription.id,
          },
          message: 'Subscription created successfully',
        });
      } catch (error: any) {
        console.error('Razorpay subscription creation error:', error);
        return NextResponse.json(
          {
            error: 'Payment processing failed',
            message: error.message || 'Failed to create subscription. Please try again.',
          },
          { status: 500 }
        );
      }
    }

    // Fallback for manual/provider not supported
    return NextResponse.json(
      {
        error: 'Payment provider not supported',
        message: `Provider "${provider}" is not supported. Please use "razorpay".`,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Create subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

