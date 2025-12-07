// lib/themes.ts
// Configuration des thèmes de couleurs pour The Budget Planner

export type ThemeKey = 
  | 'bordeaux-or'
  | 'rose-bleu-nuit'
  | 'pastel-violet'
  | 'pastel-bleu'
  | 'pastel-vert'
  | 'pastel-peche'
  | 'ocean'
  | 'foret'
  | 'sunset'
  | 'monochrome'
  | 'rose-gold'
  | 'lavande'
  | 'menthe'
  | 'chocolat'
  | 'nuit-etoilee'
  | 'cerise';

export interface Theme {
  key: ThemeKey;
  name: string;
  emoji: string;
  colors: {
    // Couleurs principales
    primary: string;           // Couleur d'accent principale (boutons actifs)
    primaryLight: string;      // Version claire du primary
    secondary: string;         // Couleur secondaire
    secondaryLight: string;    // Version claire du secondary
    accent: string;            // Couleur d'accentuation
    
    // Gradients pour éléments UI
    gradientFrom: string;
    gradientTo: string;
    
    // Fond de page
    backgroundGradientFrom: string;
    backgroundGradientTo: string;
    
    // Cartes et conteneurs
    cardBackground: string;      // Fond des cartes
    cardBackgroundLight: string; // Fond des cartes (version légère/hover)
    cardBorder: string;          // Bordure des cartes
    
    // Textes
    textPrimary: string;         // Texte principal sur les cartes
    textSecondary: string;       // Texte secondaire/muted
    textOnPrimary: string;       // Texte sur boutons primary
  };
}

