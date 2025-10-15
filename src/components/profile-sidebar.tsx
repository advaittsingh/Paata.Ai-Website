"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  UserIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface ProfileSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  user: {
    name: string;
    email: string;
    avatar?: string;
    plan: string;
  };
}

export default function ProfileSidebar({ isCollapsed, onToggle, user }: ProfileSidebarProps) {
  const pathname = usePathname();

  const navigationItems = [
    {
      name: 'Profile',
      href: '/profile',
      icon: UserIcon,
      description: 'Personal information'
    },
    {
      name: 'Billing',
      href: '/profile/billing',
      icon: CreditCardIcon,
      description: 'Subscription & payments'
    },
    {
      name: 'Usage',
      href: '/profile/usage',
      icon: ChartBarIcon,
      description: 'Usage statistics'
    },
    {
      name: 'Settings',
      href: '/profile/settings',
      icon: Cog6ToothIcon,
      description: 'Preferences & privacy'
    },
    {
      name: 'Security',
      href: '/profile/security',
      icon: ShieldCheckIcon,
      description: 'Password & security'
    },
  ];

  const isActive = (href: string) => {
    if (href === '/profile') {
      return pathname === '/profile';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 relative z-20 ${
      isCollapsed ? 'w-16' : 'w-64'
    } hidden lg:block`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#612A74] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                PAATA.AI
              </h1>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              {user.avatar && user.avatar.trim() !== "" ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-lg font-semibold text-gray-600">
                  {user.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                {user.email}
              </p>
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                user.plan === 'Enterprise' 
                  ? 'bg-purple-100 text-purple-800'
                  : user.plan === 'Pro'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {user.plan}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    active
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-purple-700' : 'text-gray-500'}`} />
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-gray-200 mt-auto">
        <button className="flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full">
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          {!isCollapsed && (
            <span className="text-sm font-medium">Sign Out</span>
          )}
        </button>
      </div>
    </div>
  );
}