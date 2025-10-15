"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DocsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new documentation page
    router.replace('/documentation');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#612A74] mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to documentation...</p>
          </div>
        </div>
  );
}