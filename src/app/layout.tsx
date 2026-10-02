
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { LayoutShell } from "./layout-shell";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "MK Volunteers Portal",
  description: "Student, Volunteer, and Admin portal for MK Volunteers",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className={`${figtree.variable} antialiased`}>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}