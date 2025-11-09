"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UserIcon,
  CreditCardIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

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

export default function ProfileSidebar({
  isCollapsed,
  onToggle,
  user,
}: ProfileSidebarProps) {
  const pathname = usePathname();

  const navigationItems = [
    { name: "Profile", href: "/profile", icon: UserIcon },
    { name: "Billing", href: "/profile/billing", icon: CreditCardIcon },
    { name: "Usage", href: "/profile/usage", icon: ChartBarIcon },
    { name: "Security", href: "/profile/security", icon: ShieldCheckIcon },
  ];

  const isActive = (href: string) =>
    href === "/profile" ? pathname === "/profile" : pathname.startsWith(href);

  return (
    <aside
      className={`bg-white shadow-lg border-r border-gray-200 flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden hidden lg:flex
        ${isCollapsed ? "w-16" : "w-72"}`}
      style={{
        height: "calc(100vh - 80px)", // keeps it below navbar
        position: "relative",
        zIndex: 10,
      }}
    >
      {/* Header */}
      <header className="px-4 py-4 border-b border-gray-200 flex-shrink-0 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="flex items-center justify-between gap-2 w-full">
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <h1 className="text-xl font-semibold text-white truncate">
                  PAATA.AI
                </h1>
              </div>
              <button
                onClick={onToggle}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Collapse sidebar"
                type="button"
              >
                <ChevronLeftIcon className="w-5 h-5 text-white" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <button
                onClick={onToggle}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
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
            const active = isActive(item.href);

            return (
              <li key={item.name} className="w-full">
                <Link
                  href={item.href}
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
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
