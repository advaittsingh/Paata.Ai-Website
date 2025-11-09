"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { setUserContext, clearUserContext } from '@/lib/error-logging';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string;
  plan: 'Basic' | 'Pro' | 'Enterprise';
  joinDate: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      weeklyDigest: boolean;
      marketing: boolean;
    };
    learning: {
      difficultyLevel: 'beginner' | 'intermediate' | 'advanced' | 'adaptive';
      learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
      subjectFocus: string[];
    };
  };
  stats: {
    totalInteractions: number;
    textMessages: number;
    imageUploads: number;
    voiceInputs: number;
    totalTimeSpent: string;
    averageSessionTime: string;
    streakDays: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => Promise<{ success: boolean; user?: User; error?: string }>;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  signup: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verify authentication on mount using cookie
    const verifyAuth = async () => {
      if (typeof window !== 'undefined') {
        try {
          // First, try to load from localStorage for faster initial render
          const savedUser = localStorage.getItem('paata_user');
          if (savedUser) {
            try {
              const parsedUser = JSON.parse(savedUser);
              if (parsedUser && typeof parsedUser === 'object' && parsedUser.id && parsedUser.email) {
                setUser(parsedUser); // Set immediately for faster UI
              }
            } catch (e) {
              // Invalid localStorage data, clear it
              localStorage.removeItem('paata_user');
            }
          }

          // Verify with server (cookie-based auth)
          let response = await fetch('/api/auth/verify', {
            method: 'GET',
            credentials: 'include', // Include cookies
          });

          // If 401, try to refresh token
          if (response.status === 401) {
            const { refreshToken } = await import('@/utils/tokenRefresh');
            const refreshResult = await refreshToken();
            
            if (refreshResult.success) {
              // Retry verification
              response = await fetch('/api/auth/verify', {
                method: 'GET',
                credentials: 'include',
              });
            }
          }

          if (response.ok) {
            const data = await response.json();
            if (data.authenticated && data.user) {
              setUser(data.user);
              // Set user context for error logging
              setUserContext({
                id: data.user.id,
                email: data.user.email,
              });
              // Cache in localStorage for faster subsequent loads
              localStorage.setItem('paata_user', JSON.stringify(data.user));
            } else {
              // Not authenticated, clear any cached data
              setUser(null);
              clearUserContext();
              localStorage.removeItem('paata_user');
            }
          } else {
            // Auth verification failed, clear cached data
            setUser(null);
            clearUserContext();
            localStorage.removeItem('paata_user');
          }
        } catch (error) {
          console.error('Error verifying auth:', error);
          // On error, keep localStorage data if it exists (for offline scenarios)
          // but still mark as loaded
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      try {
        const response = await fetch('/api/users', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: user.id, ...updates }),
        });

        if (response.ok) {
          const updatedUser = await response.json();
          setUser(updatedUser);
          localStorage.setItem('paata_user', JSON.stringify(updatedUser));
          return { success: true, user: updatedUser };
        } else {
          const error = await response.json();
          return { success: false, error: error.error || 'Failed to update user' };
        }
      } catch (error) {
        console.error('Update user error:', error);
        // Fallback: update locally if API fails
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('paata_user', JSON.stringify(updatedUser));
        return { success: true, user: updatedUser };
      }
    }
    return { success: false, error: 'No user logged in' };
  };

  const login = async (email: string, password: string) => {
    try {
      // Clear any existing user data first
      setUser(null);
      localStorage.removeItem('paata_user');
      
      // Get CSRF token
      let csrfToken: string | null = null;
      try {
        const csrfResponse = await fetch('/api/csrf-token', {
          method: 'GET',
          credentials: 'include',
        });
        if (csrfResponse.ok) {
          const csrfData = await csrfResponse.json();
          csrfToken = csrfData.csrfToken;
        }
      } catch (e) {
        // CSRF token fetch failed, continue without it (graceful degradation)
        console.warn('Failed to fetch CSRF token:', e);
      }
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify({ 
          email, 
          password,
          ...(csrfToken && { csrfToken }),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Response format: { user: {...}, message: "..." }
        const userData = data.user || data; // Support both formats for backward compatibility
        setUser(userData);
        // Set user context for error logging
        setUserContext({
          id: userData.id,
          email: userData.email,
        });
        localStorage.setItem('paata_user', JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        const error = await response.json();
        return { success: false, error: error.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please check your connection and try again.' };
    }
  };

  const signup = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Get CSRF token
      let csrfToken: string | null = null;
      try {
        const csrfResponse = await fetch('/api/csrf-token', {
          method: 'GET',
          credentials: 'include',
        });
        if (csrfResponse.ok) {
          const csrfData = await csrfResponse.json();
          csrfToken = csrfData.csrfToken;
        }
      } catch (e) {
        // CSRF token fetch failed, continue without it (graceful degradation)
        console.warn('Failed to fetch CSRF token:', e);
      }
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify({
          ...userData,
          ...(csrfToken && { csrfToken }),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Response format: { user: {...}, message: "..." }
        const newUser = data.user || data; // Support both formats for backward compatibility
        setUser(newUser);
        // Set user context for error logging
        setUserContext({
          id: newUser.id,
          email: newUser.email,
        });
        localStorage.setItem('paata_user', JSON.stringify(newUser));
        return { success: true, user: newUser };
      } else {
        const error = await response.json();
        return { success: false, error: error.error || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Network error. Please check your connection and try again.' };
    }
  };

  const logout = async () => {
    try {
      // Call logout API to clear server-side session
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Include cookies
      });
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with client-side cleanup even if API fails
    } finally {
      // Clear client-side state
      setUser(null);
      clearUserContext();
      localStorage.removeItem('paata_user');
    }
  };

  const value: UserContextType = {
    user,
    setUser,
    updateUser,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
