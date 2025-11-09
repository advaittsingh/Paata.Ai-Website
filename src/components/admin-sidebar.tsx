"use client";

import { useState } from "react";
import {
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  HomeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function AdminSidebar({
  activeTab,
  onTabChange,
}: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    { name: "Overview", value: "overview", icon: HomeIcon },
    { name: "Users", value: "users", icon: UsersIcon },
    { name: "Analytics", value: "analytics", icon: ChartBarIcon },
    { name: "Billing", value: "billing", icon: CurrencyDollarIcon },
    { name: "Monitoring", value: "monitoring", icon: ShieldCheckIcon },
  ];

  return (
    <aside
      className={`bg-white shadow-lg border-r border-gray-200 flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden ${
        isCollapsed ? "w-16" : "w-72"
      } hidden lg:flex`}
      style={{
        height: "calc(100vh - 80px)",
        position: "sticky",
        top: "80px",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {/* Header */}
      <header className="px-4 py-4 border-b border-gray-200 flex-shrink-0 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="flex items-center justify-between gap-2 w-full">
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <h1 className="text-xl font-semibold text-white truncate">
                  Admin Panel
                </h1>
              </div>
              <button
                onClick={() => setIsCollapsed(true)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
                aria-label="Collapse sidebar"
                type="button"
              >
                <ChevronLeftIcon className="w-5 h-5 text-white" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <button
                onClick={() => setIsCollapsed(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
                aria-label="Expand sidebar"
                type="button"
              >
                <ChevronRightIcon className="w-5 h-5 text-white" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden bg-white w-full">
        <ul className="py-4 px-3 space-y-2 w-full">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.value;

            return (
              <li key={item.value} className="w-full">
                <button
                  onClick={() => onTabChange(item.value)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full ${
                    active
                      ? "bg-gray-100 text-gray-900 font-semibold shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      active ? "text-gray-900" : "text-gray-600"
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="text-sm font-medium truncate">
                      {item.name}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