export const themes: Record<ThemeKey, Theme> = {
  // ========== THÈME PAR DÉFAUT - BORDEAUX & OR ==========
  'bordeaux-or': {
    key: 'bordeaux-or',
    name: 'Bordeaux & Or',
    emoji: '🍷',
    colors: {
      primary: '#D4AF37',
      primaryLight: '#E8C84B',
      secondary: '#722F37',
      secondaryLight: '#8B4557',
      accent: '#D4AF37',
      gradientFrom: '#D4AF37',
      gradientTo: '#722F37',
      backgroundGradientFrom: '#E8C4C4',
      backgroundGradientTo: '#CFA0A5',
      cardBackground: 'rgba(114, 47, 55, 0.3)',
      cardBackgroundLight: 'rgba(114, 47, 55, 0.5)',
      cardBorder: 'rgba(212, 175, 55, 0.4)',
      textPrimary: '#D4AF37',
      textSecondary: 'rgba(212, 175, 55, 0.7)',
      textOnPrimary: '#722F37',
    },
  },

  // ========== THÈME ROSE + BLEU NUIT (comme sur l'image) ==========
  'rose-bleu-nuit': {
    key: 'rose-bleu-nuit',
    name: 'Rose & Bleu Nuit',
    emoji: '🌙',
    colors: {
      primary: '#D4AF37',           // Jaune doré pour accents/boutons actifs
      primaryLight: '#E8C84B',
      secondary: '#1e293b',         // Bleu nuit foncé
      secondaryLight: '#334155',
      accent: '#D4AF37',
      gradientFrom: '#D4AF37',
      gradientTo: '#1e293b',
      backgroundGradientFrom: '#E8C4C4',  // Rose clair
      backgroundGradientTo: '#CFA0A5',    // Rose plus foncé
      cardBackground: 'rgba(30, 41, 59, 0.9)',    // Bleu nuit pour les cartes
      cardBackgroundLight: 'rgba(51, 65, 85, 0.9)',
      cardBorder: 'rgba(212, 175, 55, 0.3)',
      textPrimary: '#D4AF37',        // Texte doré
      textSecondary: 'rgba(212, 175, 55, 0.7)',
      textOnPrimary: '#1e293b',
    },
  },

  // ========== THÈMES PASTELS ==========
  'pastel-violet': {
    key: 'pastel-violet',
    name: 'Violet Pastel',
    emoji: '💜',
    colors: {
      primary: '#a78bfa',
      primaryLight: '#c4b5fd',
      secondary: '#7c3aed',
      secondaryLight: '#8b5cf6',
      accent: '#818cf8',
      gradientFrom: '#a78bfa',
      gradientTo: '#f472b6',
      backgroundGradientFrom: '#faf5ff',
      backgroundGradientTo: '#fdf2f8',
      cardBackground: 'rgba(139, 92, 246, 0.15)',
      cardBackgroundLight: 'rgba(139, 92, 246, 0.25)',
      cardBorder: 'rgba(167, 139, 250, 0.4)',
      textPrimary: '#7c3aed',
      textSecondary: 'rgba(124, 58, 237, 0.7)',
      textOnPrimary: '#ffffff',
    },
  },
  'pastel-bleu': {
    key: 'pastel-bleu',
    name: 'Bleu Pastel',
    emoji: '💙',
    colors: {
      primary: '#60a5fa',
      primaryLight: '#93c5fd',
      secondary: '#2563eb',
      secondaryLight: '#3b82f6',
      accent: '#818cf8',
      gradientFrom: '#60a5fa',
      gradientTo: '#38bdf8',
      backgroundGradientFrom: '#eff6ff',
      backgroundGradientTo: '#f0f9ff',
      cardBackground: 'rgba(37, 99, 235, 0.15)',
      cardBackgroundLight: 'rgba(37, 99, 235, 0.25)',
      cardBorder: 'rgba(96, 165, 250, 0.4)',
      textPrimary: '#2563eb',
      textSecondary: 'rgba(37, 99, 235, 0.7)',
      textOnPrimary: '#ffffff',
    },
  },
  'pastel-vert': {
    key: 'pastel-vert',
    name: 'Vert Pastel',
    emoji: '💚',
    colors: {
      primary: '#4ade80',
      primaryLight: '#86efac',
      secondary: '#16a34a',
      secondaryLight: '#22c55e',
      accent: '#a3e635',
      gradientFrom: '#4ade80',
      gradientTo: '#2dd4bf',
      backgroundGradientFrom: '#f0fdf4',
      backgroundGradientTo: '#f0fdfa',
      cardBackground: 'rgba(22, 163, 74, 0.15)',
      cardBackgroundLight: 'rgba(22, 163, 74, 0.25)',
      cardBorder: 'rgba(74, 222, 128, 0.4)',
      textPrimary: '#16a34a',
      textSecondary: 'rgba(22, 163, 74, 0.7)',
      textOnPrimary: '#ffffff',
    },
  },
  'pastel-peche': {
    key: 'pastel-peche',
    name: 'Pêche Pastel',
    emoji: '🧡',
    colors: {
      primary: '#fb923c',
      primaryLight: '#fdba74',
      secondary: '#ea580c',
      secondaryLight: '#f97316',
      accent: '#facc15',
      gradientFrom: '#fb923c',
      gradientTo: '#f472b6',
      backgroundGradientFrom: '#fff7ed',
      backgroundGradientTo: '#fdf2f8',
      cardBackground: 'rgba(234, 88, 12, 0.15)',
      cardBackgroundLight: 'rgba(234, 88, 12, 0.25)',
      cardBorder: 'rgba(251, 146, 60, 0.4)',
      textPrimary: '#ea580c',
      textSecondary: 'rgba(234, 88, 12, 0.7)',
      textOnPrimary: '#ffffff',
    },
  },

  // ========== THÈMES NATURE ==========
  'ocean': {
    key: 'ocean',
    name: 'Océan',
    emoji: '🌊',
    colors: {
      primary: '#0ea5e9',
      primaryLight: '#38bdf8',
      secondary: '#0369a1',
      secondaryLight: '#0284c7',
      accent: '#6366f1',
      gradientFrom: '#0ea5e9',
      gradientTo: '#06b6d4',
      backgroundGradientFrom: '#ecfeff',
      backgroundGradientTo: '#f0f9ff',
      cardBackground: 'rgba(3, 105, 161, 0.15)',
      cardBackgroundLight: 'rgba(3, 105, 161, 0.25)',
      cardBorder: 'rgba(14, 165, 233, 0.4)',
      textPrimary: '#0369a1',
      textSecondary: 'rgba(3, 105, 161, 0.7)',
      textOnPrimary: '#ffffff',
    },
  },
  'foret': {
    key: 'foret',
    name: 'Forêt',
    emoji: '🌲',
    colors: {
      primary: '#22c55e',
      primaryLight: '#4ade80',
      secondary: '#15803d',
      secondaryLight: '#16a34a',
      accent: '#14b8a6',
      gradientFrom: '#22c55e',
      gradientTo: '#84cc16',
      backgroundGradientFrom: '#f0fdf4',
      backgroundGradientTo: '#f7fee7',
      cardBackground: 'rgba(21, 128, 61, 0.15)',
      cardBackgroundLight: 'rgba(21, 128, 61, 0.25)',
      cardBorder: 'rgba(34, 197, 94, 0.4)',
      textPrimary: '#15803d',
      textSecondary: 'rgba(21, 128, 61, 0.7)',
      textOnPrimary: '#ffffff',
    },
  },
  'menthe': {
    key: 'menthe',
    name: 'Menthe Fraîche',
    emoji: '🌿',
    colors: {
      primary: '#14b8a6',
      primaryLight: '#2dd4bf',
      secondary: '#0f766e',
      secondaryLight: '#0d9488',
      accent: '#06b6d4',
      gradientFrom: '#14b8a6',
      gradientTo: '#10b981',
      backgroundGradientFrom: '#f0fdfa',
      backgroundGradientTo: '#ecfdf5',
      cardBackground: 'rgba(15, 118, 110, 0.15)',
      cardBackgroundLight: 'rgba(15, 118, 110, 0.25)',
      cardBorder: 'rgba(20, 184, 166, 0.4)',
      textPrimary: '#0f766e',
      textSecondary: 'rgba(15, 118, 110, 0.7)',
      textOnPrimary: '#ffffff',
    },
  },

  // ========== THÈMES CHAUDS ==========
  'sunset': {
    key: 'sunset',
    name: 'Coucher de soleil',
    emoji: '🌅',
    colors: {
      primary: '#f43f5e',
      primaryLight: '#fb7185',
      secondary: '#be123c',
      secondaryLight: '#e11d48',
      accent: '#eab308',
      gradientFrom: '#f43f5e',
      gradientTo: '#f97316',
      backgroundGradientFrom: '#fff1f2',
      backgroundGradientTo: '#fff7ed',
      cardBackground: 'rgba(190, 18, 60, 0.15)',
      cardBackgroundLight: 'rgba(190, 18, 60, 0.25)',
      cardBorder: 'rgba(244, 63, 94, 0.4)',
      textPrimary: '#be123c',
      textSecondary: 'rgba(190, 18, 60, 0.7)',
      textOnPrimary: '#ffffff',
    },
  },
  'cerise': {
    key: 'cerise',
    name: 'Cerise',
    emoji: '🍒',
    colors: {
      primary: '#e11d48',
      primaryLight: '#fb7185',
      secondary: '#9f1239',
      secondaryLight: '#be123c',
      accent: '#f472b6',
      gradientFrom: '#e11d48',
      gradientTo: '#be123c',
      backgroundGradientFrom: '#fff1f2',
      backgroundGradientTo: '#fce7f3',
      cardBackground: 'rgba(159, 18, 57, 0.15)',
      cardBackgroundLight: 'rgba(159, 18, 57, 0.25)',
      cardBorder: 'rgba(225, 29, 72, 0.4)',
      textPrimary: '#9f1239',
      textSecondary: 'rgba(159, 18, 57, 0.7)',
      textOnPrimary: '#ffffff',
    },
  },
  'chocolat': {
    key: 'chocolat',
    name: 'Chocolat',
    emoji: '🍫',
    colors: {
      primary: '#92400e',
      primaryLight: '#b45309',
      secondary: '#78350f',
      secondaryLight: '#92400e',
      accent: '#d97706',
      gradientFrom: '#92400e',
      gradientTo: '#78350f',
      backgroundGradientFrom: '#fef3c7',
      backgroundGradientTo: '#fde68a',
      cardBackground: 'rgba(120, 53, 15, 0.15)',
      cardBackgroundLight: 'rgba(120, 53, 15, 0.25)',
      cardBorder: 'rgba(146, 64, 14, 0.4)',
      textPrimary: '#78350f',
      textSecondary: 'rgba(120, 53, 15, 0.7)',
      textOnPrimary: '#ffffff',
    },
  },

  // ========== THÈMES ÉLÉGANTS ==========
  'rose-gold': {
    key: 'rose-gold',
    name: 'Rose Gold',
    emoji: '🌸',
    colors: {
      primary: '#ec4899',
      primaryLight: '#f472b6',
      secondary: '#be185d',
      secondaryLight: '#db2777',
      accent: '#d946ef',
      gradientFrom: '#ec4899',
      gradientTo: '#db2777',
      backgroundGradientFrom: '#fdf2f8',
      backgroundGradientTo: '#fce7f3',
      cardBackground: 'rgba(190, 24, 93, 0.15)',
      cardBackgroundLight: 'rgba(190, 24, 93, 0.25)',
      cardBorder: 'rgba(236, 72, 153, 0.4)',
      textPrimary: '#be185d',
      textSecondary: 'rgba(190, 24, 93, 0.7)',
      textOnPrimary: '#ffffff',
    },
  },
  'lavande': {
    key: 'lavande',
    name: 'Lavande',
    emoji: '💐',
    colors: {
      primary: '#8b5cf6',
      primaryLight: '#a78bfa',
      secondary: '#6d28d9',
      secondaryLight: '#7c3aed',
      accent: '#a855f7',
      gradientFrom: '#8b5cf6',
      gradientTo: '#7c3aed',
      backgroundGradientFrom: '#f5f3ff',
      backgroundGradientTo: '#ede9fe',
      cardBackground: 'rgba(109, 40, 217, 0.15)',
      cardBackgroundLight: 'rgba(109, 40, 217, 0.25)',
      cardBorder: 'rgba(139, 92, 246, 0.4)',
      textPrimary: '#6d28d9',
      textSecondary: 'rgba(109, 40, 217, 0.7)',
      textOnPrimary: '#ffffff',
    },
  },
  'nuit-etoilee': {
    key: 'nuit-etoilee',
    name: 'Nuit Étoilée',
    emoji: '✨',
    colors: {
      primary: '#6366f1',
      primaryLight: '#818cf8',
      secondary: '#4338ca',
      secondaryLight: '#4f46e5',
      accent: '#fbbf24',
      gradientFrom: '#6366f1',
      gradientTo: '#4f46e5',
      backgroundGradientFrom: '#e0e7ff',
      backgroundGradientTo: '#c7d2fe',
      cardBackground: 'rgba(67, 56, 202, 0.15)',
      cardBackgroundLight: 'rgba(67, 56, 202, 0.25)',
      cardBorder: 'rgba(99, 102, 241, 0.4)',
      textPrimary: '#4338ca',
      textSecondary: 'rgba(67, 56, 202, 0.7)',
      textOnPrimary: '#ffffff',
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
      cardBackground: 'rgba(55, 65, 81, 0.15)',
      cardBackgroundLight: 'rgba(55, 65, 81, 0.25)',
      cardBorder: 'rgba(107, 114, 128, 0.4)',
      textPrimary: '#374151',
      textSecondary: 'rgba(55, 65, 81, 0.7)',
      textOnPrimary: '#ffffff',
    },
  },
};

export const DEFAULT_THEME: ThemeKey = 'bordeaux-or';

export function getTheme(key: ThemeKey): Theme {
  return themes[key] || themes[DEFAULT_THEME];
}

export function getAllThemes(): Theme[] {
  return Object.values(themes);
}
