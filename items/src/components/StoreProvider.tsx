'use client';

import { useEffect, useState } from 'react';

interface StoreProviderProps {
  children: React.ReactNode;
}

export default function StoreProvider({ children }: StoreProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated after component mounts
    setIsHydrated(true);
  }, []);

  // Don't render children until hydrated
  if (!isHydrated) {
    return null;
  }

  return <>{children}</>;
}
