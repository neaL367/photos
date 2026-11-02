import type { Metadata } from "next";
import { GeistSerifRegular } from "geist/font/serif/regular";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Frames",
    template: "%s — Frames",
  },
  description: "A personal photo archive.",
  authors: [{ name: "neal367", url: "https://neal367.vercel.app/" }],
  creator: "neal367",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${GeistSerifRegular.variable} h-full`}>
      <body className="min-h-full bg-background text-foreground antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
        >
          Skip to content
        </a>

        <div className="mx-auto flex min-h-dvh w-full max-w-[1120px] flex-col px-5 sm:px-8 lg:px-12">
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
