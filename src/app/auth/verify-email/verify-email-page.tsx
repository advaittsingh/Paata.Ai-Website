'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button, Card, CardBody, Typography } from '@material-tailwind/react';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'idle'>('loading');
  const [email, setEmail] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (success === 'true') {
      setStatus('success');
    } else if (error) {
      setStatus('error');
    } else {
      setStatus('idle');
    }
  }, [searchParams]);

  const handleResend = async () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    setResending(true);
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      alert(data.message || 'Verification email sent!');
    } catch (error) {
      alert('Failed to send verification email. Please try again.');
    } finally {
      setResending(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardBody className="text-center p-8">
            <Typography variant="h5" className="mb-4">Verifying email...</Typography>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardBody className="p-8">
          {status === 'success' ? (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <Typography variant="h4" className="mb-2">Email Verified!</Typography>
                <Typography color="gray" className="mb-6">
                  Your email has been successfully verified. You can now use all features of PAATA.AI.
                </Typography>
                <Button onClick={() => router.push('/app')} className="w-full">
                  Go to Dashboard
                </Button>
              </div>
            </>
          ) : status === 'error' ? (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <Typography variant="h4" className="mb-2">Verification Failed</Typography>
                <Typography color="gray" className="mb-6">
                  The verification link is invalid or has expired. Please request a new verification email.
                </Typography>
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <Button onClick={handleResend} disabled={resending} className="w-full">
                    {resending ? 'Sending...' : 'Resend Verification Email'}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <Typography variant="h4" className="mb-2">Verify Your Email</Typography>
                <Typography color="gray" className="mb-6">
                  Please check your email and click the verification link, or request a new one below.
                </Typography>
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <Button onClick={handleResend} disabled={resending} className="w-full">
                    {resending ? 'Sending...' : 'Send Verification Email'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

