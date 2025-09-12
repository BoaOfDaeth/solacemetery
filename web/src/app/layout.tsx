import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import SearchForm from '@/components/SearchForm';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Solace MUD Stats',
  description: 'Player statistics and combat records for Solace MUD',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Modern Navigation */}
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo/Brand */}
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">S</span>
                </div>
                <span className="font-semibold text-foreground hidden sm:block">Solace Stats</span>
              </Link>
              
              {/* Navigation Links */}
              <div className="flex items-center space-x-1">
                <Link
                  href="/pvp"
                  className="relative px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-md hover:bg-accent/50"
                >
                  <span className="relative z-10">PVP</span>
                </Link>
                <Link
                  href="/mvp"
                  className="relative px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-md hover:bg-accent/50"
                >
                  <span className="relative z-10">MVP</span>
                </Link>
              </div>
              
              {/* Search */}
              <div className="flex items-center">
                <SearchForm />
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
