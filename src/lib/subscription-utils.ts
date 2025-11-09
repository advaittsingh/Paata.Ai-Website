import { Plan } from '@prisma/client';

export interface PlanPricing {
  price: number;
  currency: string;
  period: 'month' | 'year';
}

export const PLAN_PRICING: Record<Plan, PlanPricing> = {
  Basic: {
    price: 0,
    currency: 'INR',
    period: 'month',
  },
  Pro: {
    price: 99,
    currency: 'INR',
    period: 'month',
  },
  Enterprise: {
    price: 299,
    currency: 'INR',
    period: 'month',
  },
};

/**
 * Get plan price
 */
export function getPlanPrice(plan: Plan): PlanPricing {
  return PLAN_PRICING[plan] || PLAN_PRICING.Basic;
}

/**
 * Calculate next billing date
 */
export function calculateNextBillingDate(currentPeriodEnd: Date): Date {
  const next = new Date(currentPeriodEnd);
  next.setMonth(next.getMonth() + 1);
  return next;
}

/**
 * Check if subscription is active
 */
export function isSubscriptionActive(status: string): boolean {
  return status === 'Active' || status === 'Trialing';
}

/**
 * Check if subscription is expired
 */
export function isSubscriptionExpired(status: string, periodEnd: Date | null): boolean {
  if (status === 'Expired' || status === 'Cancelled') {
    return true;
  }
  if (periodEnd && new Date() > periodEnd) {
    return true;
  }
  return false;
}

/**
 * Get subscription status display text
 */
export function getSubscriptionStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    Inactive: 'Inactive',
    Active: 'Active',
    Trialing: 'Trial',
    PastDue: 'Past Due',
    Cancelled: 'Cancelled',
    Expired: 'Expired',
  };
  return statusMap[status] || status;
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency: string = 'INR'): string {
  if (currency === 'INR') {
    return `₹${amount.toFixed(0)}`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

