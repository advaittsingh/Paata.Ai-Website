/**
 * Next.js Instrumentation
 * This file runs once when the server starts
 * Use this to initialize error logging, analytics, etc.
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side initialization
    const { initErrorLogging } = await import('@/lib/error-logging');
    initErrorLogging();
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime initialization (if needed)
  }
}

