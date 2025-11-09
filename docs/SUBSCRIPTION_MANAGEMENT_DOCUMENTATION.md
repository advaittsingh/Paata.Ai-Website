# 💳 PAATA.AI Subscription Management Documentation

**Last Updated:** January 2025  
**Version:** 2.0  
**Status:** ✅ Complete - Fully implemented with Razorpay integration

---

## 📋 Overview

This document describes the current subscription management system, payment processing status, and recommendations for implementing a complete billing solution.

---

## 🏗️ Current Implementation

### Plan System

**Available Plans:**
1. **Basic** - Free
   - 100 AI conversations/month
   - Basic image analysis
   - Text input only
   - Email support

2. **Pro** - ₹99/month
   - Unlimited AI conversations
   - Advanced image analysis
   - Voice input & transcription
   - Priority support
   - Export conversations
   - Custom learning paths

3. **Enterprise** - ₹299/month
   - Everything in Pro
   - Team management
   - Analytics dashboard
   - API access
   - Custom integrations
   - Dedicated support

**Current Status:**
- ✅ Plan definitions in `src/utils/planLimits.ts`
- ✅ Plan-based feature gating implemented
- ✅ UI for plan selection and management
- ❌ **No payment processing**
- ❌ **No subscription lifecycle management**
- ❌ **No invoice generation**

---

## 📊 Database Schema

### Current User Model
```prisma
model User {
  id        String   @id @default(cuid())
  plan      Plan     @default(Enterprise)
  // ... other fields
}

enum Plan {
  Basic
  Pro
  Enterprise
}
```

**Current Limitations:**
- No subscription tracking
- No billing information
- No payment method storage
- No subscription status
- No billing cycle tracking

---

## 🎨 UI Implementation

### Billing Page (`/profile/billing`)

**File:** `src/app/profile/billing/page.tsx`

**Features:**
- ✅ Current plan display
- ✅ Available plans display
- ✅ Plan comparison
- ✅ Plan change UI (frontend only)
- ✅ Mock billing history
- ✅ Mock payment method display

**Current Functionality:**
```typescript
const handlePlanChange = async (newPlan: string) => {
  // Updates user plan in database directly
  // NO payment processing
  const result = await updateUser({ plan: newPlan });
  // ...
};
```

**What's Missing:**
- ❌ Actual payment processing
- ❌ Payment method management
- ❌ Real invoice generation
- ❌ Subscription status tracking
- ❌ Billing cycle management

---

## 🔄 Current Plan Change Flow

```
User clicks "Upgrade Plan"
  ↓
Frontend calls updateUser({ plan: newPlan })
  ↓
PUT /api/users
  ↓
PrismaDatabase.updateUser()
  ↓
Updates plan in database
  ↓
Plan updated immediately
  ↓
NO PAYMENT PROCESSING ⚠️
```

**Issues:**
1. No payment verification
2. No subscription creation
3. No billing cycle setup
4. Plan changes are free
5. No trial period tracking
6. No cancellation handling

---

## 💰 Payment Processing Options

### Option 1: Stripe (Recommended for International)

**Pros:**
- Global payment processing
- Supports multiple currencies
- Subscription management built-in
- Webhook support
- Good documentation
- PCI compliance handled

**Cons:**
- Higher fees for international
- May not support Indian payment methods directly

**Implementation:**
```bash
npm install stripe
npm install @stripe/stripe-js
```

**Key Features Needed:**
- Customer creation
- Subscription management
- Payment method storage
- Invoice generation
- Webhook handling
- Subscription lifecycle

### Option 2: Razorpay (Recommended for India)

**Pros:**
- Best for Indian market
- Supports UPI, cards, net banking
- Lower fees in India
- Good Indian payment methods
- Subscription management

**Cons:**
- Primarily India-focused
- Less international support

**Implementation:**
```bash
npm install razorpay
```

**Key Features:**
- Payment gateway
- Subscription plans
- Payment links
- Refunds
- Webhooks

### Option 3: Hybrid Approach

**Strategy:**
- Razorpay for Indian customers
- Stripe for international customers
- Currency detection based on user location

---

## 🏗️ Recommended Database Schema

