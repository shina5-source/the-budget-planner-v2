'use client';

import { 
  Home, Wallet, ArrowLeftRight, BarChart3, Calendar, 
  Target, CreditCard, PiggyBank, Mail, Settings, 
  MoreHorizontal, ClipboardList
} from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface PageTitleProps {
  page: string;
  customTitle?: string;
  customSubtitle?: string;
}

const pageConfig: Record<string, { icon: React.ElementType; title: string; subtitle: string }> = {
  accueil: { icon: Home, title: 'Accueil', subtitle: 'Tableau de bord' },
  budget: { icon: Wallet, title: 'Budget', subtitle: 'Gérez votre budget mensuel' },
  transactions: { icon: ArrowLeftRight, title: 'Transactions', subtitle: 'Historique des mouvements' },
  statistiques: { icon: BarChart3, title: 'Statistiques', subtitle: 'Analyses et graphiques' },
  previsionnel: { icon: Calendar, title: 'Prévisionnel', subtitle: 'Planification financière' },
  objectifs: { icon: Target, title: 'Objectifs', subtitle: 'Suivez vos objectifs' },
  'credits-dettes': { icon: CreditCard, title: 'Crédits & Dettes', subtitle: 'Gestion des crédits' },
  epargnes: { icon: PiggyBank, title: 'Épargnes', subtitle: 'Vos économies' },
  enveloppes: { icon: Mail, title: 'Enveloppes', subtitle: 'Budgets par catégorie' },
  memo: { icon: ClipboardList, title: 'Mémo', subtitle: 'Notes et rappels' },
  parametres: { icon: Settings, title: 'Paramètres', subtitle: 'Configuration' },
  plus: { icon: MoreHorizontal, title: 'Plus', subtitle: 'Options supplémentaires' },
};

export default function PageTitle({ page, customTitle, customSubtitle }: PageTitleProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const config = pageConfig[page] || pageConfig.accueil;
  const Icon = config.icon;
  const title = customTitle || config.title;
  const subtitle = customSubtitle || config.subtitle;

  return (
    <div className="flex flex-col items-center justify-center text-center mb-6 w-full">
      {/* Icône au-dessus du titre pour un centrage parfait */}
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-2"
        style={{ background: `${theme.colors.primary}20` }}
      >
        <Icon className="w-6 h-6" style={{ color: theme.colors.primary }} />
      </div>
      
      {/* Titre centré */}
      <h1 
        className="text-xl font-bold"
        style={{ color: theme.colors.textPrimary }}
      >
        {title}
      </h1>
      
      {/* Sous-titre centré */}
      <p 
        className="text-xs mt-0.5"
        style={{ color: theme.colors.textSecondary }}
      >
        {subtitle}
      </p>
    </div>
  );
}