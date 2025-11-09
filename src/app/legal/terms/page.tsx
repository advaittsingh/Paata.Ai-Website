'use client';

import { Typography } from '@material-tailwind/react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Typography variant="h2" className="mb-8">Terms of Service</Typography>
        <div className="prose max-w-none">
          <Typography variant="h4" className="mt-6 mb-4">1. Acceptance of Terms</Typography>
          <Typography className="mb-4">
            By accessing and using PAATA.AI, you accept and agree to be bound by the terms and provision of this agreement.
          </Typography>

          <Typography variant="h4" className="mt-6 mb-4">2. Use License</Typography>
          <Typography className="mb-4">
            Permission is granted to temporarily use PAATA.AI for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </Typography>
          <ul className="list-disc pl-6 mb-4">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to decompile or reverse engineer any software contained on PAATA.AI</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
          </ul>

          <Typography variant="h4" className="mt-6 mb-4">3. User Accounts</Typography>
          <Typography className="mb-4">
            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
          </Typography>

          <Typography variant="h4" className="mt-6 mb-4">4. Subscription Plans</Typography>
          <Typography className="mb-4">
            PAATA.AI offers various subscription plans. By subscribing, you agree to pay the applicable fees. Subscriptions automatically renew unless cancelled.
          </Typography>

          <Typography variant="h4" className="mt-6 mb-4">5. Intellectual Property</Typography>
          <Typography className="mb-4">
            All content, features, and functionality of PAATA.AI are owned by PAATA.AI and are protected by international copyright, trademark, and other intellectual property laws.
          </Typography>

          <Typography variant="h4" className="mt-6 mb-4">6. Limitation of Liability</Typography>
          <Typography className="mb-4">
            PAATA.AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.
          </Typography>

          <Typography variant="h4" className="mt-6 mb-4">7. Changes to Terms</Typography>
          <Typography className="mb-4">
            PAATA.AI reserves the right to modify these terms at any time. We will notify users of any changes by posting the new Terms of Service on this page.
          </Typography>

          <Typography variant="h4" className="mt-6 mb-4">8. Contact Information</Typography>
          <Typography className="mb-4">
            If you have any questions about these Terms of Service, please contact us at support@paataai.com.
          </Typography>

          <Typography className="mt-8 text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </div>
      </div>
    </div>
  );
}





