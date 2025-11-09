/**
 * Error Logging Utility
 * Centralized error logging with support for Sentry and console logging
 */

interface ErrorLogOptions {
  level?: 'error' | 'warning' | 'info' | 'debug';
  tags?: Record<string, string>;
  extra?: Record<string, any>;
  user?: {
    id?: string;
    email?: string;
  };
}

/**
 * Initialize error logging (Sentry)
 * Call this once in your app initialization
 */
export function initErrorLogging() {
  // Only initialize in production or if explicitly enabled
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    try {
      // Dynamic import to avoid bundling Sentry in development
      const Sentry = require('@sentry/nextjs');
      
      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        environment: process.env.NODE_ENV || 'production',
        tracesSampleRate: 1.0, // Adjust based on your needs (0.0 to 1.0)
        // Only capture errors in production
        beforeSend(event, hint) {
          // Filter out non-production errors if needed
          return event;
        },
      });

      console.log('✅ Error logging (Sentry) initialized');
      return true;
    } catch (error) {
      console.warn('Failed to initialize Sentry:', error);
      return false;
    }
  }
  
  console.log('ℹ️ Error logging initialized (console only)');
  return false;
}

/**
 * Log an error
 */
export function logError(error: Error | string, options: ErrorLogOptions = {}) {
  const {
    level = 'error',
    tags = {},
    extra = {},
    user,
  } = options;

  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error === 'string' ? undefined : error.stack;

  // Log to Sentry if available
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    try {
      const Sentry = (window as any).Sentry;
      
      if (user) {
        Sentry.setUser(user);
      }

      if (Object.keys(tags).length > 0) {
        Sentry.setTags(tags);
      }

      if (Object.keys(extra).length > 0) {
        Sentry.setExtras(extra);
      }

      Sentry.captureException(typeof error === 'string' ? new Error(error) : error, {
        level,
      });
    } catch (e) {
      console.error('Failed to log to Sentry:', e);
    }
  }

  // Always log to console for development
  if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.error(`[${level.toUpperCase()}]`, errorMessage, {
      error: errorStack,
      tags,
      extra,
      user,
    });
  }
}

/**
 * Log a warning
 */
export function logWarning(message: string, options: Omit<ErrorLogOptions, 'level'> = {}) {
  logError(new Error(message), { ...options, level: 'warning' });
}

/**
 * Log info
 */
export function logInfo(message: string, options: Omit<ErrorLogOptions, 'level'> = {}) {
  logError(new Error(message), { ...options, level: 'info' });
}

/**
 * Capture a message (non-error)
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    try {
      const Sentry = (window as any).Sentry;
      Sentry.captureMessage(message, level);
    } catch (e) {
      console.error('Failed to capture message to Sentry:', e);
    }
  }

  // Always log to console
  console[level === 'error' ? 'error' : level === 'warning' ? 'warn' : 'log'](message);
}

/**
 * Set user context for error tracking
 */
export function setUserContext(user: { id?: string; email?: string; username?: string }) {
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    try {
      const Sentry = (window as any).Sentry;
      Sentry.setUser(user);
    } catch (e) {
      console.error('Failed to set user context in Sentry:', e);
    }
  }
}

/**
 * Clear user context
 */
export function clearUserContext() {
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    try {
      const Sentry = (window as any).Sentry;
      Sentry.setUser(null);
    } catch (e) {
      console.error('Failed to clear user context in Sentry:', e);
    }
  }
}

/**
 * Add breadcrumb (for tracking user actions leading to errors)
 */
export function addBreadcrumb(message: string, category?: string, level: 'info' | 'warning' | 'error' = 'info') {
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    try {
      const Sentry = (window as any).Sentry;
      Sentry.addBreadcrumb({
        message,
        category: category || 'default',
        level,
        timestamp: Date.now() / 1000,
      });
    } catch (e) {
      console.error('Failed to add breadcrumb to Sentry:', e);
    }
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Breadcrumb] ${category || 'default'}:`, message);
  }
}

