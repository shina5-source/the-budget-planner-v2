"use client";

import { CreditCard, Plus } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface EmptyStateProps {
  onAddCredit: () => void;
}

export default function EmptyState({ onAddCredit }: EmptyStateProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };
  const textSecondary = { color: theme.colors.textSecondary };

  return (
    <div 
      className="backdrop-blur-sm rounded-2xl p-6 shadow-sm border text-center mb-4 animate-fadeIn"
      style={{ ...cardStyle, animationDelay: '300ms' }}
    >
      <div 
        className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
        style={{ background: `${theme.colors.primary}20` }}
      >
        <CreditCard className="w-8 h-8" style={{ color: theme.colors.primary }} />
      </div>

      <h3 className="text-sm font-medium mb-2" style={{ color: theme.colors.textPrimary }}>
        Aucun crédit enregistré
      </h3>

      <p className="text-xs mb-4" style={textSecondary}>
        Ajoutez vos crédits et dettes pour suivre<br />
        automatiquement vos remboursements
      </p>

      <button
        onClick={onAddCredit}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
        style={{ 
          background: theme.colors.primary,
          color: theme.colors.textOnPrimary,
          boxShadow: `0 4px 15px ${theme.colors.primary}40`
        }}
      >
        <Plus className="w-4 h-4" />
        Ajouter un crédit
      </button>

      <div 
        className="mt-4 p-3 rounded-xl text-left"
        style={{ background: theme.colors.cardBackgroundLight }}
      >
        <p className="text-[10px] font-medium mb-2" style={{ color: theme.colors.textPrimary }}>
          💡 Types de crédits à suivre :
        </p>
        <ul className="text-[10px] space-y-1" style={textSecondary}>
          <li>• Crédit immobilier</li>
          <li>• Crédit auto / moto</li>
          <li>• Crédit à la consommation</li>
          <li>• Prêt étudiant</li>
          <li>• Dettes personnelles</li>
        </ul>
      </div>
    </div>
  );
}