"use client";

import { useState } from 'react';
import { Navbar } from '@/components';
import { useUser } from '@/contexts/UserContext';
import Link from 'next/link';

export default function LoginPage() {
  const userContext = useUser();
  const login = userContext?.login;
  
  if (!login) {
    console.error('Login function not available from UserContext');
    return <div>Loading...</div>;
  }
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Login form submitted', { email: formData.email, hasPassword: !!formData.password });
    setIsLoading(true);
    setError('');

    try {
      // Validate form
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        setIsLoading(false);
        return;
      }

      console.log('Calling login function...');
      // Login with database
      const result = await login(formData.email, formData.password);
      console.log('Login result:', result);
      
      if (result.success) {
        console.log('Login successful, redirecting...');
        // Redirect to home page
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        console.error('Login failed:', result.error);
        setError(result.error || 'Login failed. Please check your credentials.');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.message || 'Network error. Please check your connection and try again.');
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 relative flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 py-4">
        <div className="w-full max-w-md relative z-10">
          {/* Logo and Title */}
          <div className="text-center mb-4">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-900 to-gray-800 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">P</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              Welcome back
            </h3>
            <p className="text-sm text-gray-600 opacity-80">
              Sign in to your PAATA.AI account
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-xl shadow-2xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 pb-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl font-bold text-white">P</span>
                </div>
                <h4 className="text-xl font-bold mb-1">
                  Welcome Back
                </h4>
                <p className="text-xs opacity-90">
                  Sign in to continue your learning journey
                </p>
              </div>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="Enter your email"
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
                      placeholder="Enter your password"
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
                </div>

                {/* Remember Me and Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-3.5 h-3.5 text-gray-900 bg-gray-100 border-gray-300 rounded focus:ring-gray-900"
                    />
                    <label className="ml-1.5 text-xs text-gray-900">
                      Remember me
                    </label>
                  </div>
                  <Link href="/auth/forgot-password" className="text-xs text-gray-900 hover:underline font-semibold transition-colors duration-200">
                    Forgot password?
                  </Link>
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
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-3">
            <p className="text-xs text-gray-600 opacity-80">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-gray-900 font-semibold hover:underline">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
