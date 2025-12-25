// lib/themes.ts
// Configuration des thèmes de couleurs pour The Budget Planner

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
      // Couleurs étendues (optionnelles) - utilisées par Excel Pro
      negative?: string;        // Rouge/Orange pour montants négatifs
      positive?: string;        // Vert pour montants positifs
      headerAlt?: string;       // Bleu-gris pour headers alternatifs
      headerTaupe?: string;     // Taupe pour headers secondaires
      chartBar?: string;        // Couleur barres graphiques
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
      // Couleurs étendues (optionnelles)
      negative?: string;
      positive?: string;
      headerAlt?: string;
      headerTaupe?: string;
      chartBar?: string;
    };
  };
}

export const themes: Record<ThemeKey, Theme> = { 
 // Remplace uniquement la section 'bordeaux-or' dans ton fichier lib/themes.ts

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
      backgroundGradientFrom: '#E8D5D5',
      backgroundGradientTo: '#D4B8B8',
      // ✅ CARTES - Vraiment bordeaux (pas rose)
      cardBackground: '#D4B5B8',
      cardBackgroundLight: '#DDBFC2',
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
      secondaryLight: '#6f0028',
      accent: '#D4AF37',
      gradientFrom: '#6f0028',
      gradientTo: '#620023',
      backgroundGradientFrom: '#1A0A0F',
      backgroundGradientTo: '#2D0F18',
      cardBackground: 'rgba(45, 15, 24, 0.9)',
      cardBackgroundLight: 'rgba(62, 20, 32, 0.92)',
      cardBorder: 'rgba(212, 175, 55, 0.3)',
      textPrimary: '#D4AF37',
      textSecondary: 'rgba(212, 175, 55, 0.7)',
      textOnPrimary: '#1A0A0F',
      textOnSecondary: '#D4AF37',
    },
  },
},

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
        textOnSecondary: '#f9a8d4',
      },
      dark: {
        primary: '#f472b6',
        primaryLight: '#f9a8d4',
        secondary: '#0f172a',
        secondaryLight: '#1e293b',
        accent: '#f472b6',
        gradientFrom: '#f472b6',
        gradientTo: '#1e293b',
        backgroundGradientFrom: '#334155',
        backgroundGradientTo: '#1e293b',
        cardBackground: 'rgba(15, 23, 42, 0.8)',
        cardBackgroundLight: 'rgba(30, 41, 59, 0.8)',
        cardBorder: 'rgba(244, 114, 182, 0.3)',
        textPrimary: '#f9a8d4',
        textSecondary: 'rgba(249, 168, 212, 0.7)',
        textOnPrimary: '#0f172a',
        textOnSecondary: '#f9a8d4',
      }
    },
  },
  // ========== NOUVEAU THÈME - SOFT PINK (Style Budget Chris) ==========
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
        cardBackground: 'rgba(255, 255, 255, 0.85)',
        cardBackgroundLight: 'rgba(255, 255, 255, 0.95)',
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
        cardBackground: 'rgba(61, 51, 71, 0.8)',
        cardBackgroundLight: 'rgba(61, 51, 71, 0.9)',
        cardBorder: 'rgba(184, 169, 192, 0.3)',
        textPrimary: '#E8D5E0',
        textSecondary: 'rgba(232, 213, 224, 0.7)',
        textOnPrimary: '#2A2530',
        textOnSecondary: '#E8D5E0',
      }
    },
  },
  'excel-teal': {
    key: 'excel-teal',
    name: 'Excel Pro',
    emoji: '📊',
    colors: {
      light: {
        // === MODE CLAIR - STYLE EXCEL ===
        // PRIMARY = Marron chocolat (texte sur fond beige, boutons)
        primary: '#5D4037',           // Marron chocolat (Material Brown 700)
        primaryLight: '#795548',      // Marron moyen (Material Brown 500)
        // SECONDARY = Teal foncé (header, sidebar, bottomNav)
        secondary: '#2D5A5A',         // Teal foncé
        secondaryLight: '#3D7A7A',    // Teal moyen
        // ACCENT = Caramel/or
        accent: '#C9A86C',            // Caramel doré
        // FOND = Beige chaud
        gradientFrom: '#F0EDE8',
        gradientTo: '#E8E4DE',
        backgroundGradientFrom: '#F5F3F0',
        backgroundGradientTo: '#EBE8E3',
        // CARTES
        cardBackground: 'rgba(255, 255, 255, 0.95)',
        cardBackgroundLight: 'rgba(255, 255, 255, 1)',
        cardBorder: 'rgba(93, 64, 55, 0.2)',
        // TEXTE
        textPrimary: '#3E2723',       // Marron très foncé (contenu principal)
        textSecondary: '#5D4037',     // Marron foncé
        textOnPrimary: '#FFFFFF',     // Blanc sur marron
        textOnSecondary: '#F5F0E8',   // CRÈME/BEIGE CLAIR sur teal (sidebar, header)
      },
      dark: {
        // === MODE SOMBRE - INCHANGÉ ===
        primary: '#D4B87A',
        primaryLight: '#E5D4A8',
        secondary: '#1E3D3D',
        secondaryLight: '#2D5A5A',
        accent: '#C9A86C',
        gradientFrom: '#2A2520',
        gradientTo: '#1E1A16',
        backgroundGradientFrom: '#252019',
        backgroundGradientTo: '#1A1612',
        cardBackground: 'rgba(50, 45, 38, 0.9)',
        cardBackgroundLight: 'rgba(50, 45, 38, 0.95)',
        cardBorder: 'rgba(212, 184, 122, 0.35)',
        textPrimary: '#E8E0D5',
        textSecondary: 'rgba(232, 224, 213, 0.75)',
        textOnPrimary: '#1A1612',
        textOnSecondary: '#E8E0D5',
      }
    },
  },
  // ========== THÈMES PASTELS ==========
   'pastel-violet': {
    key: 'pastel-violet',
    name: 'Violet Pastel',
    emoji: '💜',
    colors: {
      light: {
        // === MODE CLAIR - TEXTE PLUS FONCÉ ===
        // PRIMARY = Violet TRÈS foncé (pour textes comme "Décembre")
        primary: '#4A2A4A',           // Violet très foncé
        primaryLight: '#6B4A6B',      // Violet foncé
        // SECONDARY = Violet pastel (header)
        secondary: '#B989D3',         // Violet pastel moyen
        secondaryLight: '#CCA7C7',    // Violet pastel clair
        accent: '#9D61A2',            // Violet saturé
        // FOND = Violet très pâle/lavande
        gradientFrom: '#F2E3E5',
        gradientTo: '#E8D5E0',
        backgroundGradientFrom: '#F8F0F5',
        backgroundGradientTo: '#F2E3E5',
        // CARTES
        cardBackground: 'rgba(255, 255, 255, 0.95)',
        cardBackgroundLight: 'rgba(255, 255, 255, 1)',
        cardBorder: 'rgba(185, 137, 211, 0.3)',
        // TEXTE TRÈS FONCÉ (lisible!)
        textPrimary: '#2D1A2D',       // Violet TRÈS foncé (quasi noir)
        textSecondary: '#4A3A4A',     // Violet foncé
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#FFFFFF',
      },
      dark: {
        // === MODE SOMBRE - PARFAIT, ON NE TOUCHE PAS ===
        primary: '#CCA7C7',
        primaryLight: '#D4B3CF',
        secondary: '#5C3A5C',
        secondaryLight: '#6B4A6B',
        accent: '#B989D3',
        gradientFrom: '#6B4A6B',
        gradientTo: '#5C3A5C',
        backgroundGradientFrom: '#2D1F2D',
        backgroundGradientTo: '#3A2A3A',
        cardBackground: 'rgba(92, 58, 92, 0.8)',
        cardBackgroundLight: 'rgba(107, 74, 107, 0.85)',
        cardBorder: 'rgba(204, 167, 199, 0.3)',
        textPrimary: '#E8D5E0',
        textSecondary: 'rgba(232, 213, 224, 0.7)',
        textOnPrimary: '#2D1F2D',
        textOnSecondary: '#CCA7C7',
      }
    },
  },
  'pastel-bleu': {
    key: 'pastel-bleu',
    name: 'Bleu Pastel',
    emoji: '💙',
    colors: {
      light: {
        primary: '#2D4A5E',           // Bleu foncé (texte partout)
        primaryLight: '#4a7a9e',      // Bleu moyen
        secondary: '#87CEEB',         // Sky blue - bleu pastel doux
        secondaryLight: '#87CEEB',    // Même couleur
        accent: '#5B8DB8',            // Bleu pastel moyen
        gradientFrom: '#E8F4FC',      // Bleu très pâle
        gradientTo: '#D6EAF5',        // Bleu pâle
        backgroundGradientFrom: '#F0F8FF',  // Alice blue - très pâle
        backgroundGradientTo: '#E8F4FC',    // Bleu très pâle
        cardBackground: 'rgba(255, 255, 255, 0.92)',
        cardBackgroundLight: 'rgba(255, 255, 255, 0.96)',
        cardBorder: 'rgba(45, 74, 94, 0.2)',
        textPrimary: '#2D4A5E',       // Bleu foncé pour texte
        textSecondary: 'rgba(45, 74, 94, 0.7)',
        textOnPrimary: '#FFFFFF',     // Blanc sur boutons
        textOnSecondary: '#2D4A5E',   // Bleu foncé sur header pastel
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
        cardBackground: 'rgba(30, 58, 77, 0.85)',
        cardBackgroundLight: 'rgba(42, 77, 99, 0.9)',
        cardBorder: 'rgba(137, 196, 232, 0.25)',
        textPrimary: '#D6EAF5',
        textSecondary: 'rgba(214, 234, 245, 0.7)',
        textOnPrimary: '#152530',
        textOnSecondary: '#D6EAF5',
      }
    },
  },
  'pastel-vert': {
    key: 'pastel-vert',
    name: 'Vert Pastel',
    emoji: '💚',
    colors: {
      light: {
        primary: '#2e5a3a',           // Vert foncé (texte sur contenu + header)
        primaryLight: '#4a7c59',      // Vert sauge
        // SECONDARY = fond header/nav → VERT PASTEL CLAIR
        secondary: '#8fbc8f',         // Vert pastel doux (dark sea green)
        secondaryLight: '#8fbc8f',    // Même couleur
        accent: '#6b9b7a',            // Vert pastel moyen
        gradientFrom: '#e8f5e9',      // Vert très pâle
        gradientTo: '#c8e6c9',        // Vert pâle
        backgroundGradientFrom: '#f1f8f2',  // Fond vert très très pâle
        backgroundGradientTo: '#e8f5e9',    // Fond vert très pâle
        cardBackground: 'rgba(255, 255, 255, 0.92)',
        cardBackgroundLight: 'rgba(255, 255, 255, 0.96)',
        cardBorder: 'rgba(46, 90, 58, 0.2)',
        textPrimary: '#2e5a3a',       // Vert foncé pour texte sur cartes
        textSecondary: 'rgba(46, 90, 58, 0.7)',
        textOnPrimary: '#FFFFFF',     // Blanc sur boutons verts
        textOnSecondary: '#2e5a3a',   // Vert foncé sur header pastel
      },
      dark: {
        primary: '#a5d6a7',           // Vert pastel clair
        primaryLight: '#c8e6c9',      // Vert très pâle
        secondary: '#1b3d24',         // Vert très foncé (header)
        secondaryLight: '#2e5a3a',    // Vert foncé
        accent: '#81c784',            // Vert pastel
        gradientFrom: '#2e5a3a',      // Vert foncé
        gradientTo: '#1b3d24',        // Vert très foncé
        backgroundGradientFrom: '#1a2e1f',  // Fond très sombre
        backgroundGradientTo: '#1b3d24',    // Fond sombre
        cardBackground: 'rgba(27, 61, 36, 0.85)',
        cardBackgroundLight: 'rgba(46, 90, 58, 0.9)',
        cardBorder: 'rgba(165, 214, 167, 0.25)',
        textPrimary: '#c8e6c9',       // Vert pâle (texte)
        textSecondary: 'rgba(200, 230, 201, 0.7)',
        textOnPrimary: '#1b3d24',     // Vert foncé sur boutons
        textOnSecondary: '#c8e6c9',   // Vert pâle sur header
      }
    },
  },
  'pastel-peche': {
    key: 'pastel-peche',
    name: 'Pêche Pastel',
    emoji: '🧡',
    colors: {
      light: {
        primary: '#8B5A4A',
        primaryLight: '#A67C6D',
        secondary: '#F5B89A',
        secondaryLight: '#F5B89A',
        accent: '#E8A088',
        gradientFrom: '#FDE8DC',
        gradientTo: '#FCDCD0',
        backgroundGradientFrom: '#FFF5F0',
        backgroundGradientTo: '#FDE8DC',
        cardBackground: 'rgba(255, 255, 255, 0.92)',
        cardBackgroundLight: 'rgba(255, 255, 255, 0.96)',
        cardBorder: 'rgba(139, 90, 74, 0.2)',
        textPrimary: '#6B4A3A',
        textSecondary: 'rgba(107, 74, 58, 0.7)',
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#6B4A3A',
      },
      dark: {
        primary: '#F5B89A',           // Pêche pastel clair
        primaryLight: '#FCDCD0',      // Pêche très pâle
        // Header = corail/saumon foncé
        secondary: '#5C3D3D',         // Corail foncé (plus rouge)
        secondaryLight: '#6B4A4A',    // Corail moyen
        accent: '#E8A088',            // Corail doux
        gradientFrom: '#6B4A4A',      // Corail moyen
        gradientTo: '#5C3D3D',        // Corail foncé
        // Fond = rose/corail très foncé (PAS marron)
        backgroundGradientFrom: '#3D2828',  // Rose foncé / bordeaux sombre
        backgroundGradientTo: '#4A3333',    // Rose/corail foncé
        cardBackground: 'rgba(92, 61, 61, 0.85)',  // Cartes corail foncé
        cardBackgroundLight: 'rgba(107, 74, 74, 0.9)',
        cardBorder: 'rgba(245, 184, 154, 0.25)',
        textPrimary: '#FCDCD0',       // Pêche pâle (texte)
        textSecondary: 'rgba(252, 220, 208, 0.7)',
        textOnPrimary: '#3D2828',     // Foncé sur boutons
        textOnSecondary: '#FCDCD0',   // Pêche pâle sur header
      }
    },
  },
  // ========== THÈMES NATURE ==========
   'ocean': {
    key: 'ocean',
    name: 'Océan',
    emoji: '🌊',
    colors: {
      light: {
        // === MODE CLAIR - OCÉAN LISIBLE ===
        // PRIMARY = Bleu océan foncé (texte visible sur fond clair)
        primary: '#1A5276',           // Bleu océan foncé
        primaryLight: '#2980B9',      // Bleu océan moyen
        // SECONDARY = Turquoise/Teal (header, nav)
        secondary: '#17A2B8',         // Turquoise
        secondaryLight: '#20C5DB',    // Turquoise clair
        accent: '#48C9B0',            // Vert d'eau
        // FOND = Bleu très pâle
        gradientFrom: '#E8F4F8',      // Bleu glacier très pâle
        gradientTo: '#D4EBF2',        // Bleu ciel pâle
        backgroundGradientFrom: '#F0F9FC',  // Fond bleu très pâle
        backgroundGradientTo: '#E8F4F8',    // Fond bleu glacier
        // CARTES
        cardBackground: 'rgba(255, 255, 255, 0.95)',
        cardBackgroundLight: 'rgba(255, 255, 255, 1)',
        cardBorder: 'rgba(26, 82, 118, 0.2)',
        // TEXTE = BLEU OCÉAN FONCÉ (lisible!)
        textPrimary: '#0E3D5A',       // Bleu océan très foncé
        textSecondary: '#1A5276',     // Bleu océan foncé
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#FFFFFF',   // Blanc sur turquoise (header/nav)
      },
      dark: {
        primary: '#5DADE2',           // Bleu clair
        primaryLight: '#85C1E9',      // Bleu très clair
        secondary: '#1B4F72',         // Bleu océan foncé
        secondaryLight: '#21618C',    // Bleu océan moyen
        accent: '#48C9B0',            // Vert d'eau
        gradientFrom: '#1B4F72',
        gradientTo: '#154360',
        backgroundGradientFrom: '#0E2A47',  // Fond océan profond
        backgroundGradientTo: '#1B4F72',
        cardBackground: 'rgba(27, 79, 114, 0.8)',
        cardBackgroundLight: 'rgba(33, 97, 140, 0.85)',
        cardBorder: 'rgba(93, 173, 226, 0.3)',
        textPrimary: '#D6EAF8',       // Bleu très clair
        textSecondary: 'rgba(214, 234, 248, 0.7)',
        textOnPrimary: '#0E2A47',
        textOnSecondary: '#D6EAF8',
      }
    },
  },
