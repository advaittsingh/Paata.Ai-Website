import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-utils';
import { PrismaDatabase } from '@/lib/prisma-database';
import { prisma } from '@/lib/prisma-database';

/**
 * GET /api/admin/billing
 * Get comprehensive billing and revenue analytics
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const adminResult = await verifyAdmin(request);
    if (!adminResult.isAdmin) {
      return NextResponse.json(
        { error: adminResult.error || 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get all users
    const allUsers = await PrismaDatabase.getAllUsers();

    // Plan pricing (in INR)
    const planPricing = {
      Basic: 0,
      Pro: 499,
      Enterprise: 999,
    };

    // Subscription statistics
    const subscriptions = await prisma.subscription.findMany({
      where: {
        status: 'Active',
      },
    });

    const activeSubscriptions = subscriptions.length;
    
    // Calculate revenue
    let monthlyRecurringRevenue = 0;
    let totalRevenue = 0;

    subscriptions.forEach(sub => {
      const price = planPricing[sub.plan as keyof typeof planPricing] || 0;
      monthlyRecurringRevenue += price;
    });

    // Get all invoices
    const invoices = await prisma.invoice.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate revenue from invoices
    invoices.forEach(invoice => {
      if (invoice.status === 'paid') {
        totalRevenue += parseFloat(invoice.amount || '0');
      }
    });

    // Plan distribution for subscriptions
    const subscriptionPlanDistribution = {
      Basic: subscriptions.filter(s => s.plan === 'Basic').length,
      Pro: subscriptions.filter(s => s.plan === 'Pro').length,
      Enterprise: subscriptions.filter(s => s.plan === 'Enterprise').length,
    };

    // Revenue by plan
    const revenueByPlan = {
      Basic: 0,
      Pro: subscriptionPlanDistribution.Pro * planPricing.Pro,
      Enterprise: subscriptionPlanDistribution.Enterprise * planPricing.Enterprise,
    };

    // Subscription status breakdown
    const allSubscriptions = await prisma.subscription.findMany();
    const subscriptionStatus = {
      Active: allSubscriptions.filter(s => s.status === 'Active').length,
      Inactive: allSubscriptions.filter(s => s.status === 'Inactive').length,
      Trialing: allSubscriptions.filter(s => s.status === 'Trialing').length,
      PastDue: allSubscriptions.filter(s => s.status === 'PastDue').length,
      Cancelled: allSubscriptions.filter(s => s.status === 'Cancelled').length,
      Expired: allSubscriptions.filter(s => s.status === 'Expired').length,
    };

    // Payment methods
    const paymentMethods = await prisma.paymentMethod.findMany();
    const paymentMethodDistribution = {
      card: paymentMethods.filter(pm => pm.type === 'card').length,
      upi: paymentMethods.filter(pm => pm.type === 'upi').length,
      netbanking: paymentMethods.filter(pm => pm.type === 'netbanking').length,
      wallet: paymentMethods.filter(pm => pm.type === 'wallet').length,
    };

    // Revenue trends (last 30 days)
    const revenueTrends = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateKey = date.toISOString().split('T')[0];
      
      const dayInvoices = invoices.filter(inv => {
        const invDate = new Date(inv.createdAt);
        return invDate.toISOString().split('T')[0] === dateKey;
      });

      const dayRevenue = dayInvoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + parseFloat(inv.amount || '0'), 0);

      revenueTrends.push({
        date: dateKey,
        revenue: dayRevenue,
        transactions: dayInvoices.length,
      });
    }

    // Recent transactions
    const recentTransactions = invoices.slice(0, 10).map(inv => ({
      id: inv.id,
      userId: inv.userId,
      amount: inv.amount,
      status: inv.status,
      plan: inv.plan,
      createdAt: inv.createdAt.toISOString(),
    }));

    // Churn rate (cancelled subscriptions in period)
    const cancelledInPeriod = allSubscriptions.filter(sub => {
      if (sub.status !== 'Cancelled') return false;
      const cancelledAt = sub.updatedAt;
      return cancelledAt >= startDate;
    }).length;

    const churnRate = activeSubscriptions > 0 
      ? Math.round((cancelledInPeriod / activeSubscriptions) * 100 * 100) / 100
      : 0;

    // Average revenue per user (ARPU)
    const arpu = activeSubscriptions > 0 
      ? Math.round((monthlyRecurringRevenue / activeSubscriptions) * 100) / 100
      : 0;

    return NextResponse.json({
      success: true,
      billing: {
        overview: {
          monthlyRecurringRevenue,
          totalRevenue,
          activeSubscriptions,
          arpu,
          churnRate,
        },
        subscriptionPlanDistribution,
        subscriptionStatus,
        revenueByPlan,
        paymentMethodDistribution,
        revenueTrends,
        recentTransactions,
        period,
      },
    });

  } catch (error: any) {
    console.error('Admin billing error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch billing data',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}


