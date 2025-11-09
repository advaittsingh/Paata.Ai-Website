'use client';

import { Typography } from '@material-tailwind/react';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Typography variant="h2" className="mb-8">Refund Policy</Typography>
        <div className="prose max-w-none">
          <Typography variant="h4" className="mt-6 mb-4">1. Refund Eligibility</Typography>
          <Typography className="mb-4">
            PAATA.AI offers refunds for subscription purchases under the following conditions:
          </Typography>
          <ul className="list-disc pl-6 mb-4">
            <li>Refund requests must be made within 14 days of purchase</li>
            <li>The subscription must not have been used extensively</li>
            <li>Refunds are not available for partially used subscription periods</li>
          </ul>

          <Typography variant="h4" className="mt-6 mb-4">2. How to Request a Refund</Typography>
          <Typography className="mb-4">
            To request a refund, please contact our support team at support@paataai.com with:
          </Typography>
          <ul className="list-disc pl-6 mb-4">
            <li>Your account email address</li>
            <li>Invoice number or transaction ID</li>
            <li>Reason for the refund request</li>
          </ul>

          <Typography variant="h4" className="mt-6 mb-4">3. Processing Time</Typography>
          <Typography className="mb-4">
            Refund requests are typically processed within 5-7 business days. Once approved, the refund will be credited to your original payment method within 10-14 business days.
          </Typography>

          <Typography variant="h4" className="mt-6 mb-4">4. Non-Refundable Items</Typography>
          <Typography className="mb-4">
            The following are not eligible for refunds:
          </Typography>
          <ul className="list-disc pl-6 mb-4">
            <li>Subscriptions that have been active for more than 14 days</li>
            <li>One-time purchases or add-ons</li>
            <li>Subscriptions cancelled after the billing period has ended</li>
          </ul>

          <Typography variant="h4" className="mt-6 mb-4">5. Cancellation</Typography>
          <Typography className="mb-4">
            You may cancel your subscription at any time. Cancellation will take effect at the end of your current billing period. You will continue to have access to premium features until the end of the paid period.
          </Typography>

          <Typography variant="h4" className="mt-6 mb-4">6. Chargebacks</Typography>
          <Typography className="mb-4">
            If you initiate a chargeback or dispute a charge, your account may be suspended. We encourage you to contact us first to resolve any issues.
          </Typography>

          <Typography variant="h4" className="mt-6 mb-4">7. Special Circumstances</Typography>
          <Typography className="mb-4">
            Refunds may be considered on a case-by-case basis for:
          </Typography>
          <ul className="list-disc pl-6 mb-4">
            <li>Technical issues that prevent use of the service</li>
            <li>Billing errors</li>
            <li>Duplicate charges</li>
          </ul>

          <Typography variant="h4" className="mt-6 mb-4">8. Contact Information</Typography>
          <Typography className="mb-4">
            For refund inquiries, please contact us at support@paataai.com or through your account dashboard.
          </Typography>

          <Typography className="mt-8 text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </div>
      </div>
    </div>
  );
}





