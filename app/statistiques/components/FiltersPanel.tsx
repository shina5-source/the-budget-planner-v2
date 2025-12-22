'use client';

import { Filter, Download } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface FiltersPanelProps {
  showFilters: boolean;
  onToggleFilters: () => void;
  compteFilter: string;
  onCompteFilterChange: (value: string) => void;
  moyenPaiementFilter: string;
  onMoyenPaiementFilterChange: (value: string) => void;
  comptes: string[];
  moyensPaiement: string[];
  hasActiveFilters: boolean;
  onExport: () => void;
}

export default function FiltersPanel({
  showFilters,
  onToggleFilters,
  compteFilter,
  onCompteFilterChange,
  moyenPaiementFilter,
  onMoyenPaiementFilterChange,
  comptes,
  moyensPaiement,
  hasActiveFilters,
  onExport
}: FiltersPanelProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };
  const inputStyle = { 
    background: theme.colors.cardBackgroundLight, 
    borderColor: theme.colors.cardBorder, 
    color: theme.colors.textPrimary 
  };

  return (
    <>
      {/* Boutons Filtres + Export */}
      <div className="flex items-center gap-2 mb-4 animate-fadeIn" style={{ animationDelay: '150ms' }}>
        <button 
          type="button"
          onClick={onToggleFilters} 
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-300 hover:scale-105 active:scale-95"
          style={{ 
            borderColor: hasActiveFilters ? theme.colors.primary : theme.colors.cardBorder,
            color: theme.colors.textPrimary,
            background: hasActiveFilters ? `${theme.colors.primary}20` : 'transparent'
          }}
        >
          <Filter size={14} />
          Filtres
          {hasActiveFilters && (
            <span 
              className="w-2 h-2 rounded-full animate-pulse" 
              style={{ background: theme.colors.primary }} 
            />
          )}
        </button>

        <button 
          type="button"
          onClick={onExport} 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-300 hover:scale-105 active:scale-95" 
          style={{ borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary }}
        >
          <Download size={14} />
          Export
        </button>
      </div>

      {/* Panel Filtres Expandable */}
      {showFilters && (
        <div 
          className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4 animate-fadeIn"
          style={cardStyle}
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label 
                className="text-[10px] mb-1 block font-medium"
                style={{ color: theme.colors.textSecondary }}
              >
                Compte
              </label>
              <select 
                value={compteFilter} 
                onChange={(e) => onCompteFilterChange(e.target.value)} 
                className="w-full px-2 py-1.5 rounded-lg border text-xs transition-all duration-200"
                style={inputStyle}
              >
                <option value="all">Tous les comptes</option>
                {comptes.map(compte => (
                  <option key={compte} value={compte}>{compte}</option>
                ))}
              </select>
            </div>
            <div>
              <label 
                className="text-[10px] mb-1 block font-medium"
                style={{ color: theme.colors.textSecondary }}
              >
                Moyen de paiement
              </label>
              <select 
                value={moyenPaiementFilter} 
                onChange={(e) => onMoyenPaiementFilterChange(e.target.value)} 
                className="w-full px-2 py-1.5 rounded-lg border text-xs transition-all duration-200"
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
    </>
  );
}