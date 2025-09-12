import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import SearchForm from '@/components/SearchForm';
import { ThemeProvider } from '@/components/ThemeProvider';
import Footer from '@/components/Footer';
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider>
          {/* Modern Navigation */}
          <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
              <div className="flex items-center justify-between h-14 sm:h-16">
                {/* Logo/Brand */}
                <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200 flex-shrink-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-xs sm:text-sm">S</span>
                  </div>
                  <span className="font-semibold text-foreground hidden md:block text-sm sm:text-base">Solace MUD Stats</span>
                </Link>
                
                {/* Center Navigation Links - Hidden on mobile */}
                <div className="hidden sm:flex items-center space-x-1">
                  <Link
                    href="/pvp"
                    className="relative px-2 sm:px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-md hover:bg-accent/50"
                  >
                    <span className="relative z-10">PVP</span>
                  </Link>
                  <Link
                    href="/mvp"
                    className="relative px-2 sm:px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-md hover:bg-accent/50"
                  >
                    <span className="relative z-10">MVP</span>
                  </Link>
                </div>
                
                {/* Search - Takes remaining space */}
                <div className="flex items-center flex-1 max-w-xs sm:max-w-sm lg:max-w-md ml-2 sm:ml-4">
                  <SearchForm />
                </div>
                
                {/* Mobile Navigation Links - Show on mobile */}
                <div className="flex sm:hidden items-center space-x-1 ml-2">
                  <Link
                    href="/pvp"
                    className="relative px-2 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-md hover:bg-accent/50"
                  >
                    <span className="relative z-10">PVP</span>
                  </Link>
                  <Link
                    href="/mvp"
                    className="relative px-2 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-md hover:bg-accent/50"
                  >
                    <span className="relative z-10">MVP</span>
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
