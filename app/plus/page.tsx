"use client";

import { CreditCard, PiggyBank, Building2, FileText, Mail, Settings, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/theme-context';
import { AppShell } from '@/components';

function PlusContent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const router = useRouter();

  const menuItems = [
    { icon: CreditCard, label: 'Transactions', page: '/transactions' },
    { icon: PiggyBank, label: 'Épargnes', page: '/epargnes' },
    { icon: Building2, label: 'Crédits & Dettes', page: '/credits-dettes' },
    { icon: FileText, label: 'Mémo', page: '/memo' },
    { icon: Mail, label: 'Enveloppes', page: '/enveloppes' },
    { icon: BarChart3, label: 'Statistiques', page: '/statistiques' },
    { icon: Settings, label: 'Paramètres', page: '/parametres' },
  ];

  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };

  return (
    <div className="pb-4">
      <div className="text-center mb-4">
        <h1 className="text-lg font-medium" style={textPrimary}>Plus</h1>
        <p className="text-xs" style={textSecondary}>Accès rapide aux fonctionnalités</p>
      </div>

      <div className="space-y-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={() => router.push(item.page)}
              className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border w-full flex items-center gap-4 active:scale-[0.98] transition-transform"
              style={cardStyle}
            >
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center border"
                style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}
              >
                <Icon className="w-6 h-6" style={textPrimary} />
              </div>
              <span className="text-sm font-medium" style={textPrimary}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function PlusPage() {
  const router = useRouter();

  const handleNavigate = (page: string) => {
    if (page === 'accueil') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  };

  return (
    <AppShell currentPage="plus" onNavigate={handleNavigate}>
      <PlusContent />
    </AppShell>
  );
}