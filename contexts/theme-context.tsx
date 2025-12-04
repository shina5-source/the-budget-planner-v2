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

  useEffect(() => {
    if (!mounted) return;

    const theme = getTheme(themeKey);
    const root = document.documentElement;

    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-primary-light', theme.colors.primaryLight);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-secondary-light', theme.colors.secondaryLight);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-gradient-from', theme.colors.gradientFrom);
    root.style.setProperty('--color-gradient-to', theme.colors.gradientTo);
    root.style.setProperty('--color-bg-gradient-from', theme.colors.backgroundGradientFrom);
    root.style.setProperty('--color-bg-gradient-to', theme.colors.backgroundGradientTo);

    localStorage.setItem(STORAGE_KEY, themeKey);
  }, [themeKey, mounted]);

  useEffect(() => {
    if (!mounted) return;

    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }

    localStorage.setItem(DARK_MODE_KEY, isDarkMode.toString());
  }, [isDarkMode, mounted]);

  const setTheme = (key: ThemeKey) => {
    setThemeKey(key);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = getTheme(themeKey);

  return (
    <ThemeContext.Provider value={{ theme, themeKey, setTheme, isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    return {
      theme: getTheme(DEFAULT_THEME),
      themeKey: DEFAULT_THEME,
      setTheme: () => {},
      isDarkMode: false,
      toggleDarkMode: () => {},
    };
  }
  
  return context;
}