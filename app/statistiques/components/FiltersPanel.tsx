'use client';

import { Filter, X } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface FiltersPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  compteFilter: string;
  moyenPaiementFilter: string;
  onCompteChange: (value: string) => void;
  onMoyenPaiementChange: (value: string) => void;
  comptes: string[];
  moyensPaiement: string[];
}

export default function FiltersPanel({
  isOpen,
  onToggle,
  compteFilter,
  moyenPaiementFilter,
  onCompteChange,
  onMoyenPaiementChange,
  comptes,
  moyensPaiement
}: FiltersPanelProps) {
  const { theme } = useTheme();
  
  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const inputStyle = { 
    background: theme.colors.cardBackgroundLight || theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder, 
    color: theme.colors.textPrimary 
  };

  const hasActiveFilters = compteFilter !== 'all' || moyenPaiementFilter !== 'all';

  return (
    <div className="mb-4">
      {/* Bouton toggle */}
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
        style={{ 
          background: hasActiveFilters ? `${theme.colors.primary}30` : `${theme.colors.primary}10`,
          color: theme.colors.primary 
        }}
      >
        <Filter size={14} />
        Filtres
        {hasActiveFilters && (
          <span 
            className="w-2 h-2 rounded-full"
            style={{ background: theme.colors.primary }}
          />
        )}
      </button>
      
      {/* Panel filtres */}
      {isOpen && (
        <div 
          className="mt-3 p-4 rounded-2xl border space-y-3 animate-fade-in-up"
          style={cardStyle}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold" style={textPrimary}>
              Filtres avancés
            </h3>
            {hasActiveFilters && (
              <button
                onClick={() => {
                  onCompteChange('all');
                  onMoyenPaiementChange('all');
                }}
                className="text-[10px] px-2 py-1 rounded-full flex items-center gap-1"
                style={{ background: `${theme.colors.primary}20`, color: theme.colors.primary }}
              >
                <X size={10} />
                Réinitialiser
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Filtre compte */}
            <div>
              <label className="text-[10px] mb-1 block" style={textSecondary}>
                Compte
              </label>
              <select
                value={compteFilter}
                onChange={(e) => onCompteChange(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg border text-xs"
                style={inputStyle}
              >
                <option value="all">Tous les comptes</option>
                {comptes.map(compte => (
                  <option key={compte} value={compte}>{compte}</option>
                ))}
              </select>
            </div>
            
            {/* Filtre moyen de paiement */}
            <div>
              <label className="text-[10px] mb-1 block" style={textSecondary}>
                Moyen de paiement
              </label>
              <select
                value={moyenPaiementFilter}
                onChange={(e) => onMoyenPaiementChange(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg border text-xs"
                style={inputStyle}
              >
                <option value="all">Tous</option>
                {moyensPaiement.map(mp => (
                  <option key={mp} value={mp}>{mp}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}