"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components';
import { useUser } from '@/contexts/UserContext';
import { TableSkeleton } from '@/components/loading-skeleton';

interface Subscription {
  id: string;
  plan: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

interface PaymentMethod {
  id: string;
  type: string;
  last4: string | null;
  brand: string | null;
  expiryMonth: number | null;
  expiryYear: number | null;
  isDefault: boolean;
}

interface Invoice {
  id: string;
  invoiceId: string;
  amount: number;
  currency: string;
  status: string;
  paidAt: string | null;
  dueDate: string;
  pdfUrl: string | null;
  plan: string | null;
}

export default function BillingPage() {
  const { user: contextUser, updateUser } = useUser();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);

  const user = {
    name: `${contextUser?.firstName || ''} ${contextUser?.lastName || ''}`.trim() || 'User',
    email: contextUser?.email || 'user@example.com',
    avatar: contextUser?.avatar || '/image/avatar1.jpg',
    plan: contextUser?.plan || 'Basic',
  };

  // Fetch subscription data on mount
  useEffect(() => {
    fetchSubscriptionData();
    fetchInvoices();
  }, []);

  // Check for payment success in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      alert('Payment successful! Your subscription has been activated.');
      fetchSubscriptionData();
      // Remove query param
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/subscriptions/current', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscription);
        setPaymentMethod(data.paymentMethod);
        
