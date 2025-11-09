"use client";

import { useState, useEffect } from 'react';
import { Navbar } from '@/components';
import { FocusMode } from '@/components/focus-mode';
import { Typography, IconButton } from '@material-tailwind/react';
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import LoadingSkeleton from '@/components/loading-skeleton';
import AppSidebar from '@/components/app-sidebar';

export default function FocusPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen bg-gray-50 overflow-hidden flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-white pt-20">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              {!sidebarOpen && (
                <IconButton variant="text" color="gray" size="sm" onClick={() => setSidebarOpen(true)} className="lg:hidden">
                  <Bars3Icon className="w-5 h-5" />
                </IconButton>
              )}
              <Typography variant="h5" color="blue-gray" className="font-bold">Focus Mode</Typography>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-12">
              <FocusMode />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
