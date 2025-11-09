'use client';

import { Typography } from '@material-tailwind/react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Typography variant="h2" className="mb-8">Privacy Policy</Typography>
        <div className="prose max-w-none">
          <Typography variant="h4" className="mt-6 mb-4">1. Information We Collect</Typography>
          <Typography className="mb-4">
            We collect information that you provide directly to us, including:
          </Typography>
          <ul className="list-disc pl-6 mb-4">
            <li>Name, email address, and contact information</li>
            <li>Account credentials and profile information</li>
            <li>Usage data and learning progress</li>
            <li>Payment information (processed securely through third-party providers)</li>
          </ul>

          <Typography variant="h4" className="mt-6 mb-4">2. How We Use Your Information</Typography>
          <Typography className="mb-4">
            We use the information we collect to:
          </Typography>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send technical notices, updates, and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Monitor and analyze usage patterns</li>
          </ul>

          <Typography variant="h4" className="mt-6 mb-4">3. Information Sharing</Typography>
          <Typography className="mb-4">
            We do not sell, trade, or rent your personal information to third parties. We may share your information only:
          </Typography>
          <ul className="list-disc pl-6 mb-4">
            <li>With your consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and safety</li>
            <li>With service providers who assist in our operations</li>
          </ul>

          <Typography variant="h4" className="mt-6 mb-4">4. Data Security</Typography>
          <Typography className="mb-4">
            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </Typography>

          <Typography variant="h4" className="mt-6 mb-4">5. Data Retention</Typography>
          <Typography className="mb-4">
            We retain your personal information for as long as necessary to provide our services and comply with legal obligations.
          </Typography>

          <Typography variant="h4" className="mt-6 mb-4">6. Your Rights</Typography>
          <Typography className="mb-4">
            You have the right to:
          </Typography>
          <ul className="list-disc pl-6 mb-4">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
          </ul>

          <Typography variant="h4" className="mt-6 mb-4">7. Cookies</Typography>
          <Typography className="mb-4">
            We use cookies and similar technologies to enhance your experience, analyze usage, and assist with marketing efforts.
          </Typography>

          <Typography variant="h4" className="mt-6 mb-4">8. Children's Privacy</Typography>
          <Typography className="mb-4">
            PAATA.AI is not intended for children under 13. We do not knowingly collect personal information from children under 13.
          </Typography>

          <Typography variant="h4" className="mt-6 mb-4">9. Changes to This Policy</Typography>
          <Typography className="mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
          </Typography>

          <Typography variant="h4" className="mt-6 mb-4">10. Contact Us</Typography>
          <Typography className="mb-4">
            If you have questions about this Privacy Policy, please contact us at privacy@paataai.com.
          </Typography>

          <Typography className="mt-8 text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </div>
      </div>
    </div>
  );
}





