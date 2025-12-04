// lib/themes.ts
// Configuration des thèmes de couleurs pour The Budget Planner

export type ThemeKey = 
  | 'pastel-violet'
  | 'pastel-bleu'
  | 'pastel-vert'
  | 'pastel-peche'
  | 'ocean'
  | 'foret'
  | 'sunset'
  | 'monochrome';

export interface Theme {
  key: ThemeKey;
  name: string;
  emoji: string;
  colors: {
    primary: string;
    primaryLight: string;
    secondary: string;
    secondaryLight: string;
    accent: string;
    gradientFrom: string;
    gradientTo: string;
    backgroundGradientFrom: string;
    backgroundGradientTo: string;
  };
}

export const themes: Record<ThemeKey, Theme> = {
  'pastel-violet': {
    key: 'pastel-violet',
    name: 'Violet Pastel',
    emoji: '💜',
    colors: {
      primary: '#a78bfa',
      primaryLight: '#c4b5fd',
      secondary: '#f472b6',
      secondaryLight: '#f9a8d4',
      accent: '#818cf8',
      gradientFrom: '#a78bfa',
      gradientTo: '#f472b6',
      backgroundGradientFrom: '#faf5ff',
      backgroundGradientTo: '#fdf2f8',
    },
  },
  'pastel-bleu': {
    key: 'pastel-bleu',
    name: 'Bleu Pastel',
    emoji: '💙',
    colors: {
      primary: '#60a5fa',
      primaryLight: '#93c5fd',
      secondary: '#38bdf8',
      secondaryLight: '#7dd3fc',
      accent: '#818cf8',
      gradientFrom: '#60a5fa',
      gradientTo: '#38bdf8',
      backgroundGradientFrom: '#eff6ff',
      backgroundGradientTo: '#f0f9ff',
    },
  },
  'pastel-vert': {
    key: 'pastel-vert',
    name: 'Vert Pastel',
    emoji: '💚',
    colors: {
      primary: '#4ade80',
      primaryLight: '#86efac',
      secondary: '#2dd4bf',
      secondaryLight: '#5eead4',
      accent: '#a3e635',
      gradientFrom: '#4ade80',
      gradientTo: '#2dd4bf',
      backgroundGradientFrom: '#f0fdf4',
      backgroundGradientTo: '#f0fdfa',
    },
  },
  'pastel-peche': {
    key: 'pastel-peche',
    name: 'Pêche Pastel',
    emoji: '🧡',
    colors: {
      primary: '#fb923c',
      primaryLight: '#fdba74',
      secondary: '#f472b6',
      secondaryLight: '#f9a8d4',
      accent: '#facc15',
      gradientFrom: '#fb923c',
      gradientTo: '#f472b6',
      backgroundGradientFrom: '#fff7ed',
      backgroundGradientTo: '#fdf2f8',
    },
  },
  'ocean': {
    key: 'ocean',
    name: 'Océan',
    emoji: '🌊',
    colors: {
      primary: '#0ea5e9',
      primaryLight: '#38bdf8',
      secondary: '#06b6d4',
      secondaryLight: '#22d3ee',
      accent: '#6366f1',
      gradientFrom: '#0ea5e9',
      gradientTo: '#06b6d4',
      backgroundGradientFrom: '#ecfeff',
      backgroundGradientTo: '#f0f9ff',
    },
  },
  'foret': {
    key: 'foret',
    name: 'Forêt',
    emoji: '🌲',
    colors: {
      primary: '#22c55e',
      primaryLight: '#4ade80',
      secondary: '#84cc16',
      secondaryLight: '#a3e635',
      accent: '#14b8a6',
      gradientFrom: '#22c55e',
      gradientTo: '#84cc16',
      backgroundGradientFrom: '#f0fdf4',
      backgroundGradientTo: '#f7fee7',
    },
  },
  'sunset': {
    key: 'sunset',
    name: 'Coucher de soleil',
    emoji: '🌅',
    colors: {
      primary: '#f43f5e',
      primaryLight: '#fb7185',
      secondary: '#f97316',
      secondaryLight: '#fb923c',
      accent: '#eab308',
      gradientFrom: '#f43f5e',
      gradientTo: '#f97316',
      backgroundGradientFrom: '#fff1f2',
      backgroundGradientTo: '#fff7ed',
    },
  },
  'monochrome': {
    key: 'monochrome',
    name: 'Monochrome',
    emoji: '⚫',
    colors: {
      primary: '#6b7280',
      primaryLight: '#9ca3af',
      secondary: '#374151',
      secondaryLight: '#4b5563',
      accent: '#111827',
      gradientFrom: '#6b7280',
      gradientTo: '#374151',
      backgroundGradientFrom: '#f9fafb',
      backgroundGradientTo: '#f3f4f6',
    },
  },
};

export const DEFAULT_THEME: ThemeKey = 'pastel-violet';

export function getTheme(key: ThemeKey): Theme {
  return themes[key] || themes[DEFAULT_THEME];
}

export function getAllThemes(): Theme[] {
  return Object.values(themes);
}