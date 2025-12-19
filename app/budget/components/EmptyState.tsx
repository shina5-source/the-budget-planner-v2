'use client';

import { Sparkles, Wallet, Plus } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface EmptyStateProps {
  message: string;
  icon?: string;
  title?: string;
  onAddTransaction?: () => void;
}

export function EmptyState({ 
  message, 
  icon = '📊', 
  title = 'Aucune donnée',
  onAddTransaction 
}: EmptyStateProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  
  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };

  return (
    <div className="backdrop-blur-sm rounded-2xl p-8 shadow-sm border text-center animate-fade-in-up" style={cardStyle}>
      <div className="relative inline-block mb-4">
        <div className="w-20 h-20 rounded-full flex items-center justify-center animate-pulse-slow" style={{ background: `${theme.colors.primary}15` }}>
          <span className="text-4xl">{icon}</span>
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center border-2" style={{ background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }}>
          <Sparkles className="w-4 h-4" style={{ color: theme.colors.primary }} />
        </div>
      </div>
      <p className="text-base font-semibold mb-2" style={textPrimary}>{title}</p>
      <p className="text-sm mb-4" style={textSecondary}>{message}</p>
      
      {/* Bouton cliquable */}
      {onAddTransaction ? (
        <button
          type="button"
          onClick={onAddTransaction}
          className="flex items-center justify-center gap-2 text-xs px-4 py-2.5 rounded-full mx-auto transition-all hover:scale-105 active:scale-95 cursor-pointer"
          style={{ 
            background: theme.colors.primary, 
            color: theme.colors.textOnPrimary || '#ffffff',
            boxShadow: `0 4px 12px ${theme.colors.primary}40`
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une transaction</span>
        </button>
      ) : (
        <div className="flex items-center justify-center gap-2 text-xs px-4 py-2 rounded-full" style={{ background: `${theme.colors.primary}10`, color: theme.colors.primary }}>
          <Wallet className="w-4 h-4" />
          <span>Ajoutez des transactions pour commencer</span>
        </div>
      )}
    </div>
  );
}
