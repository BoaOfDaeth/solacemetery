import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image';
import SearchForm from '@/components/SearchForm';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import logoImage from '@/public/images/logo.png';
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
  const navigationItems = [
    {
      label: 'Overview',
      href: '/',
    },
    {
      label: 'Player kills',
      href: '/pvp',
    },
    {
      label: 'Mob kills',
      href: '/mvp',
    },
    {
      label: 'Classes',
      href: '/classes',
    },
    {
      label: 'Races',
      href: '/races',
    },
    {
      label: 'Help articles',
      href: '/help',
    },
  ];

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* Original Header with Search */}
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
            <div className="flex items-center justify-between h-14 sm:h-16">
              {/* Logo/Brand */}
              <Link
                href="/"
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200 flex-shrink-0"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden flex items-center justify-center">
                  <Image
                    src={logoImage}
                    alt="Solace MUD Logo"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-semibold text-foreground hidden md:block text-sm sm:text-base">
                  Solace MUD Stats
                </span>
              </Link>

              {/* Search - Takes remaining space */}
              <div className="flex items-center flex-1 max-w-xs sm:max-w-sm lg:max-w-md ml-2 sm:ml-4">
                <SearchForm />
              </div>
            </div>
          </div>
        </nav>

        {/* Navigation Bar - Desktop only */}
        <div className="hidden lg:block border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Navigation items={navigationItems} variant="header" />
        </div>

        {/* Floating Mobile Menu Button */}
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
          <Navigation items={navigationItems} variant="floating" />
        </div>

        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
