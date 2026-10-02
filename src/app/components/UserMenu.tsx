"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { CurrentUserAvatar } from "@/app/components/Avatar";
import { getUserProfile, logout } from "@/lib/mockUser";

const itemClass =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-white/[0.04]";

// Drop this into the dashboard topbar (dashboard/layout.tsx).
export function UserMenu() {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const load = () => {
      const result = getUserProfile();
      if (result.success) {
        setName(result.data.fullName);
        setEmail(result.data.email);
      }
    };
    load();
    window.addEventListener("profile-changed", load);
    return () => window.removeEventListener("profile-changed", load);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function handleLogout() {
    setOpen(false);
    logout();
    router.push("/login");
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open user menu"
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-gray-50 dark:hover:bg-white/[0.04]"
      >
        <CurrentUserAvatar name={name || "?"} size="sm" />
        <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-60 origin-top-right animate-scale-in rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-white/[0.08] dark:bg-[#161b22]"
        >
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-100">{name}</p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">{email}</p>
          </div>
          <div className="my-1 border-t border-gray-200 dark:border-white/[0.08]" />
          <Link href="/dashboard/profile" role="menuitem" onClick={() => setOpen(false)} className={itemClass}>
            <User className="h-4 w-4" aria-hidden="true" />
            My profile
          </Link>
          <Link href="/dashboard/settings" role="menuitem" onClick={() => setOpen(false)} className={itemClass}>
            <Settings className="h-4 w-4" aria-hidden="true" />
            Settings
          </Link>
          <button type="button" role="menuitem" onClick={handleLogout} className={`${itemClass} text-red-600 dark:text-red-400`}>
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