        // Update user context if subscription data is different
        if (data.userPlan && data.userPlan !== contextUser?.plan) {
          await updateUser({ plan: data.userPlan });
        }
      } else {
        console.error('Failed to fetch subscription data');
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/subscriptions/invoices', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setInvoices(data.invoices || []);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  // Get current plan details
  const getCurrentPlanDetails = () => {
    const plan = subscription?.plan || contextUser?.plan || 'Basic';
    
    switch (plan) {
      case 'Enterprise':
        return {
          name: 'Enterprise',
          price: '₹299',
          period: 'per month',
          features: [
            'Everything in Pro',
            'Team management',
            'Analytics dashboard',
            'API access',
            'Custom integrations',
            'Dedicated support'
          ],
        };
      case 'Pro':
        return {
          name: 'Pro',
          price: '₹99',
          period: 'per month',
          features: [
            'Unlimited AI conversations',
            'Advanced image analysis',
            'Voice input & transcription',
            'Priority support',
            'Export conversations',
            'Custom learning paths'
          ],
        };
      default: // Basic
        return {
          name: 'Basic',
          price: 'Free',
          period: 'forever',
          features: [
            '100 AI conversations/month',
            'Basic image analysis',
            'Text input only',
            'Email support',
            'Standard response time'
          ],
        };
    }
  };

  const currentPlan = getCurrentPlanDetails();

  // Format next billing date
  const getNextBillingDate = () => {
    if (subscription?.currentPeriodEnd) {
      return new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    return 'N/A';
  };

  // Get subscription status
  const getSubscriptionStatus = () => {
    if (!subscription) return 'Inactive';
    return subscription.status;
  };

  // Get all available plans
  const availablePlans = [
    {
      name: 'Basic',
      price: 'Free',
      period: 'forever',
      description: 'Perfect for students getting started',
      features: [
        '100 AI conversations/month',
        'Basic image analysis',
        'Text input only',
        'Email support',
        'Standard response time'
      ],
      isCurrent: (subscription?.plan || contextUser?.plan || 'Basic') === 'Basic',
      isPopular: false
    },
    {
      name: 'Pro',
      price: '₹99',
      period: 'per month',
      description: 'Most popular for serious learners',
      features: [
        'Unlimited AI conversations',
        'Advanced image analysis',
        'Voice input & transcription',
        'Priority support',
        'Export conversations',
        'Custom learning paths'
      ],
      isCurrent: (subscription?.plan || contextUser?.plan || 'Basic') === 'Pro',
      isPopular: true
    },
    {
      name: 'Enterprise',
      price: '₹299',
      period: 'per month',
      description: 'For institutions and organizations',
      features: [
        'Everything in Pro',
        'Team management',
        'Analytics dashboard',
        'API access',
        'Custom integrations',
        'Dedicated support'
      ],
      isCurrent: (subscription?.plan || contextUser?.plan || 'Basic') === 'Enterprise',
      isPopular: false
    }
  ];

  const handlePlanChange = async (newPlan: string) => {
    if (newPlan === (subscription?.plan || contextUser?.plan || 'Basic')) return;
    
    setIsProcessing(true);
    setError(null);
    setPaymentLink(null);

    try {
      // For free plan (Basic), create directly
      if (newPlan === 'Basic') {
        const response = await fetch('/api/subscriptions/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            plan: newPlan,
            provider: 'manual',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          alert(`Plan changed to ${newPlan} successfully!`);
          await fetchSubscriptionData();
          await updateUser({ plan: newPlan });
        } else {
          const error = await response.json();
          setError(error.message || 'Failed to change plan');
        }
        setIsProcessing(false);
        return;
      }

      // For paid plans, use payment link
      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          plan: newPlan,
          provider: 'razorpay',
          usePaymentLink: true,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.paymentLink) {
          // Open payment link in new window
          setPaymentLink(data.paymentLink);
          window.open(data.paymentLink, '_blank');
          alert(`Payment link opened. Please complete the payment to activate your ${newPlan} plan.`);
        } else {
          // Subscription created without payment (for testing)
          alert(`Plan changed to ${newPlan} successfully!`);
          await fetchSubscriptionData();
          await updateUser({ plan: newPlan });
        }
      } else {
        const error = await response.json();
        setError(error.message || 'Failed to create subscription');
        alert(error.message || 'Failed to create subscription. Please try again.');
      }
    } catch (error: any) {
      console.error('Plan change error:', error);
      setError(error.message || 'An error occurred');
      alert('Failed to change plan. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    const confirmCancel = window.confirm(
      'Are you sure you want to cancel your subscription? You will continue to have access until the end of your billing period.'
    );

    if (!confirmCancel) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          subscriptionId: subscription.id,
          cancelAtPeriodEnd: true,
        }),
      });

      if (response.ok) {
        alert('Subscription will be cancelled at the end of your billing period.');
        await fetchSubscriptionData();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Cancel subscription error:', error);
      alert('Failed to cancel subscription. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdatePaymentMethod = async (paymentMethodId: string) => {
    if (!paymentMethodId) return;

    const confirmUpdate = window.confirm(
      'Set this payment method as your default payment method?'
    );

    if (!confirmUpdate) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/payment-methods', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          paymentMethodId,
        }),
      });

      if (response.ok) {
        alert('Payment method updated successfully.');
        await fetchSubscriptionData();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update payment method');
      }
    } catch (error) {
      console.error('Update payment method error:', error);
      alert('Failed to update payment method. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemovePaymentMethod = async (paymentMethodId: string) => {
    if (!paymentMethodId) return;

    const confirmRemove = window.confirm(
      'Are you sure you want to remove this payment method? This action cannot be undone.'
    );

    if (!confirmRemove) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/payment-methods?id=${paymentMethodId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        alert('Payment method removed successfully.');
        await fetchSubscriptionData();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to remove payment method');
      }
    } catch (error) {
      console.error('Remove payment method error:', error);
      alert('Failed to remove payment method. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    if (currency === 'INR') {
      return `₹${amount.toFixed(0)}`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 relative">
        <Navbar />
        <div className="mt-20 min-h-[calc(100vh-80px)]">
          <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
              <TableSkeleton rows={3} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar />
      
      <div className="mt-20 min-h-[calc(100vh-80px)]">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing</h1>
              <p className="text-gray-600">Manage your subscription and payment methods</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Payment Link Message */}
            {paymentLink && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <p className="text-blue-700">
                  Payment link opened. If it didn't open,{' '}
                  <a href={paymentLink} target="_blank" rel="noopener noreferrer" className="underline">
                    click here to complete payment
                  </a>
                </p>
              </div>
            )}

            {/* Current Plan Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Current Plan</h2>
                  <p className="text-gray-600">Your active subscription details</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    getSubscriptionStatus() === 'Active' || getSubscriptionStatus() === 'Trialing'
                      ? 'bg-green-100 text-green-800'
                      : getSubscriptionStatus() === 'PastDue'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {getSubscriptionStatus()}
                  </span>
                  {getNextBillingDate() !== 'N/A' && (
                    <span className="text-sm text-gray-600">
                      Next billing: {getNextBillingDate()}
                    </span>
                  )}
                  {subscription?.cancelAtPeriodEnd && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">
                      Cancelling
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{currentPlan.name} Plan</h3>
                  <p className="text-gray-600">
                    {currentPlan.price} {currentPlan.period}
                  </p>
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Features included:</h4>
                    <ul className="space-y-1">
                      {currentPlan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {subscription && subscription.status === 'Active' && !subscription.cancelAtPeriodEnd && (
                    <button
                      onClick={handleCancelSubscription}
                      disabled={isProcessing}
                      className="mt-4 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      Cancel Subscription
                    </button>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{currentPlan.price}</div>
                  <div className="text-gray-600">{currentPlan.period}</div>
                </div>
              </div>
            </div>

            {/* Available Plans Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Plans</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {availablePlans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`relative rounded-lg border-2 p-6 ${
                      plan.isCurrent
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {plan.isPopular && !plan.isCurrent && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
                      <div className="text-3xl font-bold text-gray-900">{plan.price}</div>
                      <div className="text-gray-600">{plan.period}</div>
                    </div>

                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handlePlanChange(plan.name)}
                      disabled={plan.isCurrent || isProcessing}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                        plan.isCurrent
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : plan.name === 'Pro' || plan.name === 'Enterprise'
                          ? 'bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50'
                          : 'bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50'
                      }`}
                    >
                      {isProcessing
                        ? 'Processing...'
                        : plan.isCurrent
                        ? 'CURRENT PLAN'
                        : plan.name === 'Basic'
                        ? 'DOWNGRADE'
                        : 'UPGRADE PLAN'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
              {paymentMethod ? (
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{paymentMethod.brand?.toUpperCase() || 'CARD'}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {paymentMethod.type === 'card' ? 'Card' : paymentMethod.type} 
                        {paymentMethod.last4 ? ` .... ${paymentMethod.last4}` : ''}
                      </p>
                      {paymentMethod.expiryMonth && paymentMethod.expiryYear && (
                        <p className="text-sm text-gray-600">
                          Expires {String(paymentMethod.expiryMonth).padStart(2, '0')}/{String(paymentMethod.expiryYear).slice(-2)}
                        </p>
                      )}
                    </div>
                    {paymentMethod.isDefault && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleUpdatePaymentMethod(paymentMethod.id)}
                      disabled={isProcessing || paymentMethod.isDefault}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {paymentMethod.isDefault ? 'Default' : 'Set Default'}
                    </button>
                    <button 
                      onClick={() => handleRemovePaymentMethod(paymentMethod.id)}
                      disabled={isProcessing || paymentMethod.isDefault}
                      className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 border border-gray-200 rounded-lg text-center text-gray-600">
                  <p>No payment method on file</p>
                  <p className="text-sm mt-2">Add a payment method when upgrading to a paid plan</p>
                </div>
              )}
            </div>

            {/* Billing History Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Billing History</h2>
                {invoices.length > 0 && (
                  <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                    Download All
                  </button>
                )}
              </div>
              
              {invoices.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Invoice</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Plan</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-sm text-gray-900">{invoice.invoiceId}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {invoice.paidAt
                              ? new Date(invoice.paidAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })
                              : new Date(invoice.dueDate).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">
                            {formatCurrency(invoice.amount, invoice.currency)}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              invoice.status === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : invoice.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {invoice.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{invoice.plan || 'N/A'}</td>
                          <td className="py-3 px-4">
                            {invoice.pdfUrl && (
                              <a
                                href={invoice.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-900 hover:text-gray-800 text-sm"
                              >
                                Download
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600">
                  <p>No billing history yet</p>
                  <p className="text-sm mt-2">Your invoices will appear here once you subscribe to a paid plan</p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}


