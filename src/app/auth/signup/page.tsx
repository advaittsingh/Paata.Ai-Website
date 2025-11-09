"use client";

import { useState } from 'react';
import { Navbar } from '@/components';
import { useUser } from '@/contexts/UserContext';
import Link from 'next/link';

// Helper function for password strength
const passwordStrength = (password: string) => {
  let strength = 0;
  if (password.length > 5) strength++;
  if (password.length > 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
};

export default function SignupPage() {
  const userContext = useUser();
  const signup = userContext?.signup;
  
  if (!signup) {
    console.error('Signup function not available from UserContext');
    return <div>Loading...</div>;
  }
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeNewsletter: false,
    class: '',
    board: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    setFormData(prev => ({
      ...prev,
      [target.name]: target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Signup form submitted', formData);
    setIsLoading(true);
    setError('');

    try {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }
      if (!formData.agreeToTerms) {
        setError('You must agree to the Terms of Service and Privacy Policy');
        setIsLoading(false);
        return;
      }

      // Validate form
      if (formData.firstName && formData.lastName && formData.email && formData.password && formData.class && formData.board) {
        console.log('Form validated, creating user...');
        // Create user object with real data
        const newUserData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: '',
          bio: 'New PAATA.AI user',
          location: '',
          website: '',
          avatar: '/image/avatar1.jpg',
          plan: 'Enterprise' as const,
          joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          preferences: {
            theme: 'system' as const,
            language: 'en',
            notifications: {
              email: true,
              push: true,
              weeklyDigest: formData.subscribeNewsletter,
              marketing: formData.subscribeNewsletter,
            },
            learning: {
              difficultyLevel: 'adaptive' as const,
              learningStyle: 'mixed' as const,
              subjectFocus: [],
              class: formData.class || '1',
              board: formData.board || 'CBSE',
            },
          },
          stats: {
            totalInteractions: 0,
            textMessages: 0,
            imageUploads: 0,
            voiceInputs: 0,
            totalTimeSpent: '0h 0m',
            averageSessionTime: '0m 0s',
            streakDays: 0,
          },
        };

        // Sign up with database
        console.log('Calling signup function...');
        const result = await signup(newUserData);
        console.log('Signup result:', result);
        
        if (result.success) {
          console.log('Signup successful, redirecting...');
          // Redirect to home page
          window.location.href = '/';
        } else {
          console.error('Signup failed:', result.error);
          setError(result.error || 'Signup failed. Please try again.');
          setIsLoading(false);
        }
      } else {
        setError('Please fill in all required fields');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err?.message || 'Signup failed. Please try again.');
      setIsLoading(false);
    }
  };

  const strength = passwordStrength(formData.password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  // Ensure strength is within valid range (0-4 for array indices)
  const safeStrength = Math.max(0, Math.min(4, strength));

  return (
    <div className="min-h-screen bg-gray-50 relative flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 py-4 overflow-y-auto">
        <div className="w-full max-w-md relative z-10 my-auto">
          {/* Logo and Title */}
          <div className="text-center mb-4">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-900 to-gray-800 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">P</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              Join PAATA.AI
            </h3>
            <p className="text-sm text-gray-600 opacity-80">
              Start your AI-powered learning journey today
            </p>
          </div>

          {/* Signup Form */}
          <div className="bg-white rounded-xl shadow-2xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 pb-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl font-bold text-white">P</span>
                </div>
                <h4 className="text-xl font-bold mb-1">
                  Create Account
                </h4>
                <p className="text-xs opacity-90">
                  Join thousands of students learning with AI
                </p>
              </div>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-3 relative">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="group">
                    <label className="block text-xs font-semibold text-gray-900 mb-1">
                      First name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-200 transition-all duration-200 group-hover:border-gray-400"
                      required
                    />
                  </div>
                  <div className="group">
                    <label className="block text-xs font-semibold text-gray-900 mb-1">
                      Last name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-200 transition-all duration-200 group-hover:border-gray-400"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="group">
                  <label className="block text-xs font-semibold text-gray-900 mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-200 transition-all duration-200 group-hover:border-gray-400"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="group">
                  <label className="block text-xs font-semibold text-gray-900 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a strong password"
                      className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-200 transition-all duration-200 group-hover:border-gray-400"
                      required
                    />
                    <span
                      onClick={() => {
                        console.log('Password toggle clicked, current state:', showPassword);
                        setShowPassword(!showPassword);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer select-none z-10"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setShowPassword(!showPassword);
                        }
                      }}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-500 hover:text-gray-700">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-500 hover:text-gray-700">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </span>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-1 relative z-20">
                      <div className="flex space-x-1 mb-0.5">
                        {[0, 1, 2, 3, 4].map((i) => {
                          const shouldColor = i < safeStrength + 1;
                          const colorIndex = safeStrength;
                          return (
                            <div
                              key={i}
                              className={`h-0.5 flex-1 rounded-full ${
                                shouldColor && strengthColors[colorIndex] ? strengthColors[colorIndex] : 'bg-gray-200'
                              }`}
                            ></div>
                          );
                        })}
                      </div>
                      <p className="text-right text-xs text-gray-600">
                        Strength: <span className={`font-semibold ${strengthColors[safeStrength]?.replace('bg-', 'text-') || 'text-gray-600'}`}>{strengthLabels[safeStrength] || 'Very Weak'}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="group">
                  <label className="block text-xs font-semibold text-gray-900 mb-1">
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-200 transition-all duration-200 group-hover:border-gray-400"
                      required
                    />
                    <span
                      onClick={() => {
                        console.log('Confirm password toggle clicked, current state:', showConfirmPassword);
                        setShowConfirmPassword(!showConfirmPassword);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer select-none z-10"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setShowConfirmPassword(!showConfirmPassword);
                        }
                      }}
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-500 hover:text-gray-700">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-500 hover:text-gray-700">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </span>
                  </div>
                  
                  {/* Password Match Indicator */}
                  {formData.confirmPassword && (
                    <div className="mt-1 flex items-center relative z-20">
                      {formData.password === formData.confirmPassword ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 text-green-500 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          <p className="text-xs text-green-600">
                            Passwords match
                          </p>
                        </>
                      ) : (
                        <p className="text-xs text-red-600">
                          Passwords do not match
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Class and Board Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="group">
                    <label className="block text-xs font-semibold text-gray-900 mb-1">
                      Class <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="class"
                      name="class"
                      value={formData.class}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-200 transition-all duration-200 group-hover:border-gray-400"
                    >
                      <option value="">Select Class</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((cls) => (
                        <option key={cls} value={cls.toString()}>
                          Class {cls}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="group">
                    <label className="block text-xs font-semibold text-gray-900 mb-1">
                      Board <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="board"
                      name="board"
                      value={formData.board}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-200 transition-all duration-200 group-hover:border-gray-400"
                    >
                      <option value="">Select Board</option>
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE">ICSE</option>
                      <option value="State Board">State Board</option>
                      <option value="IGCSE">IGCSE</option>
                      <option value="IB">IB</option>
                    </select>
                  </div>
                </div>

                {/* Terms and Newsletter */}
                <div className="space-y-2">
                  <div className="flex items-start p-2.5 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="w-3.5 h-3.5 text-gray-900 bg-gray-100 border-gray-300 rounded focus:ring-gray-900 mt-0.5 flex-shrink-0"
                    />
                    <p className="ml-2 text-xs text-gray-700 leading-relaxed">
                      I agree to the{' '}
                      <Link href="/terms" className="text-gray-900 hover:underline font-semibold transition-colors duration-200">
                        Terms
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-gray-900 hover:underline font-semibold transition-colors duration-200">
                        Privacy Policy
                      </Link>
                    </p>
                  </div>
                  
                  <div className="flex items-start p-2.5 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                    <input
                      type="checkbox"
                      name="subscribeNewsletter"
                      checked={formData.subscribeNewsletter}
                      onChange={handleInputChange}
                      className="w-3.5 h-3.5 text-gray-900 bg-gray-100 border-gray-300 rounded focus:ring-gray-900 mt-0.5 flex-shrink-0"
                    />
                    <p className="ml-2 text-xs text-gray-700 leading-relaxed">
                      Send me updates about new features
                    </p>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-2.5 h-2.5 text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <p className="text-xs text-red-600 font-medium">
                        {error}
                      </p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-gray-900/25 hover:shadow-xl hover:shadow-gray-900/30 transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center mt-3">
            <p className="text-xs text-gray-600 opacity-80">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-gray-900 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
