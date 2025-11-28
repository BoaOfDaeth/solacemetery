'use client';

import useSWR from 'swr';

interface AuthUser {
  userId: string;
  discordId: string;
  username: string;
  avatar: string | null;
  isAdmin: boolean;
}

interface AuthResponse {
  authenticated: boolean;
  user?: AuthUser;
}

const fetcher = async (url: string): Promise<AuthResponse> => {
  const res = await fetch(url, {
    credentials: 'include',
  });

  if (!res.ok) {
    return { authenticated: false };
  }

  return res.json();
};

export function useAuth() {
  const { data, error, isLoading, mutate } = useSWR<AuthResponse>(
    '/api/auth/me',
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
    }
  );

  return {
    user: data?.authenticated ? data.user : null,
    isAuthenticated: data?.authenticated ?? false,
    isAdmin: data?.authenticated && data.user?.isAdmin ? true : false,
    isLoading,
    error,
    mutate,
  };
}