### Enhanced User Model
```prisma
model User {
  id        String   @id @default(cuid())
  plan      Plan     @default(Enterprise)
  subscriptionStatus SubscriptionStatus @default(Inactive)
  subscriptionId String? // Payment provider subscription ID
  customerId     String? // Payment provider customer ID
  currentPeriodStart DateTime?
  currentPeriodEnd   DateTime?
  cancelAtPeriodEnd Boolean @default(false)
  trialEndsAt DateTime?
  // ... other fields
}

enum SubscriptionStatus {
  Inactive
  Active
  Trialing
  PastDue
  Cancelled
  Expired
}

model Subscription {
  id              String   @id @default(cuid())
  userId          String
  plan            Plan
  status          SubscriptionStatus
  provider        String   // 'stripe' or 'razorpay'
  subscriptionId  String   // Provider subscription ID
  customerId      String   // Provider customer ID
  currentPeriodStart DateTime
  currentPeriodEnd   DateTime
  cancelAtPeriodEnd Boolean @default(false)
  cancelledAt    DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id])
  invoices Invoice[]
  
  @@index([userId])
  @@index([status])
}

model PaymentMethod {
  id              String   @id @default(cuid())
  userId          String
  provider        String   // 'stripe' or 'razorpay'
  methodId        String   // Provider payment method ID
  type            String   // 'card', 'upi', 'netbanking'
  last4           String?
  brand           String?
  expiryMonth     Int?
  expiryYear      Int?
  isDefault       Boolean  @default(false)
  createdAt       DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id])
  
  @@index([userId])
}

model Invoice {
  id              String   @id @default(cuid())
  subscriptionId  String
  invoiceId       String   // Provider invoice ID
  amount          Float
  currency        String   @default("INR")
  status          String   // 'paid', 'pending', 'failed'
  paidAt          DateTime?
  dueDate         DateTime
  pdfUrl          String?
  createdAt       DateTime @default(now())
  
  subscription Subscription @relation(fields: [subscriptionId], references: [id])
  
  @@index([subscriptionId])
  @@index([status])
}
```

---

## 🔄 Recommended Subscription Flow

### 1. Plan Upgrade Flow

```
User clicks "Upgrade to Pro"
  ↓
Frontend: Show payment form
  ↓
User enters payment details
  ↓
POST /api/subscriptions/create
  ↓
Create customer in payment provider
  ↓
Create subscription
  ↓
Store payment method
  ↓
Update user subscription in database
  ↓
Return success
  ↓
Frontend: Show confirmation
  ↓
Send confirmation email
```

### 2. Subscription Management

**Endpoints Needed:**
- `POST /api/subscriptions/create` - Create subscription
- `GET /api/subscriptions/current` - Get current subscription
- `PUT /api/subscriptions/update` - Update subscription
- `POST /api/subscriptions/cancel` - Cancel subscription
- `POST /api/subscriptions/resume` - Resume cancelled subscription
- `GET /api/subscriptions/invoices` - Get invoice history

### 3. Webhook Handling

**Webhooks Needed:**
- `POST /api/webhooks/stripe` - Stripe events
- `POST /api/webhooks/razorpay` - Razorpay events

**Events to Handle:**
- `subscription.created`
- `subscription.updated`
- `subscription.cancelled`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `customer.subscription.deleted`

---

## 💻 Implementation Plan

### Phase 1: Payment Provider Setup

**Tasks:**
1. Choose payment provider (Stripe/Razorpay)
2. Create account and get API keys
3. Set up test environment
4. Configure webhooks

**Environment Variables:**
```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OR Razorpay
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
```

### Phase 2: Database Migration

**Tasks:**
1. Add subscription-related fields to User model
2. Create Subscription model
3. Create PaymentMethod model
4. Create Invoice model
5. Run migration
6. Update existing users

### Phase 3: API Implementation

**Tasks:**
1. Create subscription creation endpoint
2. Implement payment processing
3. Create webhook handlers
4. Implement subscription management endpoints
5. Add invoice generation

### Phase 4: Frontend Integration

**Tasks:**
1. Update billing page with payment form
2. Integrate payment provider SDK
3. Add subscription status display
4. Implement plan change flow
5. Add invoice download

### Phase 5: Testing

**Tasks:**
1. Test subscription creation
2. Test payment processing
3. Test webhook handling
4. Test subscription cancellation
5. Test invoice generation

---

## 📝 API Endpoints Specification

### Create Subscription
```typescript
POST /api/subscriptions/create
Body: {
  plan: 'Pro' | 'Enterprise',
  paymentMethodId: string,
  coupon?: string
}

Response: {
  success: boolean,
  subscription: {
    id: string,
    status: string,
    currentPeriodEnd: string
  }
}
```

### Get Current Subscription
```typescript
GET /api/subscriptions/current?userId=xxx

Response: {
  subscription: {
    id: string,
    plan: string,
    status: string,
    currentPeriodStart: string,
    currentPeriodEnd: string,
    cancelAtPeriodEnd: boolean
  },
  paymentMethod: {
    type: string,
    last4: string,
    brand: string
  }
}
```

