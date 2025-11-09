import { NextRequest } from 'next/server';

// Simple in-memory rate limiter
// For production, consider using Redis or a dedicated rate limiting service

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5; // 5 attempts per window

/**
 * Get client identifier from request
 */
function getClientId(request: NextRequest): string {
  // Try to get IP address
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  
  // Also consider user agent for additional uniqueness
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  return `${ip}-${userAgent}`;
}

/**
 * Check if request is rate limited
 * Returns { allowed: true } if allowed, { allowed: false, retryAfter: seconds } if rate limited
 */
export function checkRateLimit(request: NextRequest, endpoint: string = 'default'): {
  allowed: boolean;
  retryAfter?: number;
} {
  const clientId = `${getClientId(request)}-${endpoint}`;
  const now = Date.now();
  
  // Clean up old entries (simple cleanup)
  if (rateLimitStore.size > 10000) {
    // Clear all entries if store gets too large
    rateLimitStore.clear();
  }
  
  const entry = rateLimitStore.get(clientId);
  
  if (!entry) {
    // First request, allow it
    rateLimitStore.set(clientId, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true };
  }
  
  // Check if window has expired
  if (now > entry.resetTime) {
    // Reset window
    rateLimitStore.set(clientId, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true };
  }
  
  // Check if limit exceeded
  if (entry.count >= MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }
  
  // Increment count
  entry.count++;
  rateLimitStore.set(clientId, entry);
  
  return { allowed: true };
}

/**
 * Clear rate limit for a client (useful after successful login)
 */
export function clearRateLimit(request: NextRequest, endpoint: string = 'default'): void {
  const clientId = `${getClientId(request)}-${endpoint}`;
  rateLimitStore.delete(clientId);
}

