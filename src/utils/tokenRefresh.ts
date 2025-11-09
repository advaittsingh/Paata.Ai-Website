/**
 * Token Refresh Utility
 * Handles automatic token refresh when access token expires
 */

/**
 * Refresh access token using refresh token
 */
export async function refreshToken(): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    // Get refresh token from cookie (it's httpOnly, so we need to use the API)
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}), // Refresh token is in cookie
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, token: data.accessToken };
    } else {
      const error = await response.json();
      return { success: false, error: error.error || 'Token refresh failed' };
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    return { success: false, error: 'Network error during token refresh' };
  }
}

/**
 * Fetch with automatic token refresh on 401
 */
export async function fetchWithRefresh(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Make initial request
  let response = await fetch(url, {
    ...options,
    credentials: 'include',
  });

  // If we get a 401, try to refresh token and retry
  if (response.status === 401) {
    const refreshResult = await refreshToken();
    
    if (refreshResult.success) {
      // Retry the original request
      response = await fetch(url, {
        ...options,
        credentials: 'include',
      });
    } else {
      // Refresh failed, redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      throw new Error('Authentication failed');
    }
  }

  return response;
}

