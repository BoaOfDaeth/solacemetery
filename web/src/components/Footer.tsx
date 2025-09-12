'use client';

import { useTheme } from './ThemeProvider';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';

const themeIcons: Record<string, string> = {
  light: 'tabler:sun',
  dark: 'tabler:moon',
  ocean: 'tabler:wave',
  forest: 'tabler:trees',
  sunset: 'tabler:sunset',
  purple: 'tabler:palette',
  solace: 'tabler:sword',
};

export default function Footer() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Always call useTheme hook to maintain hook order
  let currentTheme = 'solace';
  let setTheme = () => {};
  let availableThemes = {};
  
  try {
    const themeContext = useTheme();
    currentTheme = themeContext.currentTheme;
    setTheme = themeContext.setTheme;
    availableThemes = themeContext.availableThemes;
  } catch (error) {
    // Theme context not available during SSR
  }

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          {/* GitHub Link */}
          <a
            href="https://github.com/BoaOfDaeth/solacemetery"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
            title="View source code on GitHub"
          >
            <Icon icon="tabler:brand-github" className="w-5 h-5" />
            <span className="text-sm">GitHub</span>
          </a>
          
          {/* Theme Picker - Only show on client side */}
          {isClient && (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground">Theme:</span>
              <div className="flex items-center space-x-1">
                {Object.entries(availableThemes).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => setTheme(key)}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      currentTheme === key
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                    title={theme.displayName}
                    aria-label={`Switch to ${theme.displayName} theme`}
                  >
                    <Icon 
                      icon={themeIcons[key] || 'tabler:palette'} 
                      className="w-4 h-4" 
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
