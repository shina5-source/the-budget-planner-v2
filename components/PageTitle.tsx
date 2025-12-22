'use client';

import { 
  PiggyBank, 
  Wallet, 
  BarChart3, 
  Calendar, 
  Target, 
  CreditCard, 
  Mail, 
  StickyNote, 
  Settings,
  ArrowLeftRight,
  Home,
  MoreHorizontal,
  LucideIcon
} from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

// Configuration des pages avec leurs icônes et sous-titres
const pageConfig: Record<string, { icon: LucideIcon; title: string; subtitle: string }> = {
  accueil: {
    icon: Home,
    title: 'Accueil',
    subtitle: 'Vue d\'ensemble de vos finances'
  },
  budget: {
    icon: Wallet,
    title: 'Budget',
    subtitle: 'Vue d\'ensemble du mois'
  },
  transactions: {
    icon: ArrowLeftRight,
    title: 'Transactions',
    subtitle: 'Historique de vos mouvements'
  },
  statistiques: {
    icon: BarChart3,
    title: 'Statistiques',
    subtitle: 'Analyse de vos finances'
  },
  previsionnel: {
    icon: Calendar,
    title: 'Prévisionnel',
    subtitle: 'Planification budgétaire'
  },
  objectifs: {
    icon: Target,
    title: 'Objectifs',
    subtitle: 'Suivez vos objectifs financiers'
  },
  'credits-dettes': {
    icon: CreditCard,
    title: 'Crédits & Dettes',
    subtitle: 'Suivi de vos engagements'
  },
  epargnes: {
    icon: PiggyBank,
    title: 'Épargnes',
    subtitle: 'Suivi de votre épargne'
  },
  enveloppes: {
    icon: Mail,
    title: 'Enveloppes',
    subtitle: 'Gestion par enveloppes'
  },
  memo: {
    icon: StickyNote,
    title: 'Mémo',
    subtitle: 'Notes et rappels'
  },
  parametres: {
    icon: Settings,
    title: 'Paramètres',
    subtitle: 'Configuration de l\'application'
  },
  plus: {
    icon: MoreHorizontal,
    title: 'Plus',
    subtitle: 'Accès rapide aux fonctionnalités'
  }
};

interface PageTitleProps {
  page: string;
  customTitle?: string;
  customSubtitle?: string;
  showIcon?: boolean;
}

export default function PageTitle({ 
  page, 
  customTitle, 
  customSubtitle,
  showIcon = true 
}: PageTitleProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const config = pageConfig[page] || {
    icon: Home,
    title: customTitle || 'Page',
    subtitle: customSubtitle || ''
  };

  const Icon = config.icon;
  const title = customTitle || config.title;
  const subtitle = customSubtitle || config.subtitle;

  return (
    <div className="text-center mb-4 animate-fadeIn">
      <div className="flex items-center justify-center gap-2 mb-1">
        {showIcon && (
          <div 
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: `${theme.colors.primary}20` }}
          >
            <Icon className="w-4 h-4" style={{ color: theme.colors.primary }} />
          </div>
        )}
        <h1 className="text-lg font-semibold" style={{ color: theme.colors.textPrimary }}>
          {title}
        </h1>
      </div>
      {subtitle && (
        <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}