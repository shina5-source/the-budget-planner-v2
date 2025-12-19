'use client';

import { Wallet, Sparkles, Plus } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface EmptyStateProps {
  userName: string;
  onNavigate: (page: string) => void;
}

export default function EmptyState({ userName, onNavigate }: EmptyStateProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };

  return (
    <div 
      className="backdrop-blur-sm rounded-2xl p-6 shadow-sm border text-center animate-fade-in-up" 
      style={cardStyle}
    >
      <div className="relative inline-block mb-4">
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center animate-bounce-slow" 
          style={{ background: `${theme.colors.primary}15` }}
        >
          <Wallet className="w-10 h-10" style={{ color: theme.colors.primary }} />
        </div>
        <div 
          className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center border-2" 
          style={{ background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }}
        >
          <Sparkles className="w-4 h-4" style={{ color: theme.colors.primary }} />
        </div>
      </div>
      
      <p className="text-base font-semibold mb-2" style={textPrimary}>
        Bienvenue {userName} !
      </p>
      <p className="text-sm mb-4" style={textSecondary}>
        Commencez par ajouter vos premières transactions
      </p>
      
      <button 
        onClick={() => onNavigate('transactions')} 
        className="flex items-center justify-center gap-2 mx-auto px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
        style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}
      >
        <Plus className="w-4 h-4" />
        Ajouter une transaction
      </button>
    </div>
  );
}