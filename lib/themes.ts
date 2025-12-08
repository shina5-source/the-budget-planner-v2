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
    light: {
      primary: string;
      primaryLight: string;
      secondary: string;
      secondaryLight: string;
      accent: string;
      gradientFrom: string;
      gradientTo: string;
      backgroundGradientFrom: string;
      backgroundGradientTo: string;
      cardBackground: string;
      cardBackgroundLight: string;
      cardBorder: string;
      textPrimary: string;
      textSecondary: string;
      textOnPrimary: string;
    };
    dark: {
      primary: string;
      primaryLight: string;
      secondary: string;
      secondaryLight: string;
      accent: string;
      gradientFrom: string;
      gradientTo: string;
      backgroundGradientFrom: string;
      backgroundGradientTo: string;
      cardBackground: string;
      cardBackgroundLight: string;
      cardBorder: string;
      textPrimary: string;
      textSecondary: string;
      textOnPrimary: string;
    };
  };
}

export const themes: Record<ThemeKey, Theme> = {
  // ========== THÈME PAR DÉFAUT - BORDEAUX & OR ==========
  'bordeaux-or': {
    key: 'bordeaux-or',
    name: 'Bordeaux & Or',
    emoji: '🍷',
    colors: {
      light: {
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
      dark: {
        primary: '#f0d78c',
        primaryLight: '#f8e6a8',
        secondary: '#1a1a2e',
        secondaryLight: '#2a2a4a',
        accent: '#f0d78c',
        gradientFrom: '#f0d78c',
        gradientTo: '#1a1a2e',
        backgroundGradientFrom: '#1a1a2e',
        backgroundGradientTo: '#0f0f1a',
        cardBackground: 'rgba(26, 26, 46, 0.8)',
        cardBackgroundLight: 'rgba(26, 26, 46, 0.9)',
        cardBorder: 'rgba(240, 215, 140, 0.3)',
        textPrimary: '#f0d78c',
        textSecondary: 'rgba(240, 215, 140, 0.7)',
        textOnPrimary: '#1a1a2e',
      },
    },
  },

  // ========== THÈME ROSE + BLEU NUIT (comme sur l'image) ==========
  'rose-bleu-nuit': {
    key: 'rose-bleu-nuit',
    name: 'Rose & Bleu Nuit',
    emoji: '🌙',
    colors: {
      light: {
        primary: '#D4AF37',
        primaryLight: '#E8C84B',
        secondary: '#1e293b',
        secondaryLight: '#334155',
        accent: '#D4AF37',
        gradientFrom: '#D4AF37',
        gradientTo: '#1e293b',
        backgroundGradientFrom: '#E8C4C4',
        backgroundGradientTo: '#CFA0A5',
        cardBackground: 'rgba(30, 41, 59, 0.9)',
        cardBackgroundLight: 'rgba(51, 65, 85, 0.9)',
        cardBorder: 'rgba(212, 175, 55, 0.3)',
        textPrimary: '#D4AF37',
        textSecondary: 'rgba(212, 175, 55, 0.7)',
        textOnPrimary: '#1e293b',
      },
      dark: {
        primary: '#E8C84B',
        primaryLight: '#D4AF37',
        secondary: '#0f172a',
        secondaryLight: '#1e293b',
        accent: '#E8C84B',
        gradientFrom: '#E8C84B',
        gradientTo: '#0f172a',
        backgroundGradientFrom: '#334155',
        backgroundGradientTo: '#1e293b',
        cardBackground: 'rgba(15, 23, 42, 0.8)',
        cardBackgroundLight: 'rgba(30, 41, 59, 0.8)',
        cardBorder: 'rgba(232, 200, 75, 0.3)',
        textPrimary: '#E8C84B',
        textSecondary: 'rgba(232, 200, 75, 0.7)',
        textOnPrimary: '#0f172a',
      }
    },
  },

  // ========== THÈMES PASTELS (DÉGRADÉ AMÉLIORÉ) ==========
  'pastel-violet': {
    key: 'pastel-violet',
    name: 'Violet Pastel',
    emoji: '💜',
    colors: {
      light: {
        primary: '#ede9fe',
        primaryLight: '#c4b5fd',
        secondary: '#7c3aed',
        secondaryLight: '#8b5cf6',
        accent: '#818cf8',
        gradientFrom: '#a78bfa',
        gradientTo: '#f472b6',
        backgroundGradientFrom: '#ede9fe',
        backgroundGradientTo: '#fbcfe8',
        cardBackground: 'rgba(255, 255, 255, 0.6)',
        cardBackgroundLight: 'rgba(237, 233, 254, 0.6)',
        cardBorder: 'rgba(124, 58, 237, 0.2)',
        textPrimary: '#5b21b6',
        textSecondary: 'rgba(91, 33, 182, 0.75)',
        textOnPrimary: '#ffffff',
      },
      dark: {
        primary: '#a78bfa',
        primaryLight: '#c4b5fd',
        secondary: '#1e1b4b',
        secondaryLight: '#312e74',
        accent: '#818cf8',
        gradientFrom: '#a78bfa',
        gradientTo: '#f472b6',
        backgroundGradientFrom: '#1e1b4b',
        backgroundGradientTo: '#1e1b4b',
        cardBackground: 'rgba(50, 46, 116, 0.5)',
        cardBackgroundLight: 'rgba(50, 46, 116, 0.7)',
        cardBorder: 'rgba(167, 139, 250, 0.3)',
        textPrimary: '#c4b5fd',
        textSecondary: 'rgba(196, 181, 253, 0.7)',
        textOnPrimary: '#ffffff',
      }
    },
  },
  'pastel-bleu': {
    key: 'pastel-bleu',
    name: 'Bleu Pastel',
    emoji: '💙',
    colors: {
      light: {
        primary: '#dbeafe',
        primaryLight: '#93c5fd',
        secondary: '#2563eb',
        secondaryLight: '#3b82f6',
        accent: '#3b82f6',
        gradientFrom: '#60a5fa',
        gradientTo: '#38bdf8',
        backgroundGradientFrom: '#dbeafe',
        backgroundGradientTo: '#bae6fd',
        cardBackground: 'rgba(255, 255, 255, 0.6)',
        cardBackgroundLight: 'rgba(219, 234, 254, 0.6)',
        cardBorder: 'rgba(59, 130, 246, 0.2)',
        textPrimary: '#1e3a8a',
        textSecondary: 'rgba(30, 58, 138, 0.75)',
        textOnPrimary: '#ffffff',
      },
      dark: {
        primary: '#60a5fa',
        primaryLight: '#93c5fd',
        secondary: '#1e3a8a',
        secondaryLight: '#1e40af',
        accent: '#818cf8',
        gradientFrom: '#60a5fa',
        gradientTo: '#38bdf8',
        backgroundGradientFrom: '#1e3a8a',
        backgroundGradientTo: '#1e3a8a',
        cardBackground: 'rgba(30, 58, 138, 0.5)',
        cardBackgroundLight: 'rgba(30, 64, 175, 0.7)',
        cardBorder: 'rgba(96, 165, 250, 0.3)',
        textPrimary: '#93c5fd',
        textSecondary: 'rgba(147, 197, 253, 0.7)',
        textOnPrimary: '#ffffff',
      }
    },
  },
  'pastel-vert': {
    key: 'pastel-vert',
    name: 'Vert Pastel',
    emoji: '💚',
    colors: {
      light: {
        primary: '#dcfce7',
        primaryLight: '#86efac',
        secondary: '#16a34a',
        secondaryLight: '#22c55e',
        accent: '#a3e635',
        gradientFrom: '#4ade80',
        gradientTo: '#2dd4bf',
        backgroundGradientFrom: '#dcfce7',
        backgroundGradientTo: '#ccfbf1',
        cardBackground: 'rgba(255, 255, 255, 0.6)',
        cardBackgroundLight: 'rgba(220, 252, 231, 0.6)',
        cardBorder: 'rgba(34, 197, 94, 0.2)',
        textPrimary: '#14532d',
        textSecondary: 'rgba(20, 83, 45, 0.75)',
        textOnPrimary: '#ffffff',
      },
      dark: {
        primary: '#4ade80',
        primaryLight: '#86efac',
        secondary: '#14532d',
        secondaryLight: '#166534',
        accent: '#a3e635',
        gradientFrom: '#4ade80',
        gradientTo: '#2dd4bf',
        backgroundGradientFrom: '#14532d',
        backgroundGradientTo: '#14532d',
        cardBackground: 'rgba(20, 83, 45, 0.5)',
        cardBackgroundLight: 'rgba(22, 101, 52, 0.7)',
        cardBorder: 'rgba(74, 222, 128, 0.3)',
        textPrimary: '#86efac',
        textSecondary: 'rgba(134, 239, 172, 0.7)',
        textOnPrimary: '#000000',
      }
    },
  },
  'pastel-peche': {
    key: 'pastel-peche',
    name: 'Pêche Pastel',
    emoji: '🧡',
    colors: {
      light: {
        primary: '#ffedd5',
        primaryLight: '#fdba74',
        secondary: '#ea580c',
        secondaryLight: '#f97316',
        accent: '#facc15',
        gradientFrom: '#fb923c',
        gradientTo: '#f472b6',
        backgroundGradientFrom: '#ffedd5',
        backgroundGradientTo: '#fce7f3',
        cardBackground: 'rgba(255, 255, 255, 0.6)',
        cardBackgroundLight: 'rgba(255, 237, 213, 0.6)',
        cardBorder: 'rgba(251, 146, 60, 0.2)',
        textPrimary: '#9a3412',
        textSecondary: 'rgba(154, 52, 18, 0.75)',
        textOnPrimary: '#ffffff',
      },
      dark: {
        primary: '#fb923c',
        primaryLight: '#fdba74',
        secondary: '#7c2d12',
        secondaryLight: '#9a3412',
        accent: '#facc15',
        gradientFrom: '#fb923c',
        gradientTo: '#f472b6',
        backgroundGradientFrom: '#7c2d12',
        backgroundGradientTo: '#7c2d12',
        cardBackground: 'rgba(124, 45, 18, 0.5)',
        cardBackgroundLight: 'rgba(154, 52, 18, 0.7)',
        cardBorder: 'rgba(251, 146, 60, 0.3)',
        textPrimary: '#fdba74',
        textSecondary: 'rgba(253, 186, 116, 0.7)',
        textOnPrimary: '#ffffff',
      }
    },
  },

  // ========== THÈMES NATURE (DÉGRADÉ AMÉLIORÉ) ==========
  'ocean': {
    key: 'ocean',
    name: 'Océan',
    emoji: '🌊',
    colors: {
      light: {
        primary: '#e0f2fe',
        primaryLight: '#38bdf8',
        secondary: '#0369a1',
        secondaryLight: '#0284c7',
        accent: '#6366f1',
        gradientFrom: '#bae6fd',
        gradientTo: '#7dd3fc',
        backgroundGradientFrom: '#ecfeff',
        backgroundGradientTo: '#f0f9ff',
        cardBackground: 'rgba(2, 132, 199, 0.1)',
        cardBackgroundLight: 'rgba(3, 105, 161, 0.2)',
        cardBorder: 'rgba(14, 165, 233, 0.3)',
        textPrimary: '#084c61',
        textSecondary: 'rgba(8, 76, 97, 0.75)',
        textOnPrimary: '#ffffff',
      },
      dark: {
        primary: '#38bdf8',
        primaryLight: '#7dd3fc',
        secondary: '#082f49',
        secondaryLight: '#075985',
        accent: '#6366f1',
        gradientFrom: '#38bdf8',
        gradientTo: '#06b6d4',
        backgroundGradientFrom: '#082f49',
        backgroundGradientTo: '#082f49',
        cardBackground: 'rgba(7, 89, 133, 0.5)',
        cardBackgroundLight: 'rgba(2, 132, 199, 0.7)',
        cardBorder: 'rgba(56, 189, 248, 0.3)',
        textPrimary: '#7dd3fc',
        textSecondary: 'rgba(125, 211, 252, 0.7)',
        textOnPrimary: '#ffffff',
      }
    },
  },
  'foret': {
    key: 'foret',
    name: 'Forêt',
    emoji: '🌲',
    colors: {
      light: {
        primary: '#dcfce7',
        primaryLight: '#4ade80',
        secondary: '#15803d',
        secondaryLight: '#16a34a',
        accent: '#14b8a6',
        gradientFrom: '#bbf7d0',
        gradientTo: '#a7f3d0',
        backgroundGradientFrom: '#f0fdf4',
        backgroundGradientTo: '#f7fee7',
        cardBackground: 'rgba(21, 128, 61, 0.1)',
        cardBackgroundLight: 'rgba(21, 128, 61, 0.2)',
        cardBorder: 'rgba(34, 197, 94, 0.3)',
        textPrimary: '#14532d',
        textSecondary: 'rgba(20, 83, 45, 0.75)',
        textOnPrimary: '#ffffff',
      },
      dark: {
        primary: '#4ade80',
        primaryLight: '#86efac',
        secondary: '#14532d',
        secondaryLight: '#166534',
        accent: '#14b8a6',
        gradientFrom: '#4ade80',
        gradientTo: '#84cc16',
        backgroundGradientFrom: '#14532d',
        backgroundGradientTo: '#14532d',
        cardBackground: 'rgba(22, 101, 52, 0.5)',
        cardBackgroundLight: 'rgba(21, 128, 61, 0.7)',
        cardBorder: 'rgba(74, 222, 128, 0.3)',
        textPrimary: '#86efac',
        textSecondary: 'rgba(134, 239, 172, 0.7)',
        textOnPrimary: '#000000',
      }
    },
  },
  'menthe': {
    key: 'menthe',
    name: 'Menthe Fraîche',
    emoji: '🌿',
    colors: {
      light: {
        primary: '#ccfbf1',
        primaryLight: '#2dd4bf',
        secondary: '#0f766e',
        secondaryLight: '#0d9488',
        accent: '#06b6d4',
        gradientFrom: '#99f6e4',
        gradientTo: '#a7f3d0',
        backgroundGradientFrom: '#f0fdfa',
        backgroundGradientTo: '#ecfdf5',
        cardBackground: 'rgba(15, 118, 110, 0.1)',
        cardBackgroundLight: 'rgba(15, 118, 110, 0.2)',
        cardBorder: 'rgba(20, 184, 166, 0.3)',
        textPrimary: '#134e4a',
        textSecondary: 'rgba(19, 78, 74, 0.75)',
        textOnPrimary: '#ffffff',
      },
      dark: {
        primary: '#2dd4bf',
        primaryLight: '#5eead4',
        secondary: '#134e4a',
        secondaryLight: '#115e59',
        accent: '#06b6d4',
        gradientFrom: '#2dd4bf',
        gradientTo: '#10b981',
        backgroundGradientFrom: '#134e4a',
        backgroundGradientTo: '#134e4a',
        cardBackground: 'rgba(17, 94, 89, 0.5)',
        cardBackgroundLight: 'rgba(19, 78, 74, 0.7)',
        cardBorder: 'rgba(45, 212, 191, 0.3)',
        textPrimary: '#5eead4',
        textSecondary: 'rgba(94, 234, 212, 0.7)',
        textOnPrimary: '#000000',
      }
    },
  },

  // ========== THÈMES CHAUDS (DÉGRADÉ AMÉLIORÉ) ==========
  'sunset': {
    key: 'sunset',
    name: 'Coucher de soleil',
    emoji: '🌅',
    colors: {
      light: {
        primary: '#ffe4e6',
        primaryLight: '#fb7185',
        secondary: '#be123c',
        secondaryLight: '#e11d48',
        accent: '#eab308',
        gradientFrom: '#fecaca',
        gradientTo: '#fed7aa',
        backgroundGradientFrom: '#fff1f2',
        backgroundGradientTo: '#fff7ed',
        cardBackground: 'rgba(190, 18, 60, 0.1)',
        cardBackgroundLight: 'rgba(190, 18, 60, 0.2)',
        cardBorder: 'rgba(244, 63, 94, 0.3)',
        textPrimary: '#881337',
        textSecondary: 'rgba(136, 19, 55, 0.75)',
        textOnPrimary: '#ffffff',
      },
      dark: {
        primary: '#fb7185',
        primaryLight: '#fda4af',
        secondary: '#881337',
        secondaryLight: '#9f1239',
        accent: '#eab308',
        gradientFrom: '#fb7185',
        gradientTo: '#f97316',
        backgroundGradientFrom: '#881337',
        backgroundGradientTo: '#881337',
        cardBackground: 'rgba(159, 18, 57, 0.5)',
        cardBackgroundLight: 'rgba(136, 19, 55, 0.7)',
        cardBorder: 'rgba(251, 113, 133, 0.3)',
        textPrimary: '#fda4af',
        textSecondary: 'rgba(253, 164, 175, 0.7)',
        textOnPrimary: '#ffffff',
      }
    },
  },
  'cerise': {
    key: 'cerise',
    name: 'Cerise',
    emoji: '🍒',
    colors: {
      light: {
        primary: '#fce7f3',
        primaryLight: '#fb7185',
        secondary: '#9f1239',
        secondaryLight: '#be123c',
        accent: '#f472b6',
        gradientFrom: '#fbcfe8',
        gradientTo: '#fecaca',
        backgroundGradientFrom: '#fff1f2',
        backgroundGradientTo: '#fce7f3',
        cardBackground: 'rgba(159, 18, 57, 0.1)',
        cardBackgroundLight: 'rgba(159, 18, 57, 0.2)',
        cardBorder: 'rgba(225, 29, 72, 0.3)',
        textPrimary: '#831843',
        textSecondary: 'rgba(131, 24, 67, 0.75)',
        textOnPrimary: '#ffffff',
      },
      dark: {
        primary: '#f472b6',
        primaryLight: '#f9a8d4',
        secondary: '#831843',
        secondaryLight: '#9d174d',
        accent: '#e11d48',
        gradientFrom: '#f472b6',
        gradientTo: '#db2777',
        backgroundGradientFrom: '#831843',
        backgroundGradientTo: '#831843',
        cardBackground: 'rgba(157, 23, 77, 0.5)',
        cardBackgroundLight: 'rgba(131, 24, 67, 0.7)',
        cardBorder: 'rgba(244, 114, 182, 0.3)',
        textPrimary: '#f9a8d4',
        textSecondary: 'rgba(249, 168, 212, 0.7)',
        textOnPrimary: '#ffffff',
      }
    },
  },
  'chocolat': {
    key: 'chocolat',
    name: 'Chocolat',
    emoji: '🍫',
    colors: {
      light: {
        primary: '#fef9c3',
        primaryLight: '#b45309',
        secondary: '#78350f',
        secondaryLight: '#92400e',
        accent: '#d97706',
        gradientFrom: '#fde68a',
        gradientTo: '#fcd34d',
        backgroundGradientFrom: '#fef3c7',
        backgroundGradientTo: '#fde68a',
        cardBackground: 'rgba(120, 53, 15, 0.1)',
        cardBackgroundLight: 'rgba(120, 53, 15, 0.2)',
        cardBorder: 'rgba(146, 64, 14, 0.3)',
        textPrimary: '#451a03',
        textSecondary: 'rgba(69, 26, 3, 0.75)',
        textOnPrimary: '#ffffff',
      },
      dark: {
        primary: '#fde68a',
        primaryLight: '#fef08a',
        secondary: '#451a03',
        secondaryLight: '#78350f',
        accent: '#d97706',
        gradientFrom: '#fde68a',
        gradientTo: '#b45309',
        backgroundGradientFrom: '#451a03',
        backgroundGradientTo: '#451a03',
        cardBackground: 'rgba(120, 53, 15, 0.5)',
        cardBackgroundLight: 'rgba(120, 53, 15, 0.7)',
        cardBorder: 'rgba(253, 230, 138, 0.3)',
        textPrimary: '#fde68a',
        textSecondary: 'rgba(254, 240, 138, 0.7)',
        textOnPrimary: '#451a03',
      }
    },
  },

  // ========== THÈMES ÉLÉGANTS (DÉGRADÉ AMÉLIORÉ) ==========
  'rose-gold': {
    key: 'rose-gold',
    name: 'Rose Gold',
    emoji: '🌸',
    colors: {
      light: {
        primary: '#fce7f3',
        primaryLight: '#f472b6',
        secondary: '#be185d',
        secondaryLight: '#db2777',
        accent: '#d946ef',
        gradientFrom: '#fbcfe8',
        gradientTo: '#f9a8d4',
        backgroundGradientFrom: '#fdf2f8',
        backgroundGradientTo: '#fce7f3',
        cardBackground: 'rgba(190, 24, 93, 0.1)',
        cardBackgroundLight: 'rgba(190, 24, 93, 0.2)',
        cardBorder: 'rgba(219, 39, 119, 0.3)',
        textPrimary: '#831843',
        textSecondary: 'rgba(131, 24, 67, 0.75)',
        textOnPrimary: '#ffffff',
      },
      dark: {
        primary: '#f472b6',
        primaryLight: '#f9a8d4',
        secondary: '#831843',
        secondaryLight: '#9d174d',
        accent: '#d946ef',
        gradientFrom: '#f472b6',
        gradientTo: '#c026d3',
        backgroundGradientFrom: '#831843',
        backgroundGradientTo: '#831843',
        cardBackground: 'rgba(157, 23, 77, 0.5)',
        cardBackgroundLight: 'rgba(131, 24, 67, 0.7)',
        cardBorder: 'rgba(244, 114, 182, 0.3)',
        textPrimary: '#f9a8d4',
        textSecondary: 'rgba(249, 168, 212, 0.7)',
        textOnPrimary: '#ffffff',
      }
    },
  },
  'lavande': {
    key: 'lavande',
    name: 'Lavande',
    emoji: '💐',
    colors: {
      light: {
        primary: '#ede9fe',
        primaryLight: '#a78bfa',
        secondary: '#6d28d9',
        secondaryLight: '#7c3aed',
        accent: '#a855f7',
        gradientFrom: '#ddd6fe',
        gradientTo: '#c4b5fd',
        backgroundGradientFrom: '#f5f3ff',
        backgroundGradientTo: '#ede9fe',
        cardBackground: 'rgba(109, 40, 217, 0.1)',
        cardBackgroundLight: 'rgba(109, 40, 217, 0.2)',
        cardBorder: 'rgba(124, 58, 237, 0.3)',
        textPrimary: '#4c1d95',
        textSecondary: 'rgba(76, 29, 149, 0.75)',
        textOnPrimary: '#ffffff',
      },
      dark: {
        primary: '#a78bfa',
        primaryLight: '#c4b5fd',
        secondary: '#4c1d95',
        secondaryLight: '#5b21b6',
        accent: '#a855f7',
        gradientFrom: '#a78bfa',
        gradientTo: '#8b5cf6',
        backgroundGradientFrom: '#4c1d95',
        backgroundGradientTo: '#4c1d95',
        cardBackground: 'rgba(91, 33, 182, 0.5)',
        cardBackgroundLight: 'rgba(109, 40, 217, 0.7)',
        cardBorder: 'rgba(167, 139, 250, 0.3)',
        textPrimary: '#c4b5fd',
        textSecondary: 'rgba(196, 181, 253, 0.7)',
        textOnPrimary: '#ffffff',
      }
    },
  },
  'nuit-etoilee': {
    key: 'nuit-etoilee',
    name: 'Nuit Étoilée',
    emoji: '✨',
    colors: {
      light: {
        primary: '#e0e7ff',
        primaryLight: '#818cf8',
        secondary: '#4338ca',
        secondaryLight: '#4f46e5',
        accent: '#fbbf24',
        gradientFrom: '#c7d2fe',
        gradientTo: '#a5b4fc',
        backgroundGradientFrom: '#e0e7ff',
        backgroundGradientTo: '#c7d2fe',
        cardBackground: 'rgba(67, 56, 202, 0.1)',
        cardBackgroundLight: 'rgba(67, 56, 202, 0.2)',
        cardBorder: 'rgba(99, 102, 241, 0.3)',
        textPrimary: '#312e81',
        textSecondary: 'rgba(49, 46, 129, 0.75)',
        textOnPrimary: '#ffffff',
      },
      dark: {
        primary: '#818cf8',
        primaryLight: '#a5b4fc',
        secondary: '#312e81',
        secondaryLight: '#3730a3',
        accent: '#fbbf24',
        gradientFrom: '#818cf8',
        gradientTo: '#6366f1',
        backgroundGradientFrom: '#312e81',
        backgroundGradientTo: '#312e81',
        cardBackground: 'rgba(55, 48, 163, 0.5)',
        cardBackgroundLight: 'rgba(67, 56, 202, 0.7)',
        cardBorder: 'rgba(129, 140, 248, 0.3)',
        textPrimary: '#a5b4fc',
        textSecondary: 'rgba(165, 180, 252, 0.7)',
        textOnPrimary: '#ffffff',
      }
    },
  },
  'monochrome': {
    key: 'monochrome',
    name: 'Monochrome',
    emoji: '⚫',
    colors: {
      light: {
        primary: '#374151',
        primaryLight: '#4b5563',
        secondary: '#f9fafb',
        secondaryLight: '#f3f4f6',
        accent: '#000000',
        gradientFrom: '#e5e7eb',
        gradientTo: '#d1d5db',
        backgroundGradientFrom: '#f9fafb',
        backgroundGradientTo: '#f3f4f6',
        cardBackground: 'rgba(255, 255, 255, 0.6)',
        cardBackgroundLight: 'rgba(243, 244, 246, 0.8)',
        cardBorder: 'rgba(107, 114, 128, 0.2)',
        textPrimary: '#111827',
        textSecondary: 'rgba(17, 24, 39, 0.75)',
        textOnPrimary: '#ffffff',
      },
      dark: {
        primary: '#9ca3af',
        primaryLight: '#d1d5db',
        secondary: '#111827',
        secondaryLight: '#1f2937',
        accent: '#f9fafb',
        gradientFrom: '#9ca3af',
        gradientTo: '#6b7280',
        backgroundGradientFrom: '#111827',
        backgroundGradientTo: '#111827',
        cardBackground: 'rgba(31, 41, 55, 0.5)',
        cardBackgroundLight: 'rgba(55, 65, 81, 0.7)',
        cardBorder: 'rgba(156, 163, 175, 0.3)',
        textPrimary: '#d1d5db',
        textSecondary: 'rgba(209, 213, 219, 0.7)',
        textOnPrimary: '#000000',
      }
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