'foret': {
    key: 'foret',
    name: 'Forêt',
    emoji: '🌲',
    colors: {
      // Mode clair
      light: {
        primary: '#2D4A3E',           // Vert forêt FONCÉ (pour textes modal)
        primaryLight: '#4A6B58',      // Vert mousse
        secondary: '#3A5E4F',         // Vert forêt pour header/footer
        secondaryLight: '#F5F0E8',    // Crème naturel pour modal
        accent: '#C5E1B8',            // Vert sauge clair (accent)
        gradientFrom: '#C5E1B8',      // Vert sauge clair
        gradientTo: '#D4C4A8',        // Beige sable
        backgroundGradientFrom: '#D5CEC3',
        backgroundGradientTo: '#C9C2B7',
        cardBackground: 'rgba(255, 255, 255, 0.92)',
        cardBackgroundLight: 'rgba(255, 255, 255, 0.85)',
        cardBorder: 'rgba(74, 107, 88, 0.3)',
        textPrimary: '#2D4A3E',
        textSecondary: 'rgba(45, 74, 62, 0.7)',
        textOnPrimary: '#FFFFFF',     // Blanc sur boutons verts foncés
        textOnSecondary: '#C5E1B8',   // Vert sauge CLAIR sur header vert foncé
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
        cardBackground: 'rgba(45, 74, 62, 0.6)',
        cardBackgroundLight: 'rgba(58, 94, 79, 0.7)',
        cardBorder: 'rgba(139, 187, 154, 0.3)',
        textPrimary: '#C5E1B8',
        textSecondary: 'rgba(197, 225, 184, 0.7)',
        textOnPrimary: '#1B3D2F',
        textOnSecondary: '#A4C89F',
      }
    },
  },
