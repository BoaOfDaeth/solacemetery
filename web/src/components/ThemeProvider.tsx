'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { themes, defaultTheme, applyTheme, getStoredTheme, getSystemTheme, type Theme } from '@/lib/themes';

interface ThemeContextType {
  currentTheme: string;
  setTheme: (themeName: string) => void;
  availableThemes: Record<string, Theme>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<string>(defaultTheme);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Use the configured default theme
    setCurrentTheme(defaultTheme);
    applyTheme(defaultTheme);
    setIsLoaded(true);
  }, []);

  const setTheme = (themeName: string) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      applyTheme(themeName);
    }
  };

  // Prevent hydration mismatch by not rendering until theme is loaded
  if (!isLoaded) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, availableThemes: themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
