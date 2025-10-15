"use client";

import React, { useState } from 'react';
import { ProfileSidebar } from '@/components';
import { Navbar } from '@/components';
import { useUser } from '@/contexts/UserContext';

export default function BillingPage() {
  const { user: contextUser, updateUser } = useUser();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const user = {
    name: `${contextUser?.firstName || ''} ${contextUser?.lastName || ''}`.trim() || 'User',
    email: contextUser?.email || 'user@example.com',
    avatar: contextUser?.avatar || '/image/avatar1.jpg',
    plan: contextUser?.plan || 'Basic',
  };

  // Get current plan details based on user's actual plan
  const getCurrentPlanDetails = () => {
    const plan = contextUser?.plan || 'Basic';
    
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
          nextBilling: 'March 15, 2024',
          status: 'active'
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
          nextBilling: 'March 15, 2024',
          status: 'active'
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
          nextBilling: 'N/A',
          status: 'active'
        };
    }
  };

  const currentPlan = getCurrentPlanDetails();

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
      isCurrent: user.plan === 'Basic',
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
      isCurrent: user.plan === 'Pro',
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
      isCurrent: user.plan === 'Enterprise',
      isPopular: false
    }
  ];

  // Get billing history based on user's plan
  const getBillingHistory = () => {
    const plan = contextUser?.plan || 'Basic';
    const planPrice = plan === 'Pro' ? '₹99' : plan === 'Enterprise' ? '₹299' : '₹0';
    const planName = plan === 'Basic' ? 'Free' : plan;
    
    if (plan === 'Basic') {
      return [
        {
          id: 'inv_001',
          date: contextUser?.joinDate || 'January 2024',
          amount: '₹0',
          status: 'active',
          description: 'Basic Plan - Free'
        }
      ];
    }
    
    // Generate realistic billing history for paid plans
    const history = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 6; i++) {
      const invoiceDate = new Date(currentDate);
      invoiceDate.setMonth(invoiceDate.getMonth() - i);
      
      history.push({
        id: `inv_${String(i + 1).padStart(3, '0')}`,
        date: invoiceDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        amount: planPrice,
        status: 'paid',
        description: `${planName} Plan - Monthly`
      });
    }
    
    return history;
  };

  const billingHistory = getBillingHistory();

  const handlePlanChange = async (newPlan: string) => {
    if (newPlan === user.plan) return;
    
    try {
      const result = await updateUser({ plan: newPlan });
      if (result.success) {
        alert(`Plan changed to ${newPlan} successfully!`);
        // Refresh the page to show updated plan
        window.location.reload();
      } else {
        alert('Failed to change plan. Please try again.');
      }
    } catch (error) {
      alert('Failed to change plan. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar />
      
      <div className="flex flex-col lg:flex-row pt-20">
        {/* Sidebar */}
        <div className="relative z-10">
          <ProfileSidebar
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            user={user}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing</h1>
              <p className="text-gray-600">Manage your subscription and payment methods</p>
            </div>

            {/* Current Plan Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Current Plan</h2>
                  <p className="text-gray-600">Your active subscription details</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Active
                  </span>
                  {currentPlan.nextBilling !== 'N/A' && (
                    <span className="text-sm text-gray-600">
                      Next billing: {currentPlan.nextBilling}
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
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {plan.isPopular && !plan.isCurrent && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
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
                      disabled={plan.isCurrent}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                        plan.isCurrent
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : plan.name === 'Pro' || plan.name === 'Enterprise'
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                    >
                      {plan.isCurrent ? 'CURRENT PLAN' : plan.name === 'Basic' ? 'DOWNGRADE' : 'UPGRADE PLAN'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-sm">VISA</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Visa .... 4242</p>
                    <p className="text-sm text-gray-600">Expires 12/26</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                    Default
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Update
                  </button>
                  <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {/* Billing History Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Billing History</h2>
                <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                  Download All
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Invoice</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingHistory.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-900">{invoice.id}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{invoice.date}</td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{invoice.amount}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            invoice.status === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{invoice.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}