// ========== 🌿 THÈME MENTHE FRAÎCHE ==========
  'menthe': {
    key: 'menthe',
    name: 'Menthe Fraîche',
    emoji: '🌿',
    colors: {
      // Mode clair
      light: {
        primary: '#0D5C52',           // Vert menthe FONCÉ (pour textes modal)
        primaryLight: '#14857A',      // Vert menthe moyen
        secondary: '#0F766E',         // Vert menthe foncé pour header/footer
        secondaryLight: '#F0FDFA',    // Menthe très clair pour modal
        accent: '#2DD4BF',            // Turquoise vif (accent)
        gradientFrom: '#99F6E4',      // Menthe clair
        gradientTo: '#A7F3D0',        // Vert eau clair
        backgroundGradientFrom: '#CCFBF1',  // Fond menthe pastel
        backgroundGradientTo: '#D1FAE5',    // Fond vert eau pastel
        cardBackground: 'rgba(255, 255, 255, 0.92)',
        cardBackgroundLight: 'rgba(255, 255, 255, 0.85)',
        cardBorder: 'rgba(15, 118, 110, 0.25)',
        textPrimary: '#0D5C52',       // Vert menthe foncé pour texte
        textSecondary: 'rgba(13, 92, 82, 0.7)',
        textOnPrimary: '#FFFFFF',     // Blanc sur boutons
        textOnSecondary: '#99F6E4',   // Menthe clair sur header foncé
      },
      // Mode sombre
      dark: {
        primary: '#5EEAD4',           // Turquoise lumineux
        primaryLight: '#99F6E4',      // Menthe clair
        secondary: '#134E4A',         // Vert menthe très profond
        secondaryLight: '#1A5D57',    // Vert menthe profond
        accent: '#2DD4BF',            // Turquoise vif
        gradientFrom: '#2DD4BF',      // Turquoise
        gradientTo: '#14B8A6',        // Teal
        backgroundGradientFrom: '#134E4A',  // Fond sombre
        backgroundGradientTo: '#0F3D3A',    // Fond encore plus sombre
        cardBackground: 'rgba(20, 78, 74, 0.6)',
        cardBackgroundLight: 'rgba(26, 93, 87, 0.7)',
        cardBorder: 'rgba(94, 234, 212, 0.3)',
        textPrimary: '#99F6E4',       // Menthe clair
        textSecondary: 'rgba(153, 246, 228, 0.7)',
        textOnPrimary: '#134E4A',     // Vert foncé sur boutons clairs
        textOnSecondary: '#5EEAD4',   // Turquoise sur header
      }
    },
  },

  // ========== 🌅 THÈME COUCHER DE SOLEIL ==========
  'sunset': {
    key: 'sunset',
    name: 'Coucher de Soleil',
    emoji: '🌅',
    colors: {
      // Mode clair
      light: {
        primary: '#DC2626',           // Rouge vif (boutons)
        primaryLight: '#EF4444',      // Rouge clair
        secondary: '#DC2626',         // Rouge vif pour header/footer
        secondaryLight: '#FFF7ED',    // Crème orangé pour modal
        accent: '#F59E0B',            // Jaune doré (accent)
        gradientFrom: '#FDBA74',      // Orange clair
        gradientTo: '#FCA5A5',        // Rose saumon
        backgroundGradientFrom: '#FFEDD5',  // Fond pêche clair
        backgroundGradientTo: '#FEE2E2',    // Fond rose très clair
        cardBackground: 'rgba(255, 255, 255, 0.92)',
        cardBackgroundLight: 'rgba(255, 255, 255, 0.85)',
        cardBorder: 'rgba(220, 38, 38, 0.25)',
        textPrimary: '#7C2D12',       // Brun orangé foncé pour texte
        textSecondary: 'rgba(124, 45, 18, 0.7)',
        textOnPrimary: '#FFFFFF',     // Blanc sur boutons rouges
        textOnSecondary: '#FFF7ED',   // Crème clair sur header rouge
      },
      // Mode sombre
      dark: {
        primary: '#FB923C',           // Orange lumineux
        primaryLight: '#FDBA74',      // Orange clair
        secondary: '#991B1B',         // Rouge foncé profond
        secondaryLight: '#7C2D12',    // Brun orangé
        accent: '#FBBF24',            // Jaune doré
        gradientFrom: '#FB923C',      // Orange
        gradientTo: '#F472B6',        // Rose
        backgroundGradientFrom: '#7C2D12',  // Fond brun orangé
        backgroundGradientTo: '#581C0C',    // Fond brun plus sombre
        cardBackground: 'rgba(124, 45, 18, 0.6)',
        cardBackgroundLight: 'rgba(154, 52, 18, 0.7)',
        cardBorder: 'rgba(251, 146, 60, 0.3)',
        textPrimary: '#FDBA74',       // Orange clair
        textSecondary: 'rgba(253, 186, 116, 0.7)',
        textOnPrimary: '#7C2D12',     // Brun foncé sur boutons orange
        textOnSecondary: '#FDBA74',   // Orange clair sur header
      }
    },
  },

 'cerise': {
    key: 'cerise',
    name: 'Cerise',
    emoji: '🍒',
    colors: {
      light: {
        // PRIMARY = couleur des boutons actifs
        primary: '#be123c',           // Rouge cerise vif
        primaryLight: '#e11d48',      // Rouge cerise plus clair
        // SECONDARY = fond du header → TRÈS FONCÉ
        secondary: '#6b1530',         // Bordeaux très foncé (header)
        // SECONDARYLIGHT = fond du modal → CLAIR
        secondaryLight: '#FFF1F2',    // Rose très clair (modal)
        accent: '#f472b6',            // Rose vif
        gradientFrom: '#F5D0E0',      // Rose froid/mauve pâle
        gradientTo: '#E8C2D4',        // Rose mauve
        backgroundGradientFrom: '#FDF2F8',  // Fond page rose très clair (inchangé)
        backgroundGradientTo: '#F8E8F0',    // Fond rose légèrement mauve
        cardBackground: 'rgba(255, 255, 255, 0.9)',  // Cartes blanches
        cardBackgroundLight: 'rgba(255, 255, 255, 0.95)',
        cardBorder: 'rgba(190, 18, 60, 0.25)',
        textPrimary: '#881337',       // Texte bordeaux foncé
        textSecondary: 'rgba(136, 19, 55, 0.75)',
        textOnPrimary: '#ffffff',     // Texte BLANC sur boutons
        textOnSecondary: '#ffffff',   // Texte BLANC sur header/bottomNav
      },
      dark: {
        // MODE SOMBRE - PARFAIT, ON NE TOUCHE PLUS
        primary: '#fb7185',           // Rose vif (boutons actifs)
        primaryLight: '#fda4af',      // Rose clair
        secondary: '#4c0519',         // Bordeaux très foncé (header/nav)
        secondaryLight: '#881337',    // Bordeaux foncé (fond inputs)
        accent: '#f472b6',            // Rose vif
        gradientFrom: '#831843',      // Bordeaux
        gradientTo: '#701a3a',        // Bordeaux foncé
        backgroundGradientFrom: '#1c0a10',  // Fond très sombre
        backgroundGradientTo: '#2d0a14',    // Fond sombre
        cardBackground: 'rgba(76, 5, 25, 0.95)',  // Opaque
        cardBackgroundLight: 'rgba(76, 5, 25, 0.98)',
        cardBorder: 'rgba(251, 113, 133, 0.3)',
        textPrimary: '#fecdd3',       // Texte rose pâle
        textSecondary: 'rgba(254, 205, 211, 0.7)',
        textOnPrimary: '#4c0519',     // Texte FONCÉ sur boutons
        textOnSecondary: '#fecdd3',   // Texte rose sur header
      }
    },
  },
 'chocolat': {
    key: 'chocolat',
    name: 'Chocolat',
    emoji: '🍫',
    colors: {
      light: {
        primary: '#5D4037',           // Brun chocolat (boutons, textes modal)
        primaryLight: '#795548',      // Brun moyen
        secondary: '#4E342E',         // Brun foncé pour header/footer
        secondaryLight: '#FFF8E7',    // Crème/vanille pour modal
        accent: '#D7CCC8',            // Beige/taupe clair (accent)
        gradientFrom: '#E8DCD0',      // Beige chaud
        gradientTo: '#D4C4B0',        // Beige sable
        backgroundGradientFrom: '#F5EFE6',  // Fond crème chaud
        backgroundGradientTo: '#E8DCD0',    // Fond beige chaud
        cardBackground: 'rgba(255, 255, 255, 0.92)',
        cardBackgroundLight: 'rgba(255, 255, 255, 0.85)',
        cardBorder: 'rgba(93, 64, 55, 0.25)',
        textPrimary: '#3E2723',       // Brun très foncé pour texte
        textSecondary: 'rgba(62, 39, 35, 0.7)',
        textOnPrimary: '#FFFFFF',     // Blanc sur boutons
        textOnSecondary: '#F5EFE6',   // Crème sur header brun
      },
      dark: {
        primary: '#BCAAA4',           // Taupe clair (boutons)
        primaryLight: '#D7CCC8',      // Beige clair
        secondary: '#3E2723',         // Brun très foncé pour header
        secondaryLight: '#4E342E',    // Brun foncé
        accent: '#A1887F',            // Taupe moyen
        gradientFrom: '#8D6E63',      // Brun moyen
        gradientTo: '#6D4C41',        // Brun
        backgroundGradientFrom: '#3E2723',  // Fond brun très foncé
        backgroundGradientTo: '#2C1A15',    // Fond encore plus sombre
        cardBackground: 'rgba(62, 39, 35, 0.6)',
        cardBackgroundLight: 'rgba(78, 52, 46, 0.7)',
        cardBorder: 'rgba(188, 170, 164, 0.3)',
        textPrimary: '#D7CCC8',       // Beige clair
        textSecondary: 'rgba(215, 204, 200, 0.7)',
        textOnPrimary: '#3E2723',     // Brun foncé sur boutons clairs
        textOnSecondary: '#D7CCC8',   // Beige sur header
      }
    },
  },

 // ========== THÈMES ÉLÉGANTS ==========
  'rose-gold': {
    key: 'rose-gold',
    name: 'Rose Gold',
    emoji: '✨',
    colors: {
      light: {
        primary: '#B76E79',           // Rose gold principal
        primaryLight: '#C9939B',      // Rose gold clair
        secondary: '#8E5D63',         // Rose gold foncé pour header/footer
        secondaryLight: '#FDF5F6',    // Rose très pâle pour modal
        accent: '#E8B4B8',            // Rose gold pâle (accent)
        gradientFrom: '#EACFD0',      // Rose gold très clair
        gradientTo: '#DEB8BA',        // Rose gold clair
        backgroundGradientFrom: '#FDF5F6',  // Fond rose très pâle
        backgroundGradientTo: '#F5E6E8',    // Fond rose pâle
        cardBackground: 'rgba(255, 255, 255, 0.92)',
        cardBackgroundLight: 'rgba(255, 255, 255, 0.85)',
        cardBorder: 'rgba(183, 110, 121, 0.25)',
        textPrimary: '#6B4449',       // Brun rosé foncé pour texte
        textSecondary: 'rgba(107, 68, 73, 0.7)',
        textOnPrimary: '#FFFFFF',     // Blanc sur boutons
        textOnSecondary: '#FDF5F6',   // Rose pâle sur header
      },
      dark: {
        primary: '#E8B4B8',           // Rose gold clair (boutons)
        primaryLight: '#EACFD0',      // Rose gold très clair
        secondary: '#5C3D40',         // Brun rosé foncé pour header
        secondaryLight: '#6B4449',    // Brun rosé
        accent: '#C9939B',            // Rose gold moyen
        gradientFrom: '#B76E79',      // Rose gold
        gradientTo: '#A15D67',        // Rose gold foncé
        backgroundGradientFrom: '#5C3D40',  // Fond brun rosé foncé
        backgroundGradientTo: '#4A3033',    // Fond encore plus sombre
        cardBackground: 'rgba(92, 61, 64, 0.6)',
        cardBackgroundLight: 'rgba(107, 68, 73, 0.7)',
        cardBorder: 'rgba(232, 180, 184, 0.3)',
        textPrimary: '#EACFD0',       // Rose gold très clair
        textSecondary: 'rgba(234, 207, 208, 0.7)',
        textOnPrimary: '#5C3D40',     // Brun rosé sur boutons clairs
        textOnSecondary: '#E8B4B8',   // Rose gold sur header
      }
    },
  },

 'lavande': {
    key: 'lavande',
    name: 'Lavande',
    emoji: '💐',
    colors: {
      light: {
        primary: '#7C6A9C',           // Violet lavande (boutons, textes modal)
        primaryLight: '#9B8AB8',      // Lavande moyen
        secondary: '#6B5B7E',         // Violet lavande foncé pour header/footer
        secondaryLight: '#F8F5FC',    // Lavande très pâle pour modal
        accent: '#C59EFB',            // Lavande vif (accent)
        gradientFrom: '#E2D4F0',      // Lavande clair
        gradientTo: '#D4C4E8',        // Lavande rosé
        backgroundGradientFrom: '#F5F0FA',  // Fond lavande très pâle
        backgroundGradientTo: '#EDE5F5',    // Fond lavande pâle
        cardBackground: 'rgba(255, 255, 255, 0.92)',
        cardBackgroundLight: 'rgba(255, 255, 255, 0.85)',
        cardBorder: 'rgba(124, 106, 156, 0.25)',
        textPrimary: '#4A3D5C',       // Violet foncé pour texte
        textSecondary: 'rgba(74, 61, 92, 0.7)',
        textOnPrimary: '#FFFFFF',     // Blanc sur boutons
        textOnSecondary: '#F5F0FA',   // Lavande pâle sur header
      },
      dark: {
        primary: '#C59EFB',           // Lavande vif (boutons)
        primaryLight: '#D4B8FC',      // Lavande clair
        secondary: '#3D2E4F',         // Violet très foncé pour header
        secondaryLight: '#4A3D5C',    // Violet foncé
        accent: '#9B8AB8',            // Lavande moyen
        gradientFrom: '#7C6A9C',      // Violet lavande
        gradientTo: '#6B5B7E',        // Violet lavande foncé
        backgroundGradientFrom: '#2D2139',  // Fond violet très foncé
        backgroundGradientTo: '#231A2C',    // Fond encore plus sombre
        cardBackground: 'rgba(61, 46, 79, 0.6)',
        cardBackgroundLight: 'rgba(74, 61, 92, 0.7)',
        cardBorder: 'rgba(197, 158, 251, 0.3)',
        textPrimary: '#E2D4F0',       // Lavande clair
        textSecondary: 'rgba(226, 212, 240, 0.7)',
        textOnPrimary: '#2D2139',     // Violet foncé sur boutons clairs
        textOnSecondary: '#D4B8FC',   // Lavande clair sur header
      }
    },
  },

