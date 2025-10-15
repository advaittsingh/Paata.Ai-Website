"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

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
    // Load user data from localStorage on mount
    if (typeof window !== 'undefined') {
      try {
        const savedUser = localStorage.getItem('paata_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          // Validate user object structure
          if (parsedUser && typeof parsedUser === 'object' && parsedUser.id && parsedUser.email) {
            setUser(parsedUser);
          } else {
            console.warn('Invalid user data in localStorage, clearing...');
            localStorage.removeItem('paata_user');
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        localStorage.removeItem('paata_user');
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
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
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
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
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const newUser = await response.json();
        setUser(newUser);
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('paata_user');
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