### Cancel Subscription
```typescript
POST /api/subscriptions/cancel
Body: {
  subscriptionId: string,
  cancelAtPeriodEnd: boolean
}

Response: {
  success: boolean,
  message: string
}
```

### Get Invoices
```typescript
GET /api/subscriptions/invoices?userId=xxx

Response: {
  invoices: [
    {
      id: string,
      amount: number,
      currency: string,
      status: string,
      paidAt: string,
      pdfUrl: string
    }
  ]
}
```

---

## 🔐 Security Considerations

### Payment Data
- ❌ **Never store full card details**
- ✅ Store only payment method tokens
- ✅ Use payment provider's secure storage
- ✅ PCI compliance handled by provider

### Webhook Security
- ✅ Verify webhook signatures
- ✅ Validate webhook payloads
- ✅ Idempotent webhook handling
- ✅ Rate limiting on webhook endpoints

### Subscription Updates
- ✅ Verify user ownership
- ✅ Validate subscription status
- ✅ Prevent concurrent updates
- ✅ Log all subscription changes

---

## 📊 Current vs Recommended

| Feature | Current | Recommended |
|---------|---------|-------------|
| Payment Processing | ❌ None | ✅ Stripe/Razorpay |
| Subscription Tracking | ❌ Plan only | ✅ Full lifecycle |
| Payment Methods | ❌ Mock only | ✅ Secure storage |
| Invoice Generation | ❌ Mock only | ✅ Real invoices |
| Billing History | ❌ Mock data | ✅ Real data |
| Webhooks | ❌ None | ✅ Event handling |
| Trial Periods | ❌ None | ✅ Configurable |
| Cancellation | ❌ Instant | ✅ End of period |
| Refunds | ❌ None | ✅ Manual/automatic |

---

## 🎯 Implementation Priority

### Critical (Must Have)
1. ✅ Choose payment provider
2. ✅ Database schema migration
3. ✅ Payment processing integration
4. ✅ Subscription creation
5. ✅ Webhook handling

### High Priority
6. ⚠️ Invoice generation
7. ⚠️ Subscription cancellation
8. ⚠️ Payment method management
9. ⚠️ Billing history

### Medium Priority
10. Trial periods
11. Coupon codes
12. Usage-based billing
13. Proration handling
14. Refund management

### Nice to Have
15. Multiple payment methods
16. Payment retry logic
17. Dunning management
18. Subscription analytics

---

## 🧪 Testing Checklist

### Payment Processing
- [ ] Test subscription creation
- [ ] Test payment method addition
- [ ] Test payment failure handling
- [ ] Test subscription upgrade
- [ ] Test subscription downgrade
- [ ] Test subscription cancellation
- [ ] Test subscription renewal

### Webhooks
- [ ] Test subscription.created
- [ ] Test subscription.updated
- [ ] Test subscription.cancelled
- [ ] Test invoice.payment_succeeded
- [ ] Test invoice.payment_failed
- [ ] Test webhook signature verification

### Edge Cases
- [ ] Test concurrent subscription updates
- [ ] Test expired payment methods
- [ ] Test failed payment recovery
- [ ] Test subscription reactivation
- [ ] Test proration on upgrades

---

## 📚 References

**Current Implementation:**
- `src/app/profile/billing/page.tsx`
- `src/utils/planLimits.ts`
- `src/app/api/users/route.ts`

**Payment Provider Docs:**
- Stripe: https://stripe.com/docs/billing
- Razorpay: https://razorpay.com/docs/subscriptions/

**Next Steps:**
1. Review payment provider options
2. Decide on Stripe vs Razorpay
3. Set up test accounts
4. Plan database migration
5. Begin API implementation

---

## 💡 Recommendations

### For MVP Submission
1. **Option A:** Keep current free tier model
   - All users get Enterprise plan free
   - Add payment UI but mark as "Coming Soon"
   - Focus on core features first

2. **Option B:** Implement basic payment
   - Choose Razorpay (better for India)
   - Implement subscription creation
   - Basic invoice generation
   - Manual subscription management

### For Full Production
1. Implement complete payment system
2. Full subscription lifecycle
3. Automated billing
4. Invoice generation
5. Payment method management
6. Webhook handling
7. Refund processing

---

**Decision Required:**
- Which payment provider? (Stripe/Razorpay/Hybrid)
- Free tier strategy? (Current vs Paid)
- Timeline for payment implementation?
- Priority: Payment vs Security fixes?

