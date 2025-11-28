'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { mutate } from 'swr';
import type { AuthUser } from '@/lib/auth';

interface AuthButtonProps {
  user: AuthUser | null;
}

export default function AuthButton({ user }: AuthButtonProps) {
  const router = useRouter();
  const isAuthenticated = user !== null;

  const handleLogin = () => {
    window.location.href = '/api/auth/discord';
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      // Invalidate all SWR cache entries that match /api/search pattern
      mutate(
        key => typeof key === 'string' && key.startsWith('/api/search'),
        undefined,
        { revalidate: true }
      );
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isAuthenticated && user) {
    return (
      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 w-24 h-10 text-white hover:bg-gray-700 rounded transition-colors cursor-pointer select-none"
        title="Logout"
      >
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt={user.username}
            width={20}
            height={20}
            className="rounded-full"
          />
        ) : (
          <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center text-xs text-white">
            {user.username.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-sm">Logout</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="flex items-center justify-center w-24 h-10 text-white rounded hover:bg-gray-700 transition-colors cursor-pointer select-none"
      title="Login with Discord"
    >
      <span className="text-sm">Login</span>
    </button>
  );
}
