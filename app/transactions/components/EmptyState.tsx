"use client";

import { Receipt, Plus } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface EmptyStateProps {
  onAddNew: () => void;
}

export default function EmptyState({ onAddNew }: EmptyStateProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };

  const tips = ['💰 Revenus', '🧾 Factures', '🛒 Dépenses', '🐷 Épargne'];

  return (
    <div className="py-12 flex flex-col items-center justify-center animate-fadeIn">
      {/* Illustration animée */}
      <div className="relative mb-6">
        <div 
          className="w-24 h-24 rounded-full flex items-center justify-center transition-transform duration-500 hover:scale-105"
          style={{ background: theme.colors.primary + '15' }}
        >
          <Receipt className="w-12 h-12" style={{ color: theme.colors.primary }} />
        </div>
        
        {/* Cercles décoratifs animés */}
        <div 
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full animate-pulse"
          style={{ background: theme.colors.primary + '30' }}
        />
        <div 
          className="absolute -bottom-1 -left-3 w-4 h-4 rounded-full animate-pulse"
          style={{ background: theme.colors.primary + '20', animationDelay: '500ms' }}
        />
        <div 
          className="absolute top-1/2 -right-4 w-3 h-3 rounded-full animate-pulse"
          style={{ background: theme.colors.primary + '25', animationDelay: '1000ms' }}
        />
      </div>

      {/* Texte */}
      <h4 className="text-base font-semibold mb-2" style={textPrimary}>
        Aucune transaction
      </h4>
      <p className="text-xs text-center max-w-[220px] mb-6 leading-relaxed" style={textSecondary}>
        Commencez à suivre vos finances en ajoutant votre première transaction
      </p>

      {/* Bouton CTA avec animation */}
      <button 
        onClick={onAddNew}
        className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg relative overflow-hidden group"
        style={{ 
          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryLight || theme.colors.primary})`,
          color: theme.colors.textOnPrimary,
          boxShadow: `0 4px 20px ${theme.colors.primary}40`
        }}
      >
        {/* Effet de brillance */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        
        <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
        <span>Ajouter une transaction</span>
      </button>

      {/* Tags types avec animation staggered */}
      <div className="mt-8 flex flex-wrap gap-2 justify-center">
        {tips.map((tip, index) => (
          <span 
            key={tip}
            className="px-3 py-1.5 rounded-full text-[10px] font-medium animate-fadeIn transition-transform duration-200 hover:scale-105 cursor-default"
            style={{ 
              background: theme.colors.cardBackgroundLight,
              color: theme.colors.textSecondary,
              animationDelay: `${(index + 1) * 150}ms`
            }}
          >
            {tip}
          </span>
        ))}
      </div>
    </div>
  );
}
