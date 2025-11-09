'use client';

import { useState, useEffect } from 'react';

/**
 * React hook to get CSRF token
 * Fetches token from API and stores it in state
 */
export function useCsrfToken() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('/api/csrf-token', {
          method: 'GET',
          credentials: 'include', // Important: include cookies
        });

        if (!response.ok) {
          throw new Error('Failed to fetch CSRF token');
        }

        const data = await response.json();
        
        if (isMounted) {
          setCsrfToken(data.csrfToken);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching CSRF token:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          // Don't set token to null on error - allow graceful degradation
          // CSRF protection is optional in development
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCsrfToken();

    return () => {
      isMounted = false;
    };
  }, []);

  return { csrfToken, isLoading, error };
}