'nuit-etoilee': {
    key: 'nuit-etoilee',
    name: 'Nuit Étoilée',
    emoji: '✨',
    colors: {
      light: {
        primary: '#4F46E5',           // Indigo vif
        primaryLight: '#6366F1',      // Indigo clair
        secondary: '#1E1B4B',         // Indigo très foncé pour header/footer
        secondaryLight: '#EEF2FF',    // Indigo très pâle pour modal
        accent: '#FBBF24',            // Or étoile (accent)
        gradientFrom: '#A5B4FC',      // Bleu lavande plus saturé
        gradientTo: '#C4B5FD',        // Violet lavande
        backgroundGradientFrom: '#C7D2FE',  // Fond bleu lavande (plus coloré)
        backgroundGradientTo: '#DDD6FE',    // Fond violet lavande
        cardBackground: 'rgba(255, 255, 255, 0.85)',
        cardBackgroundLight: 'rgba(255, 255, 255, 0.80)',
        cardBorder: 'rgba(79, 70, 229, 0.25)',
        textPrimary: '#1E1B4B',       // Indigo très foncé pour texte
        textSecondary: 'rgba(30, 27, 75, 0.7)',
        textOnPrimary: '#FFFFFF',     // Blanc sur boutons
        textOnSecondary: '#E0E7FF',   // Bleu lavande sur header
      },
      dark: {
        primary: '#60A5FA',           // Bleu lumineux (boutons)
        primaryLight: '#93C5FD',      // Bleu clair
        secondary: '#0C1929',         // Bleu nuit TRÈS profond pour header
        secondaryLight: '#132742',    // Bleu nuit profond
        accent: '#FBBF24',            // Or étoile
        gradientFrom: '#6366F1',      // Indigo vif
        gradientTo: '#8B5CF6',        // Violet vif
        backgroundGradientFrom: '#050A18',  // COSMOS PROFOND
        backgroundGradientTo: '#0C1929',    // Bleu nuit très profond
        cardBackground: 'rgba(12, 25, 41, 0.9)',
        cardBackgroundLight: 'rgba(19, 39, 66, 0.9)',
        cardBorder: 'rgba(96, 165, 250, 0.3)',
        textPrimary: '#E0F2FE',       // Bleu très clair
        textSecondary: 'rgba(224, 242, 254, 0.7)',
        textOnPrimary: '#050A18',     // Bleu cosmos sur boutons clairs
        textOnSecondary: '#93C5FD',   // Bleu clair sur header
      }
    },
  },
  
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
        cardBackground: 'rgba(255, 255, 255, 0.9)',
        cardBackgroundLight: 'rgba(250, 250, 250, 0.9)',
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
        cardBackground: 'rgba(23, 23, 23, 0.8)',
        cardBackgroundLight: 'rgba(38, 38, 38, 0.8)',
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