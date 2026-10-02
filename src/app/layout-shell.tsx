"use client";

import Script from "next/script";
import type { ReactNode } from "react";
import { Providers } from "./provider";

export function LayoutShell({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-591DCCE51T"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-591DCCE51T');`}
      </Script>
      {children}
    </Providers>
  );
}