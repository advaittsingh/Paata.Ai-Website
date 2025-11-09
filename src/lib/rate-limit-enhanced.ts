/**
 * Enhanced Rate Limiting Utility
 * Provides different rate limits for different endpoints
 */

import { NextRequest } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Different rate limits for different endpoints
const RATE_LIMITS: Record<string, { window: number; maxAttempts: number }> = {
  'login': { window: 15 * 60 * 1000, maxAttempts: 5 },
  'signup': { window: 15 * 60 * 1000, maxAttempts: 3 },
  'forgot-password': { window: 60 * 60 * 1000, maxAttempts: 3 }, // 1 hour
  'reset-password': { window: 60 * 60 * 1000, maxAttempts: 5 },
  'change-password': { window: 15 * 60 * 1000, maxAttempts: 5 },
  'chat': { window: 60 * 1000, maxAttempts: 30 }, // 30 requests per minute
  'exam-generate': { window: 60 * 1000, maxAttempts: 10 }, // 10 requests per minute
  'exam': { window: 60 * 1000, maxAttempts: 20 },
  'api-default': { window: 60 * 1000, maxAttempts: 60 }, // 60 requests per minute
};

/**
 * Get client identifier from request
 */
function getClientId(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  return `${ip}-${userAgent}`;
}

/**
 * Enhanced rate limit check with endpoint-specific limits
 */
export function checkRateLimitEnhanced(
  request: NextRequest,
  endpoint: string = 'api-default'
): {
  allowed: boolean;
  retryAfter?: number;
  remaining?: number;
} {
  const limits = RATE_LIMITS[endpoint] || RATE_LIMITS['api-default'];
  const clientId = `${getClientId(request)}-${endpoint}`;
  const now = Date.now();

  // Clean up old entries
  if (rateLimitStore.size > 10000) {
    rateLimitStore.clear();
  }

  const entry = rateLimitStore.get(clientId);

  if (!entry) {
    rateLimitStore.set(clientId, {
      count: 1,
      resetTime: now + limits.window,
    });
    return { allowed: true, remaining: limits.maxAttempts - 1 };
  }

  // Check if window has expired
  if (now > entry.resetTime) {
    rateLimitStore.set(clientId, {
      count: 1,
      resetTime: now + limits.window,
    });
    return { allowed: true, remaining: limits.maxAttempts - 1 };
  }

  // Check if limit exceeded
  if (entry.count >= limits.maxAttempts) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return { allowed: false, retryAfter, remaining: 0 };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(clientId, entry);

  return { allowed: true, remaining: limits.maxAttempts - entry.count };
}

/**
 * Clear rate limit for a client
 */
export function clearRateLimitEnhanced(request: NextRequest, endpoint: string = 'api-default'): void {
  const clientId = `${getClientId(request)}-${endpoint}`;
  rateLimitStore.delete(clientId);
}

