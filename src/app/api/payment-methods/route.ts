import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { PrismaDatabase } from '@/lib/prisma-database';

/**
 * Get user payment methods
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const paymentMethods = await PrismaDatabase.getUserPaymentMethods(authResult.user.id);

    return NextResponse.json({
      paymentMethods: paymentMethods.map((pm) => ({
        id: pm.id,
        type: pm.type,
        last4: pm.last4,
        brand: pm.brand,
        expiryMonth: pm.expiryMonth,
        expiryYear: pm.expiryYear,
        isDefault: pm.isDefault,
        provider: pm.provider,
        createdAt: pm.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Create payment method (from Razorpay token)
 * Note: In production, payment methods should be created via Razorpay SDK on frontend
 * and then stored in database
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { methodId, provider, type, last4, brand, expiryMonth, expiryYear, isDefault } = await request.json();

    if (!methodId || !provider || !type) {
      return NextResponse.json(
        { error: 'Method ID, provider, and type are required' },
        { status: 400 }
      );
    }

    const paymentMethod = await PrismaDatabase.createPaymentMethod({
      userId: authResult.user.id,
      methodId,
      provider,
      type,
      last4,
      brand,
      expiryMonth,
      expiryYear,
      isDefault: isDefault || false,
    });

    return NextResponse.json({
      success: true,
      paymentMethod: {
        id: paymentMethod.id,
        type: paymentMethod.type,
        last4: paymentMethod.last4,
        brand: paymentMethod.brand,
        isDefault: paymentMethod.isDefault,
      },
    });
  } catch (error) {
    console.error('Create payment method error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Set default payment method
 */
export async function PUT(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { paymentMethodId } = await request.json();

    if (!paymentMethodId) {
      return NextResponse.json(
        { error: 'Payment method ID is required' },
        { status: 400 }
      );
    }

    await PrismaDatabase.setDefaultPaymentMethod(authResult.user.id, paymentMethodId);

    return NextResponse.json({
      success: true,
      message: 'Default payment method updated',
    });
  } catch (error) {
    console.error('Update payment method error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Delete payment method
 */
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const paymentMethodId = searchParams.get('id');

    if (!paymentMethodId) {
      return NextResponse.json(
        { error: 'Payment method ID is required' },
        { status: 400 }
      );
    }

    await PrismaDatabase.deletePaymentMethod(paymentMethodId);

    return NextResponse.json({
      success: true,
      message: 'Payment method deleted',
    });
  } catch (error) {
    console.error('Delete payment method error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

