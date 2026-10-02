"use client";

import { useEffect, useState } from "react";
import { getAvatar } from "@/lib/mockUser";

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-12 w-12 text-base",
  lg: "h-24 w-24 text-2xl",
} as const;

export type AvatarSize = keyof typeof SIZES;

export function getInitials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: AvatarSize;
  className?: string;
}

// Photo if there is one, otherwise the person's initials.
export function Avatar({ name, src, size = "md", className = "" }: AvatarProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-700 font-semibold text-white dark:bg-primary-350 dark:text-gray-900 ${SIZES[size]} ${className}`}
    >
      {src ? (
        <img src={src} alt={`${name}'s profile photo`} className="h-full w-full object-cover" />
      ) : (
        <span aria-hidden="true">{getInitials(name)}</span>
      )}
    </span>
  );
}

// Reads the saved photo and updates itself when it changes (topbar, profile header, etc.).
export function CurrentUserAvatar({ name, size, className }: Omit<AvatarProps, "src">) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const load = () => {
      const result = getAvatar();
      setSrc(result.success ? result.data : null);
    };
    load();
    window.addEventListener("avatar-changed", load);
    return () => window.removeEventListener("avatar-changed", load);
  }, []);

  return <Avatar name={name} src={src} size={size} className={className} />;
}
