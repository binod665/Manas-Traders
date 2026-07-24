import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeSetting = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: ResolvedTheme; // Active theme applied to document
  themeSetting: ThemeSetting; // Stored user preference ('light' | 'dark' | 'system')
  toggleTheme: () => void;
  setThemeSetting: (setting: ThemeSetting) => void;
  setTheme: (mode: ResolvedTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeSetting, setThemeSettingState] = useState<ThemeSetting>(() => {
    if (typeof window === 'undefined') return 'system';
    const saved = localStorage.getItem('manas_theme_preference') || localStorage.getItem('manas_theme');
    if (saved === 'dark' || saved === 'light' || saved === 'system') return saved as ThemeSetting;
    return 'system';
  });

  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Listen to system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const resolvedTheme: ResolvedTheme = themeSetting === 'system' ? systemTheme : themeSetting;

  // Apply dark class to document root
  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('manas_theme_preference', themeSetting);
    localStorage.setItem('manas_theme', resolvedTheme);
  }, [resolvedTheme, themeSetting]);

  const toggleTheme = () => {
    setThemeSettingState((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  const setThemeSetting = (setting: ThemeSetting) => {
    setThemeSettingState(setting);
  };

  const setTheme = (mode: ResolvedTheme) => {
    setThemeSettingState(mode);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: resolvedTheme,
        themeSetting,
        toggleTheme,
        setThemeSetting,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
