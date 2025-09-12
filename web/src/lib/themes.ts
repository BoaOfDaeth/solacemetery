export interface Theme {
  name: string;
  displayName: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    ring: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const themes: Record<string, Theme> = {
  light: {
    name: 'light',
    displayName: 'Light',
    colors: {
      background: '#fafafa',
      foreground: '#0f172a',
      card: '#ffffff',
      cardForeground: '#0f172a',
      popover: '#ffffff',
      popoverForeground: '#0f172a',
      primary: '#3b82f6',
      primaryForeground: '#ffffff',
      secondary: '#f1f5f9',
      secondaryForeground: '#0f172a',
      muted: '#f8fafc',
      mutedForeground: '#64748b',
      accent: '#f1f5f9',
      accentForeground: '#0f172a',
      destructive: '#ef4444',
      destructiveForeground: '#ffffff',
      border: '#e2e8f0',
      input: '#e2e8f0',
      ring: '#3b82f6',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      accent: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
  },
  dark: {
    name: 'dark',
    displayName: 'Dark',
    colors: {
      background: '#0a0a0a',
      foreground: '#fafafa',
      card: '#111827',
      cardForeground: '#fafafa',
      popover: '#111827',
      popoverForeground: '#fafafa',
      primary: '#60a5fa',
      primaryForeground: '#0f172a',
      secondary: '#1f2937',
      secondaryForeground: '#fafafa',
      muted: '#1f2937',
      mutedForeground: '#9ca3af',
      accent: '#1f2937',
      accentForeground: '#fafafa',
      destructive: '#f87171',
      destructiveForeground: '#0f172a',
      border: '#374151',
      input: '#374151',
      ring: '#60a5fa',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      accent: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
  },
  solace: {
    name: 'solace',
    displayName: 'Solace',
    colors: {
      background: '#1a1a1a',
      foreground: '#e5e5e5',
      card: '#2a2a2a',
      cardForeground: '#e5e5e5',
      popover: '#2a2a2a',
      popoverForeground: '#e5e5e5',
      primary: '#d4af37',
      primaryForeground: '#1a1a1a',
      secondary: '#3a3a3a',
      secondaryForeground: '#e5e5e5',
      muted: '#3a3a3a',
      mutedForeground: '#a3a3a3',
      accent: '#3a3a3a',
      accentForeground: '#e5e5e5',
      destructive: '#dc2626',
      destructiveForeground: '#e5e5e5',
      border: '#4a4a4a',
      input: '#4a4a4a',
      ring: '#d4af37',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)',
      secondary: 'linear-gradient(135deg, #fbbf24 0%, #d4af37 100%)',
      accent: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    },
  },
};

export const defaultTheme = 'solace';

export function applyTheme(themeName: string) {
  const theme = themes[themeName] || themes[defaultTheme];
  
  const root = document.documentElement;
  
  // Apply color variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    root.style.setProperty(cssVar, value);
  });
  
  // Apply gradient variables
  Object.entries(theme.gradients).forEach(([key, value]) => {
    const cssVar = `--gradient-${key}`;
    root.style.setProperty(cssVar, value);
  });
  
  // Store theme preference
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', themeName);
  }
}

export function getStoredTheme(): string {
  if (typeof window === 'undefined') return defaultTheme;
  return localStorage.getItem('theme') || defaultTheme;
}

export function getSystemTheme(): string {
  if (typeof window === 'undefined') return defaultTheme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
