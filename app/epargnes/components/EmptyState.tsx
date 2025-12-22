'use client';

import { PiggyBank, Plus } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface EmptyStateProps {
  message?: string;
  subMessage?: string;
  onAddClick?: () => void;
  showAddButton?: boolean;
}

export default function EmptyState({ 
  message = "Aucune épargne ce mois",
  subMessage = "Commencez à épargner pour voir vos statistiques",
  onAddClick,
  showAddButton = true
}: EmptyStateProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  return (
    <div 
      className="backdrop-blur-sm rounded-2xl p-8 shadow-sm border text-center animate-fadeIn"
      style={{ background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }}
    >
      <div 
        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{ background: `${theme.colors.primary}15` }}
      >
        <PiggyBank className="w-8 h-8" style={{ color: theme.colors.primary }} />
      </div>
      <p className="text-sm font-medium mb-1" style={{ color: theme.colors.textPrimary }}>
        {message}
      </p>
      <p className="text-xs mb-4" style={{ color: theme.colors.textSecondary }}>
        {subMessage}
      </p>

      {showAddButton && onAddClick && (
        <button
          onClick={onAddClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95"
          style={{ 
            background: theme.colors.primary, 
            color: theme.colors.textOnPrimary,
            boxShadow: `0 4px 14px ${theme.colors.primary}40`
          }}
        >
          <Plus className="w-4 h-4" />
          Ajouter une épargne
        </button>
      )}

      {/* Types d'épargnes suggérés */}
      <div 
        className="mt-6 p-4 rounded-xl text-left"
        style={{ background: `${theme.colors.primary}10` }}
      >
        <p className="text-xs font-medium mb-2 flex items-center gap-2" style={{ color: theme.colors.primary }}>
          💡 Types d'épargnes à suivre :
        </p>
        <ul className="text-xs space-y-1" style={{ color: theme.colors.textSecondary }}>
          <li>• Livret A / LEP / LDDS</li>
          <li>• Épargne vacances</li>
          <li>• Épargne projets</li>
          <li>• Fonds d'urgence</li>
          <li>• Épargne retraite</li>
        </ul>
      </div>
    </div>
  );
}