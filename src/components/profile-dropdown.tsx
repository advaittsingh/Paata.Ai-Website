"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Avatar, Button } from '@material-tailwind/react';
import { 
  UserIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon,
  ChevronDownIcon 
} from '@heroicons/react/24/outline';
import { useUser } from '@/contexts/UserContext';
import Link from 'next/link';

interface ProfileDropdownProps {
  user: {
    name: string;
    email: string;
    avatar: string;
    plan: string;
  };
}

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
  const { logout } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <Button
        variant="text"
        className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Avatar
          src={user.avatar}
          alt={user.name}
          size="sm"
          className="border-2 border-white shadow-lg"
        />
        <ChevronDownIcon className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Avatar
                src={user.avatar}
                alt={user.name}
                size="md"
                className="border-2 border-gray-200"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                  {user.plan} Plan
                </span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              <UserIcon className="w-5 h-5 text-gray-400" />
              <span>Profile</span>
            </Link>

            <Link
              href="/profile/settings"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              <Cog6ToothIcon className="w-5 h-5 text-gray-400" />
              <span>Settings</span>
            </Link>

            <div className="border-t border-gray-100 my-2"></div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors duration-200"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 text-red-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

