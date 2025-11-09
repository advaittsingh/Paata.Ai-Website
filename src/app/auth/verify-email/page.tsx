import { Suspense } from 'react';
import VerifyEmailPage from './verify-email-page';

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 relative flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <VerifyEmailPage />
    </Suspense>
  );
}
