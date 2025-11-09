/**
 * Admin utilities for checking admin access
 */

// List of admin emails (can be moved to environment variables or database)
const ADMIN_EMAILS = process.env.ADMIN_EMAILS 
  ? process.env.ADMIN_EMAILS.split(',').map(email => email.trim().toLowerCase())
  : ['admin@paata.ai']; // Default admin email

/**
 * Check if a user is an admin
 */
export function isAdmin(user: { email: string } | null): boolean {
  if (!user) return false;
  return ADMIN_EMAILS.includes(user.email.toLowerCase());
}

/**
 * Verify admin access from request
 */
export async function verifyAdmin(request: any): Promise<{ isAdmin: boolean; user: any; error: string | null }> {
  try {
    const { verifyAuth } = await import('./auth-middleware');
    const authResult = await verifyAuth(request);
    
    if (authResult.error || !authResult.user) {
      return { isAdmin: false, user: null, error: 'Authentication required' };
    }

    if (!isAdmin(authResult.user)) {
      return { isAdmin: false, user: authResult.user, error: 'Admin access required' };
    }

    return { isAdmin: true, user: authResult.user, error: null };
  } catch (error) {
    console.error('Admin verification error:', error);
    return { isAdmin: false, user: null, error: 'Admin verification failed' };
  }
}


