import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance
let razorpayInstance: Razorpay | null = null;

function getRazorpayInstance(): Razorpay {
  if (!razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error('Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET');
    }

    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  return razorpayInstance;
}

/**
 * Create a Razorpay customer
 */
export async function createRazorpayCustomer(data: {
  name: string;
  email: string;
  contact?: string;
}): Promise<string> {
  try {
    const razorpay = getRazorpayInstance();
    
    const customer = await razorpay.customers.create({
      name: data.name,
      email: data.email,
      contact: data.contact || undefined,
    });

    return customer.id;
  } catch (error) {
    console.error('Razorpay create customer error:', error);
    throw error;
  }
}

/**
 * Create a Razorpay subscription
 */
export async function createRazorpaySubscription(data: {
  planId: string;
  customerId: string;
  totalCount?: number; // For fixed count subscriptions
  startAt?: number; // Unix timestamp
}): Promise<any> {
  try {
    const razorpay = getRazorpayInstance();

    const subscription = await razorpay.subscriptions.create({
      plan_id: data.planId,
      customer_notify: 1,
      total_count: data.totalCount || 12, // Default to 12 months
      start_at: data.startAt || Math.floor(Date.now() / 1000) + 60, // Start 60 seconds from now
    });

    return subscription;
  } catch (error) {
    console.error('Razorpay create subscription error:', error);
    throw error;
  }
}

/**
 * Create a Razorpay plan (if not exists)
 */
export async function createRazorpayPlan(data: {
  period: 'monthly' | 'yearly';
  interval: number;
  amount: number; // in paise (₹99 = 9900 paise)
  currency: string;
  item: {
    name: string;
    description: string;
  };
}): Promise<string> {
  try {
    const razorpay = getRazorpayInstance();

    // Check if plan already exists
    const plans = await razorpay.plans.all({
      count: 100,
    });

    const existingPlan = plans.items.find(
      (plan: any) =>
        plan.period === data.period &&
        plan.interval === data.interval &&
        plan.item.amount === data.amount
    );

    if (existingPlan) {
      return existingPlan.id;
    }

    // Create new plan
    const plan = await razorpay.plans.create({
      period: data.period,
      interval: data.interval,
      item: {
        name: data.item.name,
        description: data.item.description,
        amount: data.amount,
        currency: data.currency,
      },
    });

    return plan.id;
  } catch (error) {
    console.error('Razorpay create plan error:', error);
    throw error;
  }
}

/**
 * Get Razorpay subscription details
 */
export async function getRazorpaySubscription(subscriptionId: string): Promise<any> {
  try {
    const razorpay = getRazorpayInstance();
    return await razorpay.subscriptions.fetch(subscriptionId);
  } catch (error) {
    console.error('Razorpay get subscription error:', error);
    throw error;
  }
}

/**
 * Cancel Razorpay subscription
 */
export async function cancelRazorpaySubscription(
  subscriptionId: string,
  cancelAtCycleEnd: boolean = true
): Promise<any> {
  try {
    const razorpay = getRazorpayInstance();
    
    if (cancelAtCycleEnd) {
      return await razorpay.subscriptions.cancel(subscriptionId, {
        cancel_at_cycle_end: 1,
      });
    } else {
      return await razorpay.subscriptions.cancel(subscriptionId);
    }
  } catch (error) {
    console.error('Razorpay cancel subscription error:', error);
    throw error;
  }
}

/**
 * Verify Razorpay webhook signature
 */
export function verifyRazorpayWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('Razorpay webhook verification error:', error);
    return false;
  }
}

/**
 * Create Razorpay payment link for one-time payment
 */
export async function createPaymentLink(data: {
  amount: number; // in paise
  currency: string;
  customer: {
    name: string;
    email: string;
    contact?: string;
  };
  description: string;
  callbackUrl: string;
  notes?: Record<string, string>;
}): Promise<any> {
  try {
    const razorpay = getRazorpayInstance();

    const paymentLink = await razorpay.paymentLink.create({
      amount: data.amount,
      currency: data.currency,
      description: data.description,
      customer: {
        name: data.customer.name,
        email: data.customer.email,
        contact: data.customer.contact || undefined,
      },
      notify: {
        email: true,
        sms: false,
      },
      reminder_enable: true,
      callback_url: data.callbackUrl,
      callback_method: 'get',
      notes: data.notes || {},
    });

    return paymentLink;
  } catch (error) {
    console.error('Razorpay create payment link error:', error);
    throw error;
  }
}

/**
 * Get predefined plan IDs (to be configured in environment)
 */
export function getRazorpayPlanId(plan: 'Basic' | 'Pro' | 'Enterprise', period: 'monthly' | 'yearly' = 'monthly'): string | null {
  // These should be configured in environment variables
  // For now, return null to trigger plan creation
  const planMap: Record<string, string | undefined> = {
    'Pro_monthly': process.env.RAZORPAY_PLAN_PRO_MONTHLY,
    'Pro_yearly': process.env.RAZORPAY_PLAN_PRO_YEARLY,
    'Enterprise_monthly': process.env.RAZORPAY_PLAN_ENTERPRISE_MONTHLY,
    'Enterprise_yearly': process.env.RAZORPAY_PLAN_ENTERPRISE_YEARLY,
  };

  if (plan === 'Basic') {
    return null; // Basic is free
  }

  return planMap[`${plan}_${period}`] || null;
}

