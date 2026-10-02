"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { UserMenu } from "@/app/components/UserMenu";
import {
  Home,
  BookOpen,
  FileQuestion,
  Download,
  BarChart3,
  Menu,
  Sun,
  Moon,
  Bell,
  X,
} from "lucide-react";
import { useTheme } from "@/app/provider";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Subjects", href: "/dashboard/subjects", icon: BookOpen },
  { label: "Quizzes", href: "/dashboard/quizzes", icon: FileQuestion },
  { label: "Downloads", href: "/dashboard/downloads", icon: Download },
  { label: "Progress", href: "/dashboard/progress", icon: BarChart3 },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const hasUnreadNotifications = true; // mock — replace with real check later

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0d1117]">
      {/* Sidebar — desktop */}
      <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white p-7 dark:border-white/[0.08] dark:bg-[#161b22] md:flex">
        <div className="mb-6 flex items-center gap-2 px-2">
          <Image
            src="/Mkv_Logo.png"
            alt="MK Volunteers"
            width={150}
            height={120}
            className="rounded-md"
          />
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition ${
                  active
                    ? "bg-primary-50 font-semibold text-primary-700 dark:bg-white/[0.08] dark:text-primary-350"
                    : "text-gray-700 hover:bg-primary-50 hover:text-primary-700 dark:text-gray-300 dark:hover:bg-white/[0.05] dark:hover:text-primary-350"
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Sidebar — mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 animate-fade-in bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 animate-slide-in-left bg-white p-4 shadow-lg dark:bg-[#161b22]">
            <div className="flex items-center justify-between px-2 pb-6 pt-4">
              <Image
                src="/Mkv_logo.png"
                alt="MK Volunteers"
                width={160}
                height={70}
                className="object-contain"
                priority
              />
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Close menu"
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition ${
                      active
                        ? "bg-primary-50 font-semibold text-primary-700 dark:bg-white/[0.08] dark:text-primary-350"
                        : "text-gray-700 hover:bg-primary-50 hover:text-primary-700 dark:text-gray-300 dark:hover:bg-white/[0.05] dark:hover:text-primary-350"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-white/[0.08] dark:bg-[#161b22] md:px-6">
          <button
            className="text-gray-600 dark:text-gray-300 md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="text-gray-600 transition hover:text-primary-700 dark:text-gray-300 dark:hover:text-primary-350"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notification bell */}
            <button
              onClick={() => router.push("/dashboard/notifications")}
              className="relative text-gray-600 transition hover:text-primary-700 dark:text-gray-300 dark:hover:text-primary-350"
              aria-label="View notifications"
            >
              <Bell size={20} />
              {hasUnreadNotifications && (
                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>

            {/* Profile dropdown */}
            <UserMenu />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 animate-fade-in p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}