"use client";

import { useState } from 'react';
import { Navbar } from '@/components';
import { useUser } from '@/contexts/UserContext';
import Link from 'next/link';
import Image from 'next/image';

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
  const { signup } = useUser();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeNewsletter: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (!formData.agreeToTerms) {
        setError('You must agree to the Terms of Service and Privacy Policy');
        return;
      }

      // Validate form
      if (formData.firstName && formData.lastName && formData.email && formData.password) {
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
        const result = await signup(newUserData);
        
        if (result.success) {
          // Redirect to home page
          window.location.href = '/';
        } else {
          setError(result.error || 'Signup failed. Please try again.');
        }
      } else {
        setError('Please fill in all required fields');
      }
    } catch (err) {
      setError('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const strength = passwordStrength(formData.password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar />
      
      <div className="flex items-center justify-center min-h-screen px-4 py-8 pt-24">
        <div className="w-full max-w-md relative z-10">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-[#612A74]">P</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              Join PAATA.AI
            </h3>
            <p className="text-gray-600 opacity-80">
              Start your AI-powered learning journey today
            </p>
          </div>

          {/* Signup Form */}
          <div className="bg-white rounded-xl shadow-2xl border-0 overflow-hidden animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <div className="bg-gradient-to-r from-[#612A74] to-[#8B5CF6] text-white p-8 pb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">P</span>
                </div>
                <h4 className="text-2xl font-bold mb-2">
                  Create Account
                </h4>
                <p className="text-sm opacity-90">
                  Join thousands of students learning with AI
                </p>
              </div>
            </div>
            
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6 relative">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      First name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-[#612A74] focus:ring-2 focus:ring-purple-100 transition-all duration-200 group-hover:border-gray-400"
                      required
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Last name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-[#612A74] focus:ring-2 focus:ring-purple-100 transition-all duration-200 group-hover:border-gray-400"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-[#612A74] focus:ring-2 focus:ring-purple-100 transition-all duration-200 group-hover:border-gray-400"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a strong password"
                      className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg focus:border-[#612A74] focus:ring-2 focus:ring-purple-100 transition-all duration-200 group-hover:border-gray-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2 relative z-20">
                      <div className="flex space-x-1 mb-1">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full ${
                              i < strength ? strengthColors[strength - 1] : 'bg-gray-200'
                            }`}
                          ></div>
                        ))}
                      </div>
                      <p className="text-right text-sm text-gray-600">
                        Strength: <span className={`font-semibold ${strengthColors[strength - 1].replace('bg-', 'text-')}`}>{strengthLabels[strength - 1]}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg focus:border-[#612A74] focus:ring-2 focus:ring-purple-100 transition-all duration-200 group-hover:border-gray-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  {/* Password Match Indicator */}
                  {formData.confirmPassword && (
                    <div className="mt-2 flex items-center relative z-20">
                      {formData.password === formData.confirmPassword ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-green-500 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          <p className="text-sm text-green-600">
                            Passwords match
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-red-600">
                          Passwords do not match
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Terms and Newsletter */}
                <div className="space-y-4">
                  <div className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 mt-1"
                    />
                    <p className="ml-3 text-sm text-gray-700 leading-relaxed">
                      I agree to the{' '}
                      <Link href="/terms" className="text-[#612A74] hover:underline font-semibold transition-colors duration-200">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-[#612A74] hover:underline font-semibold transition-colors duration-200">
                        Privacy Policy
                      </Link>
                    </p>
                  </div>
                  
                  <div className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                    <input
                      type="checkbox"
                      name="subscribeNewsletter"
                      checked={formData.subscribeNewsletter}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 mt-1"
                    />
                    <p className="ml-3 text-sm text-gray-700 leading-relaxed">
                      Send me updates about new features and educational content
                    </p>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <p className="text-sm text-red-600 font-medium">
                        {error}
                      </p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#612A74] to-[#8B5CF6] hover:from-[#4a1f5c] hover:to-[#7C3AED] text-white py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Social Signup Buttons */}
                <div className="space-y-3">
                  <button
                    type="button"
                    className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center"
                  >
                    <Image
                      src="/logos/logo-google.svg"
                      alt="Google"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    Continue with Google
                  </button>
                  
                  <button
                    type="button"
                    className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center"
                  >
                    <Image
                      src="/logos/logo-apple.png"
                      alt="Apple"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    Continue with Apple
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600 opacity-80">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-[#612A74] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}