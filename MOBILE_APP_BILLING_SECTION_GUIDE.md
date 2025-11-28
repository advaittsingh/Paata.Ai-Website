# 💳 Mobile App Billing Section Implementation Guide

## Overview

This document provides a comprehensive guide for implementing the Billing & Subscription section in the PAATA.AI mobile app. The billing section allows users to manage their subscription plans, payment methods, view invoices, track usage, and handle payments through Razorpay integration.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Data Models & Structure](#data-models--structure)
3. [API Endpoints](#api-endpoints)
4. [Screen Implementations](#screen-implementations)
5. [Navigation Flow](#navigation-flow)
6. [State Management](#state-management)
7. [Payment Integration](#payment-integration)
8. [Features & Functionality](#features--functionality)
9. [UI/UX Guidelines](#uiux-guidelines)
10. [Usage Tracking](#usage-tracking)
11. [Implementation Checklist](#implementation-checklist)

---

## Architecture Overview

### Subscription System Flow

```
User → Select Plan → Payment Method → Razorpay Payment → Subscription Active → Usage Tracking → Invoices
```

### Key Components

1. **Subscription Plans**: Basic (Free), Pro (₹99/month), Enterprise (₹299/month)
2. **Payment Provider**: Razorpay (supports cards, UPI, netbanking)
3. **Subscription Management**: Create, update, cancel subscriptions
4. **Payment Methods**: Store and manage payment methods
5. **Invoices**: Generate and download invoices
6. **Usage Tracking**: Monitor feature usage against plan limits

### Subscription States

- **Inactive**: No active subscription
- **Active**: Subscription is active and paid
- **Trialing**: Free trial period
- **PastDue**: Payment failed, subscription suspended
- **Cancelled**: User cancelled, active until period end
- **Expired**: Subscription has expired

---

## Data Models & Structure

### Database Schema

```typescript
// Plan Enum
enum Plan {
  Basic
  Pro
  Enterprise
}

// Subscription Status Enum
enum SubscriptionStatus {
  Inactive
  Active
  Trialing
  PastDue
  Cancelled
  Expired
}

// Subscription Model
interface Subscription {
  id: string;
  userId: string;
  plan: Plan;
  status: SubscriptionStatus;
  provider: string;              // 'razorpay' or 'manual'
  subscriptionId?: string;        // Razorpay subscription ID
  customerId?: string;            // Razorpay customer ID
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Payment Method Model
interface PaymentMethod {
  id: string;
  userId: string;
  provider: string;               // 'razorpay' or 'stripe'
  methodId: string;               // Provider payment method ID
  type: string;                    // 'card', 'upi', 'netbanking'
  last4?: string;                  // Last 4 digits of card
  brand?: string;                  // Card brand (Visa, Mastercard, etc.)
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Invoice Model
interface Invoice {
  id: string;
  subscriptionId: string;
  invoiceId: string;              // Provider invoice ID
  amount: number;
  currency: string;                // Default: 'INR'
  status: string;                  // 'paid', 'pending', 'failed'
  paidAt?: Date;
  dueDate: Date;
  pdfUrl?: string;
  plan?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Usage Statistics (stored in User model)
interface UsageStats {
  totalInteractions: number;
  monthlyInteractions: number;
  dailyUsage: {
    [date: string]: {
      interactions: number;
      textMessages: number;
      imageUploads: number;
      voiceInputs: number;
      timeSpent: number;           // in minutes
    };
  };
  lastResetDate: Date;
}
```

### Plan Details

```typescript
interface PlanDetails {
  name: string;
  price: string;                  // 'Free' or '₹99'
  period: string;                 // 'forever' or 'per month'
  description: string;
  features: string[];
  limits: {
    conversations: number | 'unlimited';
    imageAnalysis: 'basic' | 'advanced';
    voiceInput: boolean;
    support: 'email' | 'priority' | 'dedicated';
    exportConversations: boolean;
    customLearningPaths: boolean;
    teamManagement: boolean;
    analyticsDashboard: boolean;
    apiAccess: boolean;
  };
}

const PLAN_DETAILS: { [key: string]: PlanDetails } = {
  Basic: {
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
    limits: {
      conversations: 100,
      imageAnalysis: 'basic',
      voiceInput: false,
      support: 'email',
      exportConversations: false,
      customLearningPaths: false,
      teamManagement: false,
      analyticsDashboard: false,
      apiAccess: false,
    }
  },
  Pro: {
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
    limits: {
      conversations: 'unlimited',
      imageAnalysis: 'advanced',
      voiceInput: true,
      support: 'priority',
      exportConversations: true,
      customLearningPaths: true,
      teamManagement: false,
      analyticsDashboard: false,
      apiAccess: false,
    }
  },
  Enterprise: {
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
    limits: {
      conversations: 'unlimited',
      imageAnalysis: 'advanced',
      voiceInput: true,
      support: 'dedicated',
      exportConversations: true,
      customLearningPaths: true,
      teamManagement: true,
      analyticsDashboard: true,
      apiAccess: true,
    }
  }
};
```

---

## API Endpoints

### Base URL
```
https://www.paataai.com/api
```

### Authentication
All endpoints require JWT token in `Authorization: Bearer <token>` header.

### Endpoints

#### 1. Get Current Subscription
```http
GET /api/subscriptions/current
```

**Response:**
```json
{
  "subscription": {
    "id": "sub_123",
    "plan": "Pro",
    "status": "Active",
    "currentPeriodStart": "2024-01-01T00:00:00Z",
    "currentPeriodEnd": "2024-02-01T00:00:00Z",
    "cancelAtPeriodEnd": false
  },
  "paymentMethod": {
    "id": "pm_123",
    "type": "card",
    "last4": "4242",
    "brand": "Visa",
    "expiryMonth": 12,
    "expiryYear": 2025,
    "isDefault": true
  },
  "userPlan": "Pro"
}
```

#### 2. Create Subscription
```http
POST /api/subscriptions/create
Content-Type: application/json

{
  "plan": "Pro",
  "provider": "razorpay",
  "usePaymentLink": true
}
```

**Response:**
```json
{
  "success": true,
  "paymentLink": "https://rzp.io/l/abc123",
  "paymentLinkId": "plink_123",
  "message": "Payment link created. Please complete the payment."
}
```

#### 3. Update Subscription
```http
PUT /api/subscriptions/update
Content-Type: application/json

{
  "subscriptionId": "sub_123",
  "plan": "Enterprise"
}
```

**Response:**
```json
{
  "success": true,
  "subscription": {
    "id": "sub_123",
    "plan": "Enterprise",
    "status": "Active"
  },
  "message": "Subscription updated successfully"
}
```

#### 4. Cancel Subscription
```http
POST /api/subscriptions/cancel
Content-Type: application/json

{
  "subscriptionId": "sub_123",
  "cancelAtPeriodEnd": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription will be cancelled at the end of your billing period"
}
```

#### 5. Get Invoices
```http
GET /api/subscriptions/invoices
```

**Response:**
```json
{
  "invoices": [
    {
      "id": "inv_123",
      "invoiceId": "INV-2024-001",
      "amount": 99,
      "currency": "INR",
      "status": "paid",
      "paidAt": "2024-01-01T00:00:00Z",
      "dueDate": "2024-01-01T00:00:00Z",
      "pdfUrl": "https://example.com/invoices/inv_123.pdf",
      "plan": "Pro"
    }
  ]
}
```

#### 6. Get Payment Methods
```http
GET /api/payment-methods
```

**Response:**
```json
{
  "paymentMethods": [
    {
      "id": "pm_123",
      "type": "card",
      "last4": "4242",
      "brand": "Visa",
      "expiryMonth": 12,
      "expiryYear": 2025,
      "isDefault": true
    }
  ]
}
```

#### 7. Update Payment Method
```http
PUT /api/payment-methods
Content-Type: application/json

{
  "paymentMethodId": "pm_123"
}
```

#### 8. Remove Payment Method
```http
DELETE /api/payment-methods?id=pm_123
```

#### 9. Download Invoice
```http
GET /api/invoices/{id}/download
```

**Response:** PDF file download

#### 10. Get Usage Statistics
```http
GET /api/usage?period=monthly
```

**Response:**
```json
{
  "usage": {
    "totalInteractions": 150,
    "monthlyInteractions": 75,
    "dailyUsage": {
      "2024-01-15": {
        "interactions": 10,
        "textMessages": 8,
        "imageUploads": 2,
        "voiceInputs": 0,
        "timeSpent": 45
      }
    },
    "lastResetDate": "2024-01-01T00:00:00Z"
  },
  "planLimits": {
    "conversations": "unlimited",
    "imageAnalysis": "advanced",
    "voiceInput": true
  },
  "remaining": {
    "conversations": "unlimited"
  }
}
```

---

## Screen Implementations

### 1. Billing Home Screen

**File:** `src/screens/billing/BillingScreen.tsx`

**Purpose:** Main billing dashboard showing current plan, available plans, payment methods, and invoices.

**Implementation:**

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';
import { fetchCurrentSubscription, fetchInvoices } from '../../store/slices/billingSlice';

export default function BillingScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { subscription, paymentMethod, invoices, isLoading } = useSelector((state: RootState) => state.billing);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCurrentSubscription());
    dispatch(fetchInvoices());
  }, []);

  const currentPlan = subscription?.plan || user?.plan || 'Basic';
  const planDetails = PLAN_DETAILS[currentPlan];

  const handlePlanChange = async (newPlan: string) => {
    if (newPlan === currentPlan) return;
    
    setIsProcessing(true);
    setError(null);

    try {
      // For free plan (Basic), create directly
      if (newPlan === 'Basic') {
        const response = await fetch('https://www.paataai.com/api/subscriptions/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            plan: newPlan,
            provider: 'manual',
          }),
        });

        if (response.ok) {
          Alert.alert('Success', `Plan changed to ${newPlan} successfully!`);
          dispatch(fetchCurrentSubscription());
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to change plan');
        }
        setIsProcessing(false);
        return;
      }

      // For paid plans, use payment link
      const response = await fetch('https://www.paataai.com/api/subscriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan: newPlan,
          provider: 'razorpay',
          usePaymentLink: true,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.paymentLink) {
          // Open payment link in browser
          Alert.alert(
            'Payment Required',
            `Please complete the payment to activate your ${newPlan} plan.`,
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Open Payment', 
                onPress: () => {
                  // Open in browser or Razorpay SDK
                  Linking.openURL(data.paymentLink);
                }
              }
            ]
          );
        } else {
          Alert.alert('Success', `Plan changed to ${newPlan} successfully!`);
          dispatch(fetchCurrentSubscription());
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create subscription');
        Alert.alert('Error', errorData.message || 'Failed to create subscription');
      }
    } catch (error: any) {
      console.error('Plan change error:', error);
      setError(error.message || 'An error occurred');
      Alert.alert('Error', 'Failed to change plan. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription? You will continue to have access until the end of your billing period.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            setIsProcessing(true);
            try {
              const response = await fetch('https://www.paataai.com/api/subscriptions/cancel', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                  subscriptionId: subscription.id,
                  cancelAtPeriodEnd: true,
                }),
              });

              if (response.ok) {
                Alert.alert('Success', 'Subscription will be cancelled at the end of your billing period.');
                dispatch(fetchCurrentSubscription());
              } else {
                const errorData = await response.json();
                Alert.alert('Error', errorData.message || 'Failed to cancel subscription');
              }
            } catch (error) {
              console.error('Cancel subscription error:', error);
              Alert.alert('Error', 'Failed to cancel subscription. Please try again.');
            } finally {
              setIsProcessing(false);
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getSubscriptionStatus = () => {
    if (!subscription) return 'Inactive';
    return subscription.status;
  };

  const getNextBillingDate = () => {
    if (subscription?.currentPeriodEnd) {
      return formatDate(subscription.currentPeriodEnd);
    }
    return 'N/A';
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Billing</Text>
        <Text style={styles.subtitle}>Manage your subscription and payment methods</Text>
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Current Plan Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Current Plan</Text>
            <Text style={styles.sectionSubtitle}>Your active subscription details</Text>
          </View>
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge,
              getSubscriptionStatus() === 'Active' || getSubscriptionStatus() === 'Trialing'
                ? styles.statusBadgeActive
                : styles.statusBadgeInactive
            ]}>
              <Text style={[
                styles.statusText,
                getSubscriptionStatus() === 'Active' || getSubscriptionStatus() === 'Trialing'
                  ? styles.statusTextActive
                  : styles.statusTextInactive
              ]}>
                {getSubscriptionStatus()}
              </Text>
            </View>
            {getNextBillingDate() !== 'N/A' && (
              <Text style={styles.billingDate}>Next billing: {getNextBillingDate()}</Text>
            )}
            {subscription?.cancelAtPeriodEnd && (
              <View style={styles.cancellingBadge}>
                <Text style={styles.cancellingText}>Cancelling</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.currentPlanCard}>
          <View style={styles.planInfo}>
            <Text style={styles.planName}>{planDetails.name} Plan</Text>
            <Text style={styles.planPrice}>
              {planDetails.price} {planDetails.period}
            </Text>
            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Features included:</Text>
              {planDetails.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Text style={styles.checkmark}>✓</Text>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
            {subscription && subscription.status === 'Active' && !subscription.cancelAtPeriodEnd && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelSubscription}
                disabled={isProcessing}
              >
                <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Available Plans Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Plans</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Object.values(PLAN_DETAILS).map((plan) => {
            const isCurrent = plan.name === currentPlan;
            return (
              <View
                key={plan.name}
                style={[
                  styles.planCard,
                  isCurrent && styles.planCardCurrent,
                  plan.name === 'Pro' && !isCurrent && styles.planCardPopular
                ]}
              >
                {plan.name === 'Pro' && !isCurrent && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>Most Popular</Text>
                  </View>
                )}
                <View style={styles.planCardHeader}>
                  <Text style={styles.planCardName}>{plan.name}</Text>
                  <Text style={styles.planCardDescription}>{plan.description}</Text>
                  <Text style={styles.planCardPrice}>{plan.price}</Text>
                  <Text style={styles.planCardPeriod}>{plan.period}</Text>
                </View>
                <View style={styles.planFeaturesList}>
                  {plan.features.map((feature, index) => (
                    <View key={index} style={styles.planFeatureItem}>
                      <Text style={styles.planCheckmark}>✓</Text>
                      <Text style={styles.planFeatureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity
                  style={[
                    styles.planButton,
                    isCurrent && styles.planButtonCurrent,
                    isProcessing && styles.planButtonDisabled
                  ]}
                  onPress={() => handlePlanChange(plan.name)}
                  disabled={isCurrent || isProcessing}
                >
                  <Text style={[
                    styles.planButtonText,
                    isCurrent && styles.planButtonTextCurrent
                  ]}>
                    {isProcessing
                      ? 'Processing...'
                      : isCurrent
                      ? 'CURRENT PLAN'
                      : plan.name === 'Basic'
                      ? 'DOWNGRADE'
                      : 'UPGRADE PLAN'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Payment Method Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        {paymentMethod ? (
          <View style={styles.paymentMethodCard}>
            <View style={styles.paymentMethodInfo}>
              <View style={styles.paymentMethodIcon}>
                <Text style={styles.paymentMethodIconText}>
                  {paymentMethod.brand?.toUpperCase() || 'CARD'}
                </Text>
              </View>
              <View style={styles.paymentMethodDetails}>
                <Text style={styles.paymentMethodType}>
                  {paymentMethod.type === 'card' ? 'Card' : paymentMethod.type}
                  {paymentMethod.last4 ? ` .... ${paymentMethod.last4}` : ''}
                </Text>
                {paymentMethod.expiryMonth && paymentMethod.expiryYear && (
                  <Text style={styles.paymentMethodExpiry}>
                    Expires {String(paymentMethod.expiryMonth).padStart(2, '0')}/{String(paymentMethod.expiryYear).slice(-2)}
                  </Text>
                )}
              </View>
              {paymentMethod.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              )}
            </View>
            <View style={styles.paymentMethodActions}>
              <TouchableOpacity
                style={[
                  styles.paymentMethodButton,
                  paymentMethod.isDefault && styles.paymentMethodButtonDisabled
                ]}
                onPress={() => handleUpdatePaymentMethod(paymentMethod.id)}
                disabled={isProcessing || paymentMethod.isDefault}
              >
                <Text style={styles.paymentMethodButtonText}>
                  {paymentMethod.isDefault ? 'Default' : 'Set Default'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.paymentMethodButton,
                  styles.paymentMethodButtonRemove,
                  paymentMethod.isDefault && styles.paymentMethodButtonDisabled
                ]}
                onPress={() => handleRemovePaymentMethod(paymentMethod.id)}
                disabled={isProcessing || paymentMethod.isDefault}
              >
                <Text style={styles.paymentMethodButtonRemoveText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.noPaymentMethodCard}>
            <Text style={styles.noPaymentMethodText}>No payment method on file</Text>
            <Text style={styles.noPaymentMethodSubtext}>
              Add a payment method when upgrading to a paid plan
            </Text>
          </View>
        )}
      </View>

      {/* Billing History Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Billing History</Text>
          {invoices.length > 0 && (
            <TouchableOpacity style={styles.downloadAllButton}>
              <Text style={styles.downloadAllText}>Download All</Text>
            </TouchableOpacity>
          )}
        </View>
        {invoices.length > 0 ? (
          <View style={styles.invoicesList}>
            {invoices.map((invoice) => (
              <View key={invoice.id} style={styles.invoiceCard}>
                <View style={styles.invoiceInfo}>
                  <Text style={styles.invoiceId}>{invoice.invoiceId}</Text>
                  <Text style={styles.invoiceDate}>
                    {invoice.paidAt
                      ? formatDate(invoice.paidAt)
                      : formatDate(invoice.dueDate)}
                  </Text>
                  <Text style={styles.invoiceAmount}>
                    ₹{invoice.amount.toFixed(0)} {invoice.currency}
                  </Text>
                </View>
                <View style={styles.invoiceMeta}>
                  <View style={[
                    styles.invoiceStatusBadge,
                    invoice.status === 'paid' && styles.invoiceStatusPaid,
                    invoice.status === 'pending' && styles.invoiceStatusPending,
                    invoice.status === 'failed' && styles.invoiceStatusFailed
                  ]}>
                    <Text style={styles.invoiceStatusText}>{invoice.status}</Text>
                  </View>
                  {invoice.pdfUrl && (
                    <TouchableOpacity
                      style={styles.downloadButton}
                      onPress={() => handleDownloadInvoice(invoice.id)}
                    >
                      <Text style={styles.downloadButtonText}>Download</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.noInvoicesCard}>
            <Text style={styles.noInvoicesText}>No billing history yet</Text>
            <Text style={styles.noInvoicesSubtext}>
              Your invoices will appear here once you subscribe to a paid plan
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  errorContainer: {
    margin: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.red200,
    borderRadius: borderRadius.medium,
    borderLeftWidth: 4,
    borderLeftColor: colors.red600,
  },
  errorText: {
    ...typography.body,
    color: colors.red600,
  },
  section: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xs,
  },
  statusBadgeActive: {
    backgroundColor: colors.green100,
  },
  statusBadgeInactive: {
    backgroundColor: colors.gray100,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '600',
  },
  statusTextActive: {
    color: colors.green600,
  },
  statusTextInactive: {
    color: colors.gray600,
  },
  billingDate: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  cancellingBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.amber100,
    borderRadius: borderRadius.small,
    marginTop: spacing.xs,
  },
  cancellingText: {
    ...typography.caption,
    color: colors.amber500,
    fontWeight: '600',
  },
  currentPlanCard: {
    backgroundColor: colors.gray50,
    borderRadius: borderRadius.large,
    padding: spacing.lg,
    ...shadows.md,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  planPrice: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  featuresContainer: {
    marginTop: spacing.md,
  },
  featuresTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  checkmark: {
    ...typography.body,
    color: colors.green600,
    marginRight: spacing.sm,
  },
  featureText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  cancelButton: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.red300,
    borderRadius: borderRadius.medium,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...typography.body,
    color: colors.red600,
    fontWeight: '600',
  },
  planCard: {
    width: 280,
    backgroundColor: colors.white,
    borderRadius: borderRadius.large,
    padding: spacing.lg,
    marginRight: spacing.md,
    borderWidth: 2,
    borderColor: colors.gray200,
    ...shadows.md,
  },
  planCardCurrent: {
    borderColor: colors.primary,
    backgroundColor: colors.gray50,
  },
  planCardPopular: {
    borderColor: colors.blue600,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: '50%',
    transform: [{ translateX: -60 }],
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  popularText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
  },
  planCardHeader: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  planCardName: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  planCardDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  planCardPrice: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  planCardPeriod: {
    ...typography.body,
    color: colors.textSecondary,
  },
  planFeaturesList: {
    marginBottom: spacing.lg,
  },
  planFeatureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  planCheckmark: {
    ...typography.bodySmall,
    color: colors.green600,
    marginRight: spacing.sm,
  },
  planFeatureText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  planButton: {
    padding: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.medium,
    alignItems: 'center',
  },
  planButtonCurrent: {
    backgroundColor: colors.gray100,
  },
  planButtonDisabled: {
    opacity: 0.5,
  },
  planButtonText: {
    ...typography.button,
    color: colors.white,
  },
  planButtonTextCurrent: {
    color: colors.gray500,
  },
  paymentMethodCard: {
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: borderRadius.medium,
    padding: spacing.md,
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  paymentMethodIcon: {
    width: 48,
    height: 32,
    backgroundColor: colors.blue600,
    borderRadius: borderRadius.small,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  paymentMethodIconText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
  },
  paymentMethodDetails: {
    flex: 1,
  },
  paymentMethodType: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  paymentMethodExpiry: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  defaultBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.green100,
    borderRadius: borderRadius.small,
  },
  defaultText: {
    ...typography.caption,
    color: colors.green600,
    fontWeight: '600',
  },
  paymentMethodActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  paymentMethodButton: {
    flex: 1,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.medium,
    alignItems: 'center',
  },
  paymentMethodButtonRemove: {
    borderColor: colors.red300,
  },
  paymentMethodButtonDisabled: {
    opacity: 0.5,
  },
  paymentMethodButtonText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  paymentMethodButtonRemoveText: {
    ...typography.body,
    color: colors.red600,
  },
  noPaymentMethodCard: {
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: borderRadius.medium,
    alignItems: 'center',
  },
  noPaymentMethodText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  noPaymentMethodSubtext: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  downloadAllButton: {
    padding: spacing.sm,
  },
  downloadAllText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  invoicesList: {
    gap: spacing.md,
  },
  invoiceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: borderRadius.medium,
  },
  invoiceInfo: {
    flex: 1,
  },
  invoiceId: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  invoiceDate: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  invoiceAmount: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  invoiceMeta: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  invoiceStatusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.small,
  },
  invoiceStatusPaid: {
    backgroundColor: colors.green100,
  },
  invoiceStatusPending: {
    backgroundColor: colors.amber100,
  },
  invoiceStatusFailed: {
    backgroundColor: colors.red100,
  },
  invoiceStatusText: {
    ...typography.caption,
    fontWeight: '600',
  },
  downloadButton: {
    padding: spacing.sm,
  },
  downloadButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  noInvoicesCard: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  noInvoicesText: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  noInvoicesSubtext: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
```

### 2. Usage Statistics Screen

**File:** `src/screens/billing/UsageScreen.tsx`

**Purpose:** Display usage statistics and plan limits.

**Implementation:**

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { fetchUsageStats } from '../../store/slices/billingSlice';

export default function UsageScreen() {
  const { usage, planLimits, remaining } = useSelector((state: RootState) => state.billing);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchUsageStats());
  }, []);

  const getUsagePercentage = (used: number, limit: number | 'unlimited') => {
    if (limit === 'unlimited') return 100;
    return Math.min((used / limit) * 100, 100);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Usage Statistics</Text>
        <Text style={styles.subtitle}>Track your feature usage</Text>
      </View>

      {/* Conversations Usage */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>AI Conversations</Text>
          <Text style={styles.usageText}>
            {usage?.monthlyInteractions || 0} / {planLimits?.conversations === 'unlimited' ? '∞' : planLimits?.conversations || 0}
          </Text>
        </View>
        {planLimits?.conversations !== 'unlimited' && (
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${getUsagePercentage(usage?.monthlyInteractions || 0, planLimits?.conversations || 100)}%`,
                    backgroundColor: getUsagePercentage(usage?.monthlyInteractions || 0, planLimits?.conversations || 100) > 80
                      ? colors.red600
                      : colors.blue600,
                  }
                ]}
              />
            </View>
          </View>
        )}
      </View>

      {/* Daily Usage Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Usage</Text>
        {usage?.dailyUsage && Object.keys(usage.dailyUsage).length > 0 ? (
          Object.entries(usage.dailyUsage)
            .slice(-7)
            .reverse()
            .map(([date, stats]: [string, any]) => (
              <View key={date} style={styles.dailyUsageCard}>
                <Text style={styles.dailyDate}>{new Date(date).toLocaleDateString()}</Text>
                <View style={styles.dailyStats}>
                  <View style={styles.dailyStatItem}>
                    <Text style={styles.dailyStatLabel}>Interactions</Text>
                    <Text style={styles.dailyStatValue}>{stats.interactions}</Text>
                  </View>
                  <View style={styles.dailyStatItem}>
                    <Text style={styles.dailyStatLabel}>Text</Text>
                    <Text style={styles.dailyStatValue}>{stats.textMessages}</Text>
                  </View>
                  <View style={styles.dailyStatItem}>
                    <Text style={styles.dailyStatLabel}>Images</Text>
                    <Text style={styles.dailyStatValue}>{stats.imageUploads}</Text>
                  </View>
                  <View style={styles.dailyStatItem}>
                    <Text style={styles.dailyStatLabel}>Voice</Text>
                    <Text style={styles.dailyStatValue}>{stats.voiceInputs}</Text>
                  </View>
                  <View style={styles.dailyStatItem}>
                    <Text style={styles.dailyStatLabel}>Time</Text>
                    <Text style={styles.dailyStatValue}>{stats.timeSpent}m</Text>
                  </View>
                </View>
              </View>
            ))
        ) : (
          <Text style={styles.emptyText}>No usage data available</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  section: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  usageText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  progressBarContainer: {
    marginTop: spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.gray200,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  dailyUsageCard: {
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: borderRadius.medium,
    marginBottom: spacing.sm,
  },
  dailyDate: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  dailyStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  dailyStatItem: {
    flex: 1,
    minWidth: '30%',
  },
  dailyStatLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  dailyStatValue: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.xxl,
  },
});
```

---

## Navigation Flow

### Navigation Structure

```typescript
// Navigation Stack
BillingStack:
  - BillingScreen (Home)
  - UsageScreen
  - PaymentMethodScreen (Future)
  - InvoiceDetailScreen (Future)
```

---

## State Management

### Redux Slice

**File:** `src/store/slices/billingSlice.ts`

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { billingApi } from '../../api/endpoints';

interface BillingState {
  subscription: Subscription | null;
  paymentMethod: PaymentMethod | null;
  invoices: Invoice[];
  usage: UsageStats | null;
  planLimits: PlanLimits | null;
  remaining: RemainingLimits | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BillingState = {
  subscription: null,
  paymentMethod: null,
  invoices: [],
  usage: null,
  planLimits: null,
  remaining: null,
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchCurrentSubscription = createAsyncThunk(
  'billing/fetchCurrentSubscription',
  async () => {
    const response = await billingApi.getCurrentSubscription();
    return response;
  }
);

export const fetchInvoices = createAsyncThunk(
  'billing/fetchInvoices',
  async () => {
    const response = await billingApi.getInvoices();
    return response.invoices;
  }
);

export const fetchUsageStats = createAsyncThunk(
  'billing/fetchUsageStats',
  async () => {
    const response = await billingApi.getUsageStats();
    return response;
  }
);

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    clearBillingData: (state) => {
      state.subscription = null;
      state.paymentMethod = null;
      state.invoices = [];
      state.usage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscription = action.payload.subscription;
        state.paymentMethod = action.payload.paymentMethod;
      })
      .addCase(fetchCurrentSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch subscription';
      })
      // Similar for other thunks...
  },
});

export const { clearBillingData } = billingSlice.actions;
export default billingSlice.reducer;
```

---

## Payment Integration

### Razorpay Integration

For mobile apps, use Razorpay's React Native SDK:

```bash
npm install react-native-razorpay
```

**Implementation:**

```typescript
import RazorpayCheckout from 'react-native-razorpay';

const handlePayment = async (amount: number, plan: string) => {
  try {
    const options = {
      description: `PAATA.AI ${plan} Plan Subscription`,
      image: 'https://your-logo-url.com/logo.png',
      currency: 'INR',
      key: 'YOUR_RAZORPAY_KEY',
      amount: amount * 100, // Convert to paise
      name: 'PAATA.AI',
      prefill: {
        email: user.email,
        contact: user.phone,
        name: `${user.firstName} ${user.lastName}`,
      },
      theme: { color: '#111827' },
    };

    const data = await RazorpayCheckout.open(options);
    
    // Handle payment success
    if (data.razorpay_payment_id) {
      // Verify payment with backend
      await verifyPayment(data.razorpay_payment_id, plan);
    }
  } catch (error: any) {
    if (error.code !== 'RazorpayCheckout') {
      console.error('Payment error:', error);
      Alert.alert('Payment Failed', error.description || 'Payment was cancelled');
    }
  }
};
```

---

## Features & Functionality

### 1. Plan Management
- View current plan
- Upgrade/downgrade plans
- Cancel subscription
- View plan features and limits

### 2. Payment Methods
- Add payment methods
- Set default payment method
- Remove payment methods
- View payment method details

### 3. Invoices
- View billing history
- Download invoice PDFs
- View invoice details
- Track payment status

### 4. Usage Tracking
- Monitor feature usage
- View daily usage breakdown
- Track against plan limits
- Usage alerts when approaching limits

### 5. Subscription Status
- Active subscription management
- Trial period tracking
- Cancellation handling
- Renewal notifications

---

## UI/UX Guidelines

### Color Scheme
- Follow design scheme from `MOBILE_APP_DESIGN_SCHEME.md`
- Use status colors for subscription states:
  - Active: Green
  - Trialing: Blue
  - PastDue: Amber
  - Cancelled: Red

### Typography
- Use consistent typography scale
- Emphasize important information (plan name, price)
- Use smaller text for secondary information

### Component Guidelines
1. **Plan Cards**: Clear pricing, feature list, CTA button
2. **Status Badges**: Color-coded, clear labels
3. **Progress Bars**: Visual representation of usage
4. **Invoice List**: Clean table/list format
5. **Payment Methods**: Card-like display with actions

---

## Usage Tracking

### Implementation

Track usage in real-time when features are used:

```typescript
// Track conversation usage
const trackConversation = async (inputType: 'text' | 'image' | 'voice') => {
  await fetch('https://www.paataai.com/api/usage/track', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      type: 'conversation',
      inputType: inputType,
    }),
  });
};
```

---

## Implementation Checklist

### Phase 1: Core Structure
- [ ] Set up navigation stack
- [ ] Create Redux slice for billing state
- [ ] Implement API endpoints integration
- [ ] Create base screen components

### Phase 2: Subscription Management
- [ ] Implement BillingScreen
- [ ] Add plan selection UI
- [ ] Add subscription status display
- [ ] Implement plan change functionality

### Phase 3: Payment Integration
- [ ] Integrate Razorpay SDK
- [ ] Implement payment flow
- [ ] Add payment method management
- [ ] Handle payment callbacks

### Phase 4: Invoices
- [ ] Display invoice list
- [ ] Implement invoice download
- [ ] Add invoice details view
- [ ] Handle invoice status

### Phase 5: Usage Tracking
- [ ] Implement UsageScreen
- [ ] Display usage statistics
- [ ] Add progress indicators
- [ ] Show plan limits

### Phase 6: Polish & Optimization
- [ ] Add loading states
- [ ] Add error handling
- [ ] Optimize performance
- [ ] Add animations
- [ ] Test payment flows

---

## Testing Checklist

### Functional Testing
- [ ] Plan selection works correctly
- [ ] Payment processing works
- [ ] Subscription cancellation works
- [ ] Invoice download works
- [ ] Usage tracking is accurate
- [ ] Plan limits are enforced

### Payment Testing
- [ ] Test with test cards
- [ ] Test UPI payments
- [ ] Test payment failures
- [ ] Test payment success flow
- [ ] Test subscription renewal

### UI/UX Testing
- [ ] Colors match design scheme
- [ ] Typography is consistent
- [ ] Status badges are clear
- [ ] Progress bars are accurate
- [ ] Error messages are helpful

---

## Security Considerations

1. **Never store payment details** on device
2. **Always verify payments** on backend
3. **Use secure token storage** for authentication
4. **Validate subscription status** before allowing features
5. **Implement rate limiting** for API calls

---

## Troubleshooting

### Common Issues

1. **Payment not processing**
   - Check Razorpay key configuration
   - Verify network connectivity
   - Check payment method validity

2. **Subscription not updating**
   - Verify API response
   - Check subscription status
   - Refresh subscription data

3. **Usage not tracking**
   - Verify API calls are being made
   - Check authentication token
   - Verify usage endpoint

---

**Last Updated**: 2024
**Maintained By**: PAATA.AI Development Team


