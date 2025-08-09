import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers"; // This import is now correct
// apps/web/app/layout.tsx
import "./globals.css"; // <- not "./../globals.css"

import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Personalized Discovery App",
  description: "Discover NFTs, products, and media tailored to you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <header className="px-4 lg:px-6 h-14 flex items-center border-b">
              <Link href="/" className="flex items-center justify-center">
                <span className="text-lg font-semibold">Discovery</span>
              </Link>
              <nav className="ml-auto flex gap-4 sm:gap-6">
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="/saved">
                  Saved
                </Link>
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="/admin">
                  Admin
                </Link>
              </nav>
            </header>
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}