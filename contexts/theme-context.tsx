'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Theme, ThemeKey, getTheme, DEFAULT_THEME } from '../lib/themes';

// Type pour les couleurs résolues (aplaties, sans light/dark)
type ResolvedColors = Theme['colors']['light'];

// Type pour le thème avec couleurs résolues
interface ResolvedTheme {
  key: ThemeKey;
  name: string;
  emoji: string;
  colors: ResolvedColors;
}

interface ThemeContextType {
  theme: ResolvedTheme;
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
  
  // Thème avec couleurs résolues (aplaties)
  const resolvedTheme: ResolvedTheme = {
    key: theme.key,
    name: theme.name,
    emoji: theme.emoji,
    colors: resolvedColors
  };

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    Object.keys(resolvedColors).forEach(key => {
      const cssVar = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVar, resolvedColors[key as keyof typeof resolvedColors]);
    });

    // NOUVEAU : Appliquer le fond dégradé sur le body
    document.body.style.background = `linear-gradient(180deg, ${resolvedColors.backgroundGradientFrom} 0%, ${resolvedColors.backgroundGradientTo} 50%, ${resolvedColors.backgroundGradientFrom} 100%)`;
    document.body.style.minHeight = '100vh';

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
    <ThemeContext.Provider value={{ theme: resolvedTheme, themeKey, setTheme, isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    const defaultTheme = getTheme(DEFAULT_THEME);
    const defaultResolved: ResolvedTheme = {
      key: defaultTheme.key,
      name: defaultTheme.name,
      emoji: defaultTheme.emoji,
      colors: defaultTheme.colors.light
    };
    return {
      theme: defaultResolved,
      themeKey: DEFAULT_THEME,
      setTheme: () => {},
      isDarkMode: false,
      toggleDarkMode: () => {},
    };
  }
  
  return context;
}