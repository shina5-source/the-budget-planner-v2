'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Theme, ThemeKey, getTheme, DEFAULT_THEME } from '../lib/themes';

interface ThemeContextType {
  theme: Theme;
  themeKey: ThemeKey;
  setTheme: (key: ThemeKey) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'budget-planner-theme';
const DARK_MODE_KEY = 'budget-planner-dark-mode';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeKey, setThemeKey] = useState<ThemeKey>(DEFAULT_THEME);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY) as ThemeKey | null;
    if (savedTheme && getTheme(savedTheme)) {
      setThemeKey(savedTheme);
    }
    
    const savedDarkMode = localStorage.getItem(DARK_MODE_KEY);
    if (savedDarkMode === 'true') {
      setIsDarkMode(true);
    }
    
    setMounted(true);
  }, []);

  const theme = getTheme(themeKey);
  const resolvedColors = isDarkMode ? theme.colors.dark : theme.colors.light;
  const resolvedThemeForContext = { ...theme, colors: resolvedColors };

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    Object.keys(resolvedColors).forEach(key => {
      const cssVar = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVar, resolvedColors[key as keyof typeof resolvedColors]);
    });

    localStorage.setItem(STORAGE_KEY, themeKey);
  }, [themeKey, resolvedColors, mounted]);

  useEffect(() => {
    if (!mounted) return;

    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem(DARK_MODE_KEY, isDarkMode.toString());
  }, [isDarkMode, mounted]);

  const setTheme = (key: ThemeKey) => {
    setThemeKey(key);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ theme: resolvedThemeForContext, themeKey, setTheme, isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    const defaultTheme = getTheme(DEFAULT_THEME);
    return {
      theme: { ...defaultTheme, colors: defaultTheme.colors.light },
      themeKey: DEFAULT_THEME,
      setTheme: () => {},
      isDarkMode: false,
      toggleDarkMode: () => {},
    };
  }
  
  return context;
}
