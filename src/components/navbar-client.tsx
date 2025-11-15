"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from "@/contexts/UserContext";
import Link from 'next/link';

export function NavbarClient() {
  const { user, isAuthenticated, logout } = useUser();
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      // Navigation handled in logout function
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if logout fails
      window.location.href = '/';
    }
  };

  // Check admin status
  useEffect(() => {
    if (isAuthenticated && user) {
      fetch('/api/admin/check', {
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => {
          setIsAdmin(data.isAdmin || false);
        })
        .catch(() => setIsAdmin(false));
    } else {
      setIsAdmin(false);
    }
  }, [isAuthenticated, user]);

  return (
    <nav 
      className="fixed top-0 left-0 right-0 w-full py-4 shadow-md rounded-none px-4 bg-blue-gray-500 text-white z-50 border-0 bg-gradient-to-r from-gray-900 to-gray-800" 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        width: '100%',
        zIndex: 50
      }}
    >
      <div className="container mx-auto flex items-center justify-between max-w-7xl">
        <Link href="/" className="block antialiased tracking-normal font-sans text-white font-bold text-xl">
          PAATA.AI
        </Link>
        
        <ul className="ml-10 hidden items-center gap-6 lg:flex text-white">
          <li>
            <Link href="/" className="block antialiased font-sans text-sm leading-normal font-medium text-white hover:text-gray-300 transition-colors duration-200">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="block antialiased font-sans text-sm leading-normal font-medium text-white hover:text-gray-300 transition-colors duration-200">
              About Us
            </Link>
          </li>
          <li>
            <Link href="/pricing" className="block antialiased font-sans text-sm leading-normal font-medium text-white hover:text-gray-300 transition-colors duration-200">
              Pricing
            </Link>
          </li>
          <li>
            <Link href="/learning" className="block antialiased font-sans text-sm leading-normal font-medium text-white hover:text-gray-300 transition-colors duration-200">
              Learning
            </Link>
          </li>
          {isAuthenticated && (
            <>
              <li>
                <Link href="/help" className="block antialiased font-sans text-sm leading-normal font-medium text-white hover:text-gray-300 transition-colors duration-200">
                  Help
                </Link>
              </li>
              <li>
                <Link href="/notifications" className="block antialiased font-sans text-sm leading-normal font-medium text-white hover:text-gray-300 transition-colors duration-200">
                  Notifications
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="hidden gap-2 lg:flex lg:items-center">
          {isAuthenticated ? (
            <>
              <Link href="/app">
                <button className="align-middle select-none font-sans font-bold text-center uppercase disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-4 rounded-lg border hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-200">
                  Try Now
                </button>
              </Link>
              <div className="relative group">
                <button className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors duration-200">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden">
                    {user?.avatar && user.avatar.trim() !== "" ? (
                      <img
                        src={user.avatar}
                        alt={user.firstName || 'User'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold text-gray-900">
                        {user?.firstName?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium">{user?.firstName || 'User'}</span>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="px-2 py-1">
                    <p className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</p>
                  </div>
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  <Link href="/profile/billing" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Billing
                  </Link>
                  <Link href="/profile/usage" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Usage
                  </Link>
                  <Link href="/profile/security" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Security
                  </Link>
                  <hr className="my-2" />
                  <Link href="/notifications" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Notifications
                  </Link>
                  <Link href="/help" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Help & Support
                  </Link>
                         {isAdmin && (
                           <>
                             <hr className="my-2" />
                             <Link href="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-semibold">
                               🔐 Admin Panel
                             </Link>
                           </>
                         )}
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <button className="align-middle select-none font-sans font-bold text-center uppercase disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-4 rounded-lg active:bg-gray-900/20 text-white hover:bg-gray-700 transition-colors">
                  Sign In
                </button>
              </Link>
              <Link href="/auth/signup">
                <button className="align-middle select-none font-sans font-bold text-center uppercase disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-4 rounded-lg bg-gray-900 shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none hover:bg-gray-800 text-white border-0 shadow-lg transition-all duration-200 transform hover:scale-105">
                  Get Started
                </button>
              </Link>
            </>
          )}
        </div>

        <button
          className="relative align-middle select-none font-sans font-medium text-center uppercase disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-white active:bg-white/30 ml-auto inline-block lg:hidden hover:bg-gray-700 transition-colors"
          onClick={() => setOpen(!open)}
        >
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path>
            </svg>
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`block w-full basis-full overflow-hidden transition-all duration-300 ${open ? 'h-auto' : 'h-0'}`}>
        <div className="container mx-auto mt-4 rounded-lg border-t border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-5">
          <ul className="flex flex-col gap-4 text-white">
            <li>
              <Link href="/" className="block antialiased font-sans text-sm leading-normal font-medium text-white hover:text-gray-300 transition-colors duration-200">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="block antialiased font-sans text-sm leading-normal font-medium text-white hover:text-gray-300 transition-colors duration-200">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="block antialiased font-sans text-sm leading-normal font-medium text-white hover:text-gray-300 transition-colors duration-200">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/learning" className="block antialiased font-sans text-sm leading-normal font-medium text-white hover:text-gray-300 transition-colors duration-200">
                Learning
              </Link>
            </li>
            {isAuthenticated && (
              <>
                <li>
                  <p className="block antialiased font-sans text-xs leading-normal font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-2">
                    Smart Learning
                  </p>
                </li>
                <li>
                  <Link href="/app" className="block antialiased font-sans text-sm leading-normal font-medium text-white hover:text-gray-300 transition-colors duration-200">
                    💬 Chat
                  </Link>
                </li>
                <li>
                  <Link href="/app/notes" className="block antialiased font-sans text-sm leading-normal font-medium text-white hover:text-gray-300 transition-colors duration-200">
                    📝 Notes
                  </Link>
                </li>
                <li>
                  <Link href="/app/flashcards" className="block antialiased font-sans text-sm leading-normal font-medium text-white hover:text-gray-300 transition-colors duration-200">
                    💡 Flashcards
                  </Link>
                </li>
                <li>
                  <Link href="/app/mindmaps" className="block antialiased font-sans text-sm leading-normal font-medium text-white hover:text-gray-300 transition-colors duration-200">
                    🗺️ Mind Maps
                  </Link>
                </li>
                <li>
                  <Link href="/app/exam" className="block antialiased font-sans text-sm leading-normal font-medium text-white hover:text-gray-300 transition-colors duration-200">
                    📋 Exam Mode
                  </Link>
                </li>
                <li>
                  <Link href="/app/focus" className="block antialiased font-sans text-sm leading-normal font-medium text-white hover:text-gray-300 transition-colors duration-200">
                    🧠 Focus Mode
                  </Link>
                </li>
                <li>
                  <Link href="/app/progress" className="block antialiased font-sans text-sm leading-normal font-medium text-white hover:text-gray-300 transition-colors duration-200">
                    📊 Progress
                  </Link>
                </li>
                <li className="mt-4">
                  <p className="block antialiased font-sans text-xs leading-normal font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Account
                  </p>
                </li>
                <li>
                  <Link href="/profile" className="block antialiased font-sans text-sm leading-normal font-medium text-white hover:text-gray-300 transition-colors duration-200">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link href="/profile/billing" className="block antialiased font-sans text-sm leading-normal font-medium text-white hover:text-gray-300 transition-colors duration-200">
                    Billing
                  </Link>
                </li>
                <li>
                  <Link href="/profile/usage" className="block antialiased font-sans text-sm leading-normal font-medium text-white hover:text-gray-300 transition-colors duration-200">
                    Usage
                  </Link>
                </li>
                <li>
                  <Link href="/profile/security" className="block antialiased font-sans text-sm leading-normal font-medium text-white hover:text-gray-300 transition-colors duration-200">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="block antialiased font-sans text-sm leading-normal font-medium text-white hover:text-gray-300 transition-colors duration-200">
                    Help
                  </Link>
                </li>
                <li>
                  <Link href="/notifications" className="block antialiased font-sans text-sm leading-normal font-medium text-white hover:text-gray-300 transition-colors duration-200">
                    Notifications
                  </Link>
                </li>
                       {isAdmin && (
                         <li>
                           <Link href="/admin/dashboard" className="block antialiased font-sans text-sm leading-normal font-medium text-white hover:text-gray-300 transition-colors duration-200 font-semibold">
                             🔐 Admin Panel
                           </Link>
                         </li>
                       )}
              </>
            )}
          </ul>
          
          <div className="mt-4 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <Link href="/app">
                  <button className="align-middle select-none font-sans font-bold text-center uppercase disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-4 rounded-lg active:bg-gray-900/20 w-full text-white hover:bg-gray-700 transition-colors">
                    Try Now
                  </button>
                </Link>
                <Link href="/profile">
                  <button className="align-middle select-none font-sans font-bold text-center uppercase disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-4 rounded-lg bg-gray-900 shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none w-full hover:bg-gray-800 text-white border-0 shadow-lg transition-all duration-200">
                    Profile
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="align-middle select-none font-sans font-bold text-center uppercase disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-4 rounded-lg border hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] w-full border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <button className="align-middle select-none font-sans font-bold text-center uppercase disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-4 rounded-lg active:bg-gray-900/20 w-full text-white hover:bg-gray-700 transition-colors">
                    Sign In
                  </button>
                </Link>
                <Link href="/auth/signup">
                  <button className="align-middle select-none font-sans font-bold text-center uppercase disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-4 rounded-lg bg-gray-900 shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none w-full hover:bg-gray-800 text-white border-0 shadow-lg transition-all duration-200">
                    Get Started
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}



