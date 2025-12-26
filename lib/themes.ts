// lib/themes.ts
// Configuration des thèmes de couleurs pour The Budget Planner
// ✅ CORRIGÉ : Tous les cardBackground en mode sombre sont OPAQUES (pas de rgba transparent)

export type ThemeKey =
  | 'bordeaux-or'
  | 'rose-bleu-nuit'
  | 'soft-pink'
  | 'excel-teal'
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
      textOnSecondary: string;
      negative?: string;
      positive?: string;
      headerAlt?: string;
      headerTaupe?: string;
      chartBar?: string;
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
      textOnSecondary: string;
      negative?: string;
      positive?: string;
      headerAlt?: string;
      headerTaupe?: string;
      chartBar?: string;
    };
  };
}

export const themes: Record<ThemeKey, Theme> = { 
  // ========== BORDEAUX & OR ==========
  'bordeaux-or': {
    key: 'bordeaux-or',
    name: 'Bordeaux & Or',
    emoji: '🍷',
    colors: {
      light: {
        primary: '#D4AF37',
        primaryLight: '#E8C84B',
        secondary: '#722F37',
        secondaryLight: '#F5E6E0',
        accent: '#D4AF37',
        gradientFrom: '#D4AF37',
        gradientTo: '#722F37',
        backgroundGradientFrom: '#E8D5D5',
        backgroundGradientTo: '#D4B8B8',
        cardBackground: '#F5E6E0',
        cardBackgroundLight: '#FAF0ED',
        cardBorder: 'rgba(212, 175, 55, 0.5)',
        textPrimary: '#4A1A1F',
        textSecondary: 'rgba(74, 26, 31, 0.7)',
        textOnPrimary: '#722F37',
        textOnSecondary: '#D4AF37',
      },
      dark: {
        primary: '#D4AF37',
        primaryLight: '#E8C84B',
        secondary: '#620023',
        secondaryLight: '#3D1520',
        accent: '#D4AF37',
        gradientFrom: '#6f0028',
        gradientTo: '#620023',
        backgroundGradientFrom: '#1A0A0F',
        backgroundGradientTo: '#2D0F18',
        cardBackground: '#2D0F18',
        cardBackgroundLight: '#3E1420',
        cardBorder: 'rgba(212, 175, 55, 0.3)',
        textPrimary: '#D4AF37',
        textSecondary: 'rgba(212, 175, 55, 0.7)',
        textOnPrimary: '#1A0A0F',
        textOnSecondary: '#D4AF37',
      },
    },
  },

  // ========== ROSE & BLEU NUIT ==========
 'rose-bleu-nuit': {
    key: 'rose-bleu-nuit',
    name: 'Rose & Bleu Nuit',
    emoji: '🌙',
    colors: {
      light: {
        // MODE CLAIR : Fond rose poudré + Cartes bleu nuit + Texte doré
        primary: '#D4AF37',           // Doré (accents, "Bonjour", titres)
        primaryLight: '#E8C84B',      // Doré clair
        secondary: '#1e293b',         // Bleu nuit (header, nav, cartes)
        secondaryLight: '#334155',    // Bleu nuit clair
        accent: '#D4AF37',            // Doré
        gradientFrom: '#D4AF37',      // Doré (pour gradients décoratifs)
        gradientTo: '#1e293b',        // Bleu nuit
        backgroundGradientFrom: '#E8C4C4',  // Rose poudré (fond principal)
        backgroundGradientTo: '#D4A5A5',    // Rose poudré foncé
        // CARTES = BLEU NUIT (comme sur tes captures)
        cardBackground: '#1e293b',    // Bleu nuit SOLIDE
        cardBackgroundLight: '#334155', // Bleu nuit clair
        cardBorder: 'rgba(212, 175, 55, 0.3)', // Bordure dorée subtile
        // TEXTE = DORÉ (sur fond bleu nuit)
        textPrimary: '#D4AF37',       // Doré
        textSecondary: 'rgba(212, 175, 55, 0.7)', // Doré semi-transparent
        textOnPrimary: '#1e293b',     // Bleu nuit (sur boutons dorés)
        textOnSecondary: '#D4AF37',   // Doré
      },
      dark: {
        // MODE SOMBRE : ON NE TOUCHE PAS - C'est parfait comme ça !
        primary: '#f472b6',           // Rose (comme tu l'aimes)
        primaryLight: '#f9a8d4',      // Rose clair
        secondary: '#0f172a',         // Bleu nuit très foncé
        secondaryLight: '#1e293b',    // Bleu nuit
        accent: '#f472b6',            // Rose
        gradientFrom: '#f472b6',      // Rose
        gradientTo: '#1e293b',        // Bleu nuit
        backgroundGradientFrom: '#334155',  // Bleu gris
        backgroundGradientTo: '#1e293b',    // Bleu nuit
        // CARTES = BLEU NUIT FONCÉ
        cardBackground: '#0f172a',    // Bleu nuit très foncé
        cardBackgroundLight: '#1e293b', // Bleu nuit
        cardBorder: 'rgba(244, 114, 182, 0.3)', // Bordure rose
        // TEXTE = ROSE
        textPrimary: '#f9a8d4',       // Rose clair
        textSecondary: 'rgba(249, 168, 212, 0.7)', // Rose semi-transparent
        textOnPrimary: '#0f172a',     // Bleu nuit foncé
        textOnSecondary: '#f9a8d4',   // Rose
      }
    },
  },


  // ========== SOFT PINK ==========
  'soft-pink': {
    key: 'soft-pink',
    name: 'Soft Pink',
    emoji: '🌷',
    colors: {
      light: {
        primary: '#6B5B75',
        primaryLight: '#9B8AA5',
        secondary: '#E8D5D5',
        secondaryLight: '#F5E6E0',
        accent: '#7BA085',
        gradientFrom: '#F5E6E0',
        gradientTo: '#E8D5D5',
        backgroundGradientFrom: '#F5E6E0',
        backgroundGradientTo: '#E8D5D5',
        cardBackground: '#FFFFFF',
        cardBackgroundLight: '#FAF5F5',
        cardBorder: 'rgba(107, 91, 117, 0.25)',
        textPrimary: '#4A4A4A',
        textSecondary: '#6B6B6B',
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#4A4A4A',
      },
      dark: {
        primary: '#B8A9C0',
        primaryLight: '#D4C8DC',
        secondary: '#2A2530',
        secondaryLight: '#3D3347',
        accent: '#7BA085',
        gradientFrom: '#3D3347',
        gradientTo: '#2A2530',
        backgroundGradientFrom: '#2A2530',
        backgroundGradientTo: '#1E1A22',
        cardBackground: '#3D3347',
        cardBackgroundLight: '#4A3D52',
        cardBorder: 'rgba(184, 169, 192, 0.3)',
        textPrimary: '#E8D5E0',
        textSecondary: 'rgba(232, 213, 224, 0.7)',
        textOnPrimary: '#2A2530',
        textOnSecondary: '#E8D5E0',
      }
    },
  },

  // ========== EXCEL PRO ==========
  'excel-teal': {
    key: 'excel-teal',
    name: 'Excel Pro',
    emoji: '📊',
    colors: {
      light: {
        primary: '#5D4037',
        primaryLight: '#795548',
        secondary: '#2D5A5A',
        secondaryLight: '#F5F0E8',
        accent: '#C9A86C',
        gradientFrom: '#F0EDE8',
        gradientTo: '#E8E4DE',
        backgroundGradientFrom: '#F5F3F0',
        backgroundGradientTo: '#EBE8E3',
        cardBackground: '#FFFFFF',
        cardBackgroundLight: '#FAF8F5',
        cardBorder: 'rgba(93, 64, 55, 0.2)',
        textPrimary: '#3E2723',
        textSecondary: '#5D4037',
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#F5F0E8',
      },
      dark: {
        primary: '#D4B87A',
        primaryLight: '#E5D4A8',
        secondary: '#1E3D3D',
        secondaryLight: '#2D5A5A',
        accent: '#C9A86C',
        gradientFrom: '#2A2520',
        gradientTo: '#1E1A16',
        backgroundGradientFrom: '#252019',
        backgroundGradientTo: '#1A1612',
        cardBackground: '#322D26',
        cardBackgroundLight: '#3D3830',
        cardBorder: 'rgba(212, 184, 122, 0.35)',
        textPrimary: '#E8E0D5',
        textSecondary: 'rgba(232, 224, 213, 0.75)',
        textOnPrimary: '#1A1612',
        textOnSecondary: '#E8E0D5',
      }
    },
  },

  // ========== PASTEL VIOLET ==========
  'pastel-violet': {
    key: 'pastel-violet',
    name: 'Violet Pastel',
    emoji: '💜',
    colors: {
      light: {
        primary: '#4A2A4A',
        primaryLight: '#6B4A6B',
        secondary: '#B989D3',
        secondaryLight: '#F8F0F5',
        accent: '#9D61A2',
        gradientFrom: '#F2E3E5',
        gradientTo: '#E8D5E0',
        backgroundGradientFrom: '#F8F0F5',
        backgroundGradientTo: '#F2E3E5',
        cardBackground: '#FFFFFF',
        cardBackgroundLight: '#FAF5F8',
        cardBorder: 'rgba(185, 137, 211, 0.3)',
        textPrimary: '#2D1A2D',
        textSecondary: '#4A3A4A',
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#FFFFFF',
      },
      dark: {
        primary: '#CCA7C7',
        primaryLight: '#D4B3CF',
        secondary: '#5C3A5C',
        secondaryLight: '#6B4A6B',
        accent: '#B989D3',
        gradientFrom: '#6B4A6B',
        gradientTo: '#5C3A5C',
        backgroundGradientFrom: '#2D1F2D',
        backgroundGradientTo: '#3A2A3A',
        cardBackground: '#5C3A5C',
        cardBackgroundLight: '#6B4A6B',
        cardBorder: 'rgba(204, 167, 199, 0.3)',
        textPrimary: '#E8D5E0',
        textSecondary: 'rgba(232, 213, 224, 0.7)',
        textOnPrimary: '#2D1F2D',
        textOnSecondary: '#CCA7C7',
      }
    },
  },

  // ========== PASTEL BLEU ==========
  'pastel-bleu': {
    key: 'pastel-bleu',
    name: 'Bleu Pastel',
    emoji: '💙',
    colors: {
      light: {
        primary: '#2D4A5E',
        primaryLight: '#4a7a9e',
        secondary: '#87CEEB',
        secondaryLight: '#F0F8FF',
        accent: '#5B8DB8',
        gradientFrom: '#E8F4FC',
        gradientTo: '#D6EAF5',
        backgroundGradientFrom: '#F0F8FF',
        backgroundGradientTo: '#E8F4FC',
        cardBackground: '#FFFFFF',
        cardBackgroundLight: '#F5FAFF',
        cardBorder: 'rgba(45, 74, 94, 0.2)',
        textPrimary: '#2D4A5E',
        textSecondary: 'rgba(45, 74, 94, 0.7)',
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#2D4A5E',
      },
      dark: {
        primary: '#89C4E8',
        primaryLight: '#A8D4F0',
        secondary: '#1E3A4D',
        secondaryLight: '#2A4D63',
        accent: '#7EB5D6',
        gradientFrom: '#2A4D63',
        gradientTo: '#1E3A4D',
        backgroundGradientFrom: '#152530',
        backgroundGradientTo: '#1A2F3D',
        cardBackground: '#1E3A4D',
        cardBackgroundLight: '#2A4D63',
        cardBorder: 'rgba(137, 196, 232, 0.25)',
        textPrimary: '#D6EAF5',
        textSecondary: 'rgba(214, 234, 245, 0.7)',
        textOnPrimary: '#152530',
        textOnSecondary: '#D6EAF5',
      }
    },
  },

  // ========== PASTEL VERT ==========
  'pastel-vert': {
    key: 'pastel-vert',
    name: 'Vert Pastel',
    emoji: '💚',
    colors: {
      light: {
        primary: '#2e5a3a',
        primaryLight: '#4a7c59',
        secondary: '#8fbc8f',
        secondaryLight: '#f1f8f2',
        accent: '#6b9b7a',
        gradientFrom: '#e8f5e9',
        gradientTo: '#c8e6c9',
        backgroundGradientFrom: '#f1f8f2',
        backgroundGradientTo: '#e8f5e9',
        cardBackground: '#FFFFFF',
        cardBackgroundLight: '#F5FAF5',
        cardBorder: 'rgba(46, 90, 58, 0.2)',
        textPrimary: '#2e5a3a',
        textSecondary: 'rgba(46, 90, 58, 0.7)',
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#2e5a3a',
      },
      dark: {
        primary: '#a5d6a7',
        primaryLight: '#c8e6c9',
        secondary: '#1b3d24',
        secondaryLight: '#2e5a3a',
        accent: '#81c784',
        gradientFrom: '#2e5a3a',
        gradientTo: '#1b3d24',
        backgroundGradientFrom: '#1a2e1f',
        backgroundGradientTo: '#1b3d24',
        cardBackground: '#1b3d24',
        cardBackgroundLight: '#2e5a3a',
        cardBorder: 'rgba(165, 214, 167, 0.25)',
        textPrimary: '#c8e6c9',
        textSecondary: 'rgba(200, 230, 201, 0.7)',
        textOnPrimary: '#1b3d24',
        textOnSecondary: '#c8e6c9',
      }
    },
  },

  // ========== PASTEL PÊCHE ==========
  'pastel-peche': {
    key: 'pastel-peche',
    name: 'Pêche Pastel',
    emoji: '🧡',
    colors: {
      light: {
        primary: '#8B5A4A',
        primaryLight: '#A67C6D',
        secondary: '#F5B89A',
        secondaryLight: '#FFF5F0',
        accent: '#E8A088',
        gradientFrom: '#FDE8DC',
        gradientTo: '#FCDCD0',
        backgroundGradientFrom: '#FFF5F0',
        backgroundGradientTo: '#FDE8DC',
        cardBackground: '#FFFFFF',
        cardBackgroundLight: '#FFFAF8',
        cardBorder: 'rgba(139, 90, 74, 0.2)',
        textPrimary: '#6B4A3A',
        textSecondary: 'rgba(107, 74, 58, 0.7)',
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#6B4A3A',
      },
      dark: {
        primary: '#F5B89A',
        primaryLight: '#FCDCD0',
        secondary: '#5C3D3D',
        secondaryLight: '#6B4A4A',
        accent: '#E8A088',
        gradientFrom: '#6B4A4A',
        gradientTo: '#5C3D3D',
        backgroundGradientFrom: '#3D2828',
        backgroundGradientTo: '#4A3333',
        cardBackground: '#5C3D3D',
        cardBackgroundLight: '#6B4A4A',
        cardBorder: 'rgba(245, 184, 154, 0.25)',
        textPrimary: '#FCDCD0',
        textSecondary: 'rgba(252, 220, 208, 0.7)',
        textOnPrimary: '#3D2828',
        textOnSecondary: '#FCDCD0',
      }
    },
  },

  // ========== OCÉAN ==========
  'ocean': {
    key: 'ocean',
    name: 'Océan',
    emoji: '🌊',
    colors: {
      light: {
        primary: '#1A5276',
        primaryLight: '#2980B9',
        secondary: '#17A2B8',
        secondaryLight: '#F0F9FC',
        accent: '#48C9B0',
        gradientFrom: '#E8F4F8',
        gradientTo: '#D4EBF2',
        backgroundGradientFrom: '#F0F9FC',
        backgroundGradientTo: '#E8F4F8',
        cardBackground: '#FFFFFF',
        cardBackgroundLight: '#F5FBFD',
        cardBorder: 'rgba(26, 82, 118, 0.2)',
        textPrimary: '#0E3D5A',
        textSecondary: '#1A5276',
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#FFFFFF',
      },
      dark: {
        primary: '#5DADE2',
        primaryLight: '#85C1E9',
        secondary: '#1B4F72',
        secondaryLight: '#21618C',
        accent: '#48C9B0',
        gradientFrom: '#1B4F72',
        gradientTo: '#154360',
        backgroundGradientFrom: '#0E2A47',
        backgroundGradientTo: '#1B4F72',
        cardBackground: '#1B4F72',
        cardBackgroundLight: '#21618C',
        cardBorder: 'rgba(93, 173, 226, 0.3)',
        textPrimary: '#D6EAF8',
        textSecondary: 'rgba(214, 234, 248, 0.7)',
        textOnPrimary: '#0E2A47',
        textOnSecondary: '#D6EAF8',
      }
    },
  },

  // ========== FORÊT ==========
  'foret': {
    key: 'foret',
    name: 'Forêt',
    emoji: '🌲',
    colors: {
      light: {
        primary: '#2D4A3E',
        primaryLight: '#4A6B58',
        secondary: '#3A5E4F',
        secondaryLight: '#F5F0E8',
        accent: '#C5E1B8',
        gradientFrom: '#C5E1B8',
        gradientTo: '#D4C4A8',
        backgroundGradientFrom: '#D5CEC3',
        backgroundGradientTo: '#C9C2B7',
        cardBackground: '#FFFFFF',
        cardBackgroundLight: '#FAF8F5',
        cardBorder: 'rgba(74, 107, 88, 0.3)',
        textPrimary: '#2D4A3E',
        textSecondary: 'rgba(45, 74, 62, 0.7)',
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#C5E1B8',
      },
      dark: {
        primary: '#8BBB9A',
        primaryLight: '#A4C89F',
        secondary: '#1B3D2F',
        secondaryLight: '#2D4A3E',
        accent: '#C9A87D',
        gradientFrom: '#6B9B7A',
        gradientTo: '#4A6B58',
        backgroundGradientFrom: '#1B3D2F',
        backgroundGradientTo: '#152E24',
        cardBackground: '#2D4A3E',
        cardBackgroundLight: '#3A5E4F',
        cardBorder: 'rgba(139, 187, 154, 0.3)',
        textPrimary: '#C5E1B8',
        textSecondary: 'rgba(197, 225, 184, 0.7)',
        textOnPrimary: '#1B3D2F',
        textOnSecondary: '#A4C89F',
      }
    },
  },

  // ========== MENTHE FRAÎCHE ==========
  'menthe': {
    key: 'menthe',
    name: 'Menthe Fraîche',
    emoji: '🌿',
    colors: {
      light: {
        primary: '#0D5C52',
        primaryLight: '#14857A',
        secondary: '#0F766E',
        secondaryLight: '#F0FDFA',
        accent: '#2DD4BF',
        gradientFrom: '#99F6E4',
        gradientTo: '#A7F3D0',
        backgroundGradientFrom: '#CCFBF1',
        backgroundGradientTo: '#D1FAE5',
        cardBackground: '#FFFFFF',
        cardBackgroundLight: '#F5FFFC',
        cardBorder: 'rgba(15, 118, 110, 0.25)',
        textPrimary: '#0D5C52',
        textSecondary: 'rgba(13, 92, 82, 0.7)',
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#99F6E4',
      },
      dark: {
        primary: '#5EEAD4',
        primaryLight: '#99F6E4',
        secondary: '#134E4A',
        secondaryLight: '#1A5D57',
        accent: '#2DD4BF',
        gradientFrom: '#2DD4BF',
        gradientTo: '#14B8A6',
        backgroundGradientFrom: '#134E4A',
        backgroundGradientTo: '#0F3D3A',
        cardBackground: '#134E4A',
        cardBackgroundLight: '#1A5D57',
        cardBorder: 'rgba(94, 234, 212, 0.3)',
        textPrimary: '#99F6E4',
        textSecondary: 'rgba(153, 246, 228, 0.7)',
        textOnPrimary: '#134E4A',
        textOnSecondary: '#5EEAD4',
      }
    },
  },

  // ========== COUCHER DE SOLEIL ==========
  'sunset': {
    key: 'sunset',
    name: 'Coucher de Soleil',
    emoji: '🌅',
    colors: {
      light: {
        primary: '#DC2626',
        primaryLight: '#EF4444',
        secondary: '#DC2626',
        secondaryLight: '#FFF7ED',
        accent: '#F59E0B',
        gradientFrom: '#FDBA74',
        gradientTo: '#FCA5A5',
        backgroundGradientFrom: '#FFEDD5',
        backgroundGradientTo: '#FEE2E2',
        cardBackground: '#FFFFFF',
        cardBackgroundLight: '#FFFAF5',
        cardBorder: 'rgba(220, 38, 38, 0.25)',
        textPrimary: '#7C2D12',
        textSecondary: 'rgba(124, 45, 18, 0.7)',
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#FFF7ED',
      },
      dark: {
        primary: '#FB923C',
        primaryLight: '#FDBA74',
        secondary: '#991B1B',
        secondaryLight: '#7C2D12',
        accent: '#FBBF24',
        gradientFrom: '#FB923C',
        gradientTo: '#F472B6',
        backgroundGradientFrom: '#7C2D12',
        backgroundGradientTo: '#581C0C',
        cardBackground: '#7C2D12',
        cardBackgroundLight: '#9A3412',
        cardBorder: 'rgba(251, 146, 60, 0.3)',
        textPrimary: '#FDBA74',
        textSecondary: 'rgba(253, 186, 116, 0.7)',
        textOnPrimary: '#7C2D12',
        textOnSecondary: '#FDBA74',
      }
    },
  },

  // ========== CERISE ==========
  'cerise': {
    key: 'cerise',
    name: 'Cerise',
    emoji: '🍒',
    colors: {
      light: {
        primary: '#be123c',
        primaryLight: '#e11d48',
        secondary: '#6b1530',
        secondaryLight: '#FFF1F2',
        accent: '#f472b6',
        gradientFrom: '#F5D0E0',
        gradientTo: '#E8C2D4',
        backgroundGradientFrom: '#FDF2F8',
        backgroundGradientTo: '#F8E8F0',
        cardBackground: '#FFFFFF',
        cardBackgroundLight: '#FFF5F7',
        cardBorder: 'rgba(190, 18, 60, 0.25)',
        textPrimary: '#881337',
        textSecondary: 'rgba(136, 19, 55, 0.75)',
        textOnPrimary: '#ffffff',
        textOnSecondary: '#ffffff',
      },
      dark: {
        primary: '#fb7185',
        primaryLight: '#fda4af',
        secondary: '#4c0519',
        secondaryLight: '#881337',
        accent: '#f472b6',
        gradientFrom: '#831843',
        gradientTo: '#701a3a',
        backgroundGradientFrom: '#1c0a10',
        backgroundGradientTo: '#2d0a14',
        cardBackground: '#4c0519',
        cardBackgroundLight: '#6b1530',
        cardBorder: 'rgba(251, 113, 133, 0.3)',
        textPrimary: '#fecdd3',
        textSecondary: 'rgba(254, 205, 211, 0.7)',
        textOnPrimary: '#4c0519',
        textOnSecondary: '#fecdd3',
      }
    },
  },

  // ========== CHOCOLAT ==========
  'chocolat': {
    key: 'chocolat',
    name: 'Chocolat',
    emoji: '🍫',
    colors: {
      light: {
        primary: '#5D4037',
        primaryLight: '#795548',
        secondary: '#4E342E',
        secondaryLight: '#FFF8E7',
        accent: '#D7CCC8',
        gradientFrom: '#E8DCD0',
        gradientTo: '#D4C4B0',
        backgroundGradientFrom: '#F5EFE6',
        backgroundGradientTo: '#E8DCD0',
        cardBackground: '#FFFFFF',
        cardBackgroundLight: '#FFFCF5',
        cardBorder: 'rgba(93, 64, 55, 0.25)',
        textPrimary: '#3E2723',
        textSecondary: 'rgba(62, 39, 35, 0.7)',
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#F5EFE6',
      },
      dark: {
        primary: '#BCAAA4',
        primaryLight: '#D7CCC8',
        secondary: '#3E2723',
        secondaryLight: '#4E342E',
        accent: '#A1887F',
        gradientFrom: '#8D6E63',
        gradientTo: '#6D4C41',
        backgroundGradientFrom: '#3E2723',
        backgroundGradientTo: '#2C1A15',
        cardBackground: '#3E2723',
        cardBackgroundLight: '#4E342E',
        cardBorder: 'rgba(188, 170, 164, 0.3)',
        textPrimary: '#D7CCC8',
        textSecondary: 'rgba(215, 204, 200, 0.7)',
        textOnPrimary: '#3E2723',
        textOnSecondary: '#D7CCC8',
      }
    },
  },

  // ========== ROSE GOLD ==========
  'rose-gold': {
    key: 'rose-gold',
    name: 'Rose Gold',
    emoji: '✨',
    colors: {
      light: {
        primary: '#B76E79',
        primaryLight: '#C9939B',
        secondary: '#8E5D63',
        secondaryLight: '#FDF5F6',
        accent: '#E8B4B8',
        gradientFrom: '#EACFD0',
        gradientTo: '#DEB8BA',
        backgroundGradientFrom: '#FDF5F6',
        backgroundGradientTo: '#F5E6E8',
        cardBackground: '#FFFFFF',
        cardBackgroundLight: '#FFFAF8',
        cardBorder: 'rgba(183, 110, 121, 0.25)',
        textPrimary: '#6B4449',
        textSecondary: 'rgba(107, 68, 73, 0.7)',
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#FDF5F6',
      },
      dark: {
        primary: '#E8B4B8',
        primaryLight: '#EACFD0',
        secondary: '#5C3D40',
        secondaryLight: '#6B4449',
        accent: '#C9939B',
        gradientFrom: '#B76E79',
        gradientTo: '#A15D67',
        backgroundGradientFrom: '#5C3D40',
        backgroundGradientTo: '#4A3033',
        cardBackground: '#5C3D40',
        cardBackgroundLight: '#6B4449',
        cardBorder: 'rgba(232, 180, 184, 0.3)',
        textPrimary: '#EACFD0',
        textSecondary: 'rgba(234, 207, 208, 0.7)',
        textOnPrimary: '#5C3D40',
        textOnSecondary: '#E8B4B8',
      }
    },
  },

  // ========== LAVANDE ==========
  'lavande': {
    key: 'lavande',
    name: 'Lavande',
    emoji: '💐',
    colors: {
      light: {
        primary: '#7C6A9C',
        primaryLight: '#9B8AB8',
        secondary: '#6B5B7E',
        secondaryLight: '#F8F5FC',
        accent: '#C59EFB',
        gradientFrom: '#E2D4F0',
        gradientTo: '#D4C4E8',
        backgroundGradientFrom: '#F5F0FA',
        backgroundGradientTo: '#EDE5F5',
        cardBackground: '#FFFFFF',
        cardBackgroundLight: '#FAF8FC',
        cardBorder: 'rgba(124, 106, 156, 0.25)',
        textPrimary: '#4A3D5C',
        textSecondary: 'rgba(74, 61, 92, 0.7)',
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#F5F0FA',
      },
      dark: {
        primary: '#C59EFB',
        primaryLight: '#D4B8FC',
        secondary: '#3D2E4F',
        secondaryLight: '#4A3D5C',
        accent: '#9B8AB8',
        gradientFrom: '#7C6A9C',
        gradientTo: '#6B5B7E',
        backgroundGradientFrom: '#2D2139',
        backgroundGradientTo: '#231A2C',
        cardBackground: '#3D2E4F',
        cardBackgroundLight: '#4A3D5C',
        cardBorder: 'rgba(197, 158, 251, 0.3)',
        textPrimary: '#E2D4F0',
        textSecondary: 'rgba(226, 212, 240, 0.7)',
        textOnPrimary: '#2D2139',
        textOnSecondary: '#D4B8FC',
      }
    },
  },

  // ========== NUIT ÉTOILÉE ==========
  'nuit-etoilee': {
    key: 'nuit-etoilee',
    name: 'Nuit Étoilée',
    emoji: '✨',
    colors: {
      light: {
        primary: '#4F46E5',
        primaryLight: '#6366F1',
        secondary: '#1E1B4B',
        secondaryLight: '#F8FAFC',
        accent: '#FBBF24',
        gradientFrom: '#A5B4FC',
        gradientTo: '#C4B5FD',
        backgroundGradientFrom: '#E0E7FF',
        backgroundGradientTo: '#EDE9FE',
        cardBackground: '#F1F5F9',
        cardBackgroundLight: '#E2E8F0',
        cardBorder: 'rgba(79, 70, 229, 0.25)',
        textPrimary: '#1E1B4B',
        textSecondary: 'rgba(30, 27, 75, 0.7)',
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#E0E7FF',
      },
      dark: {
        primary: '#60A5FA',
        primaryLight: '#93C5FD',
        secondary: '#0C1929',
        secondaryLight: '#1E293B',
        accent: '#FBBF24',
        gradientFrom: '#6366F1',
        gradientTo: '#8B5CF6',
        backgroundGradientFrom: '#050A18',
        backgroundGradientTo: '#0C1929',
        cardBackground: '#1E293B',
        cardBackgroundLight: '#334155',
        cardBorder: 'rgba(96, 165, 250, 0.3)',
        textPrimary: '#E0F2FE',
        textSecondary: 'rgba(224, 242, 254, 0.7)',
        textOnPrimary: '#0F172A',
        textOnSecondary: '#93C5FD',
      }
    },
  },
  
  // ========== MONOCHROME ==========
  'monochrome': {
    key: 'monochrome',
    name: 'Monochrome',
    emoji: '⚫',
    colors: {
      light: {
        primary: '#404040',
        primaryLight: '#525252',
        secondary: '#171717',
        secondaryLight: '#FAFAFA',
        accent: '#000000',
        gradientFrom: '#E5E5E5',
        gradientTo: '#D4D4D4',
        backgroundGradientFrom: '#FAFAFA',
        backgroundGradientTo: '#F5F5F5',
        cardBackground: '#FFFFFF',
        cardBackgroundLight: '#FAFAFA',
        cardBorder: 'rgba(64, 64, 64, 0.15)',
        textPrimary: '#171717',
        textSecondary: 'rgba(23, 23, 23, 0.7)',
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#FAFAFA',
      },
      dark: {
        primary: '#A3A3A3',
        primaryLight: '#D4D4D4',
        secondary: '#0A0A0A',
        secondaryLight: '#171717',
        accent: '#FFFFFF',
        gradientFrom: '#525252',
        gradientTo: '#404040',
        backgroundGradientFrom: '#0A0A0A',
        backgroundGradientTo: '#171717',
        cardBackground: '#171717',
        cardBackgroundLight: '#262626',
        cardBorder: 'rgba(163, 163, 163, 0.2)',
        textPrimary: '#E5E5E5',
        textSecondary: 'rgba(229, 229, 229, 0.7)',
        textOnPrimary: '#0A0A0A',
        textOnSecondary: '#D4D4D4',
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