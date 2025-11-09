"use client";

import { useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Typography, IconButton } from '@material-tailwind/react';
import { XMarkIcon, ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { usePathname } from 'next/navigation';

interface AppSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  children?: ReactNode;
}

export default function AppSidebar({ sidebarOpen, setSidebarOpen, children }: AppSidebarProps) {
  const pathname = usePathname();
  const [smartLearningOpen, setSmartLearningOpen] = useState(true);

  const isActive = (path: string) => {
    if (path === '/app') {
      return pathname === '/app';
    }
    return pathname.startsWith(path);
  };

  const smartLearningItems = [
    { href: '/app', icon: 'fa-comments', label: 'Chat' },
    { href: '/app/notes', icon: 'fa-sticky-note', label: 'Notes' },
    { href: '/app/flashcards', icon: 'fa-lightbulb', label: 'Flashcards' },
    { href: '/app/mindmaps', icon: 'fa-diagram-project', label: 'Mind Maps' },
    { href: '/app/exam', icon: 'fa-clipboard-check', label: 'Exam Mode' },
    { href: '/app/focus', icon: 'fa-brain', label: 'Focus Mode' },
    { href: '/app/progress', icon: 'fa-chart-line', label: 'Progress' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'w-64' : 'w-0'} 
        lg:relative lg:z-auto
        fixed lg:static
        top-0 left-0
        h-full lg:h-auto
        z-50
        transition-all duration-300 ease-in-out 
        bg-gray-900 
        flex flex-col 
        overflow-hidden 
        shadow-xl
      `}>
        {/* Sidebar Header */}
        <div className={`pb-4 px-4 bg-gray-900 ${children ? 'border-b border-gray-700' : ''} pt-4 flex-shrink-0`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div>
              <Typography variant="h6" color="white" className="font-bold text-lg">
                PAATA.AI
              </Typography>
              <Typography variant="small" color="gray" className="text-xs">
                Your AI Assistant
              </Typography>
            </div>
          </div>
          <IconButton
            variant="text"
            color="white"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden hover:bg-gray-700 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </IconButton>
        </div>

        {/* Navigation Menu */}
        <div className="space-y-1">
          {/* Smart Learning Section */}
          <div>
            <button
              onClick={() => setSmartLearningOpen(!smartLearningOpen)}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300"
            >
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-graduation-cap w-5"></i>
                <span className="text-sm font-semibold">Smart Learning</span>
              </div>
              {smartLearningOpen ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </button>
            
            {smartLearningOpen && (
              <div className="ml-4 mt-1 space-y-1">
                {smartLearningItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        // Close sidebar on mobile when link is clicked
                        if (window.innerWidth < 1024) {
                          setSidebarOpen(false);
                        }
                      }}
                      className={`flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200 ${
                        active
                          ? 'bg-gray-800 text-white shadow-md'
                          : 'hover:bg-gray-800 text-gray-300 hover:text-white'
                      }`}
                    >
                      <i className={`fa-solid ${item.icon} w-4 text-sm ${active ? 'text-white' : ''}`}></i>
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Optional children (e.g., chat sessions) */}
      {children && (
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          <div className="px-3 pb-4">
            {children}
          </div>
        </div>
      )}
      
      </div>
    </>
  );
}

