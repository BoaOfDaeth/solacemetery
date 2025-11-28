'use client';

import { SWRConfig } from 'swr';

// Enhanced fetcher with proper error handling and cookie support
const fetcher = async (url: string) => {
  const res = await fetch(url, {
    credentials: 'include', // Include cookies for authentication
  });

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object
    (error as { info?: unknown; status?: number }).info = await res
      .json()
      .catch(() => ({}));
    (error as { info?: unknown; status?: number }).status = res.status;
    throw error;
  }

  return res.json();
};

export default function SWRProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        dedupingInterval: 2000,
        errorRetryCount: 3,
        errorRetryInterval: 1000,
        shouldRetryOnError: error => {
          // Don't retry on 4xx errors (client errors)
          if (error.status >= 400 && error.status < 500) {
            return false;
          }
          // Retry on 5xx errors (server errors) and network errors
          return true;
        },
        onError: (error, key) => {
          // Global error handler - could send to logging service
          console.error('SWR Error:', { error, key });
        },
        onSuccess: (data, key) => {
          // Global success handler - could send analytics
          console.log('SWR Success:', {
            key,
            dataLength: data?.data?.items?.length || 0,
          });
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
