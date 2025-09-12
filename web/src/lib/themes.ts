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
  ocean: {
    name: 'ocean',
    displayName: 'Ocean',
    colors: {
      background: '#0c1821',
      foreground: '#e6f3ff',
      card: '#1a2a3a',
      cardForeground: '#e6f3ff',
      popover: '#1a2a3a',
      popoverForeground: '#e6f3ff',
      primary: '#0ea5e9',
      primaryForeground: '#ffffff',
      secondary: '#1e3a5f',
      secondaryForeground: '#e6f3ff',
      muted: '#1e3a5f',
      mutedForeground: '#94a3b8',
      accent: '#1e3a5f',
      accentForeground: '#e6f3ff',
      destructive: '#f87171',
      destructiveForeground: '#0f172a',
      border: '#334155',
      input: '#334155',
      ring: '#0ea5e9',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
      secondary: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      accent: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    },
  },
  forest: {
    name: 'forest',
    displayName: 'Forest',
    colors: {
      background: '#0f1b0f',
      foreground: '#f0fdf4',
      card: '#1a2e1a',
      cardForeground: '#f0fdf4',
      popover: '#1a2e1a',
      popoverForeground: '#f0fdf4',
      primary: '#22c55e',
      primaryForeground: '#ffffff',
      secondary: '#1e3a1e',
      secondaryForeground: '#f0fdf4',
      muted: '#1e3a1e',
      mutedForeground: '#9ca3af',
      accent: '#1e3a1e',
      accentForeground: '#f0fdf4',
      destructive: '#f87171',
      destructiveForeground: '#0f172a',
      border: '#365f36',
      input: '#365f36',
      ring: '#22c55e',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      secondary: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
      accent: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
  },
  sunset: {
    name: 'sunset',
    displayName: 'Sunset',
    colors: {
      background: '#1a0f0f',
      foreground: '#fef2f2',
      card: '#2e1a1a',
      cardForeground: '#fef2f2',
      popover: '#2e1a1a',
      popoverForeground: '#fef2f2',
      primary: '#f97316',
      primaryForeground: '#ffffff',
      secondary: '#3e1a1a',
      secondaryForeground: '#fef2f2',
      muted: '#3e1a1a',
      mutedForeground: '#d1d5db',
      accent: '#3e1a1a',
      accentForeground: '#fef2f2',
      destructive: '#f87171',
      destructiveForeground: '#0f172a',
      border: '#5a2a2a',
      input: '#5a2a2a',
      ring: '#f97316',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      secondary: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      accent: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    },
  },
  purple: {
    name: 'purple',
    displayName: 'Purple',
    colors: {
      background: '#1a0f1a',
      foreground: '#faf5ff',
      card: '#2e1a2e',
      cardForeground: '#faf5ff',
      popover: '#2e1a2e',
      popoverForeground: '#faf5ff',
      primary: '#a855f7',
      primaryForeground: '#ffffff',
      secondary: '#3e1a3e',
      secondaryForeground: '#faf5ff',
      muted: '#3e1a3e',
      mutedForeground: '#d1d5db',
      accent: '#3e1a3e',
      accentForeground: '#faf5ff',
      destructive: '#f87171',
      destructiveForeground: '#0f172a',
      border: '#5a2a5a',
      input: '#5a2a5a',
      ring: '#a855f7',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
      secondary: 'linear-gradient(135deg, #c084fc 0%, #a855f7 100%)',
      accent: 'linear-gradient(135deg, #e879f9 0%, #d946ef 100%)',
    },
  },
};

export const defaultTheme = themes.sunset.name;

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
