"use client";

import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterType: string;
  onFilterTypeChange: (type: string) => void;
  filterCategorie: string;
  onFilterCategorieChange: (cat: string) => void;
  filterDepuis: string;
  onFilterDepuisChange: (depuis: string) => void;
  filterVers: string;
  onFilterVersChange: (vers: string) => void;
  filterMoyenPaiement: string;
  onFilterMoyenPaiementChange: (moyen: string) => void;
  types: string[];
  categories: string[];
  comptes: string[];
  moyensPaiement: string[];
  onClearFilters: () => void;
}

export default function SearchFilters({
  searchQuery,
  onSearchChange,
  filterType,
  onFilterTypeChange,
  filterCategorie,
  onFilterCategorieChange,
  filterDepuis,
  onFilterDepuisChange,
  filterVers,
  onFilterVersChange,
  filterMoyenPaiement,
  onFilterMoyenPaiementChange,
  types,
  categories,
  comptes,
  moyensPaiement,
  onClearFilters
}: SearchFiltersProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const [showFilters, setShowFilters] = useState(false);

  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const inputStyle = { 
    background: theme.colors.cardBackgroundLight, 
    borderColor: theme.colors.cardBorder, 
    color: theme.colors.textPrimary 
  };

  const hasActiveFilters = filterType || filterCategorie || filterDepuis || filterVers || filterMoyenPaiement;
  const activeFiltersCount = [filterType, filterCategorie, filterDepuis, filterVers, filterMoyenPaiement].filter(Boolean).length;

  return (
    <div 
      className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4 animate-fadeIn"
      style={{ ...cardStyle, animationDelay: '200ms' }}
    >
      {/* Barre de recherche */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={textSecondary} />
          <input 
            type="text" 
            placeholder="Rechercher une transaction..." 
            value={searchQuery} 
            onChange={(e) => onSearchChange(e.target.value)} 
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-transparent text-sm focus:outline-none focus:ring-2 transition-all duration-200 border"
            style={{ 
              ...inputStyle,
              // @ts-expect-error focus ring color
              '--tw-ring-color': theme.colors.primary 
            }}
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-3 h-3" style={textSecondary} />
            </button>
          )}
        </div>
      </div>

      {/* Bouton filtres */}
      <button 
        onClick={() => setShowFilters(!showFilters)} 
        className="flex items-center gap-2 text-xs py-2 px-3 rounded-lg hover:bg-white/5 transition-all duration-200"
        style={textSecondary}
      >
        {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        <span>Filtres avancés</span>
        {hasActiveFilters && (
          <span 
            className="px-2 py-0.5 rounded-full text-[10px] font-medium animate-pulse"
            style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}
          >
            {activeFiltersCount} actif{activeFiltersCount > 1 ? 's' : ''}
          </span>
        )}
      </button>

      {/* Filtres avancés */}
      {showFilters && (
        <div className="mt-4 space-y-3 animate-slideDown">
          {/* Type */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={textPrimary}>
              Type
            </label>
            <select 
              value={filterType} 
              onChange={(e) => onFilterTypeChange(e.target.value)} 
              className="w-full rounded-xl px-3 py-2.5 text-sm border cursor-pointer transition-all duration-200 hover:opacity-90"
              style={inputStyle}
            >
              <option value="">Tous les types</option>
              {types.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Catégorie */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={textPrimary}>
              Catégorie
            </label>
            <select 
              value={filterCategorie} 
              onChange={(e) => onFilterCategorieChange(e.target.value)} 
              className="w-full rounded-xl px-3 py-2.5 text-sm border cursor-pointer transition-all duration-200 hover:opacity-90"
              style={inputStyle}
            >
              <option value="">Toutes les catégories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Depuis / Vers */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={textPrimary}>
                Depuis
              </label>
              <select 
                value={filterDepuis} 
                onChange={(e) => onFilterDepuisChange(e.target.value)} 
                className="w-full rounded-xl px-3 py-2.5 text-sm border cursor-pointer transition-all duration-200 hover:opacity-90"
                style={inputStyle}
              >
                <option value="">Tous</option>
                {comptes.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={textPrimary}>
                Vers
              </label>
              <select 
                value={filterVers} 
                onChange={(e) => onFilterVersChange(e.target.value)} 
                className="w-full rounded-xl px-3 py-2.5 text-sm border cursor-pointer transition-all duration-200 hover:opacity-90"
                style={inputStyle}
              >
                <option value="">Tous</option>
                {comptes.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Moyen de paiement */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={textPrimary}>
              Moyen de paiement
            </label>
            <select 
              value={filterMoyenPaiement} 
              onChange={(e) => onFilterMoyenPaiementChange(e.target.value)} 
              className="w-full rounded-xl px-3 py-2.5 text-sm border cursor-pointer transition-all duration-200 hover:opacity-90"
              style={inputStyle}
            >
              <option value="">Tous les moyens</option>
              {moyensPaiement.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Bouton effacer */}
          {hasActiveFilters && (
            <button 
              onClick={onClearFilters} 
              className="w-full py-2.5 text-xs rounded-xl border flex items-center justify-center gap-2 hover:bg-white/5 transition-all duration-200 active:scale-[0.98]"
              style={{ borderColor: theme.colors.cardBorder, color: theme.colors.textSecondary }}
            >
              <X className="w-3 h-3" />
              Effacer tous les filtres
            </button>
          )}
        </div>
      )}
    </div>
  );
}