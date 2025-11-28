import type { Metadata } from 'next';
import { Geist, Geist_Mono, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import StoreProvider from '@/components/StoreProvider';
import SWRProvider from '@/components/SWRProvider';
import Toolbar from '@/components/Toolbar';
import { getServerUser } from '@/lib/auth-server';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Solabase',
  description: 'Solabase',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getServerUser();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <StoreProvider>
          <SWRProvider>
            <Toolbar user={user} />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
              {children}
            </div>
          </SWRProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
