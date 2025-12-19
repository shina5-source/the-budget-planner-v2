'use client';

import { ArrowDownLeft, ArrowUpRight, ArrowRight } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { SmartTips } from '@/components';
import { TotalsData, COLORS_TYPE, monthsFull } from './types';

interface FluxTabProps {
  totals: TotalsData;
  selectedMonth: number | null;
  selectedYear: number;
}

export default function FluxTab({ totals, selectedMonth, selectedYear }: FluxTabProps) {
  const { theme } = useTheme();

  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };

  const totalSorties = totals.factures + totals.depenses + totals.epargnes;
  const periodLabel = selectedMonth !== null ? monthsFull[selectedMonth] : 'Année';

  // Pourcentages pour la visualisation
  const pctFactures = totalSorties > 0 ? (totals.factures / totalSorties) * 100 : 0;
  const pctDepenses = totalSorties > 0 ? (totals.depenses / totalSorties) * 100 : 0;
  const pctEpargnes = totalSorties > 0 ? (totals.epargnes / totalSorties) * 100 : 0;

  // Ratio épargne / revenus
  const tauxEpargne = totals.revenus > 0 ? (totals.epargnes / totals.revenus) * 100 : 0;

  // Analyse du flux
  const fluxAnalysis = {
    isPositif: totals.solde >= 0,
    ratio: totals.revenus > 0 ? (totalSorties / totals.revenus) * 100 : 0,
    message: ''
  };

  if (fluxAnalysis.ratio < 80) {
    fluxAnalysis.message = 'Excellent ! Vous dépensez moins de 80% de vos revenus.';
  } else if (fluxAnalysis.ratio < 100) {
    fluxAnalysis.message = 'Correct. Vous restez dans vos moyens.';
  } else {
    fluxAnalysis.message = 'Attention ! Vos sorties dépassent vos revenus.';
  }

  return (
    <div className="space-y-4">
      {/* Résumé du flux */}
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-1" style={cardStyle}>
        <h3 className="text-sm font-semibold mb-4" style={textPrimary}>
          💸 Flux financier - {periodLabel} {selectedYear}
        </h3>
        
        {/* Visualisation Sankey simplifiée */}
        <div className="relative py-6">
          {/* Entrées (Revenus) */}
          <div className="flex items-center mb-8">
            <div 
              className="flex-shrink-0 w-28 p-3 rounded-xl text-center"
              style={{ background: `${COLORS_TYPE.revenus}20` }}
            >
              <ArrowDownLeft size={16} className="mx-auto mb-1" style={{ color: COLORS_TYPE.revenus }} />
              <p className="text-[9px]" style={textSecondary}>Entrées</p>
              <p className="text-sm font-bold" style={{ color: COLORS_TYPE.revenus }}>
                {totals.revenus.toFixed(0)} €
              </p>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <div 
                className="h-2 flex-1 mx-2 rounded-full"
                style={{ background: `${COLORS_TYPE.revenus}40` }}
              />
              <ArrowRight size={20} style={{ color: COLORS_TYPE.revenus }} />
            </div>
            
            <div 
              className="flex-shrink-0 w-28 p-3 rounded-xl text-center"
              style={{ background: `${theme.colors.primary}20` }}
            >
              <p className="text-[9px]" style={textSecondary}>Budget</p>
              <p className="text-lg font-bold" style={{ color: theme.colors.primary }}>
                💰
              </p>
            </div>
          </div>

          {/* Sorties */}
          <div className="flex items-center">
            <div 
              className="flex-shrink-0 w-28 p-3 rounded-xl text-center"
              style={{ background: `${theme.colors.primary}20` }}
            >
              <p className="text-[9px]" style={textSecondary}>Budget</p>
              <p className="text-lg font-bold" style={{ color: theme.colors.primary }}>
                💰
              </p>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <ArrowRight size={20} style={{ color: COLORS_TYPE.factures }} />
              <div 
                className="h-2 flex-1 mx-2 rounded-full"
                style={{ background: `${COLORS_TYPE.factures}40` }}
              />
            </div>
            
            <div 
              className="flex-shrink-0 w-28 p-3 rounded-xl text-center"
              style={{ background: `${COLORS_TYPE.factures}20` }}
            >
              <ArrowUpRight size={16} className="mx-auto mb-1" style={{ color: COLORS_TYPE.factures }} />
              <p className="text-[9px]" style={textSecondary}>Sorties</p>
              <p className="text-sm font-bold" style={{ color: COLORS_TYPE.factures }}>
                {totalSorties.toFixed(0)} €
              </p>
            </div>
          </div>

          {/* Solde résultant */}
          <div className="mt-6 text-center">
            <div 
              className="inline-block px-6 py-3 rounded-xl"
              style={{ background: totals.solde >= 0 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)' }}
            >
              <p className="text-[9px]" style={textSecondary}>Solde</p>
              <p className={`text-xl font-bold ${totals.solde >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {totals.solde >= 0 ? '+' : ''}{totals.solde.toFixed(0)} €
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Répartition des sorties */}
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-2" style={cardStyle}>
        <h3 className="text-sm font-semibold mb-3" style={textPrimary}>
          Répartition des sorties
        </h3>
        
        {/* Barre de répartition */}
        <div className="h-8 rounded-xl overflow-hidden flex mb-4">
          {totals.factures > 0 && (
            <div 
              className="h-full flex items-center justify-center transition-all duration-500"
              style={{ width: `${pctFactures}%`, background: COLORS_TYPE.factures }}
            >
              {pctFactures > 15 && (
                <span className="text-[9px] text-white font-medium">{pctFactures.toFixed(0)}%</span>
              )}
            </div>
          )}
          {totals.depenses > 0 && (
            <div 
              className="h-full flex items-center justify-center transition-all duration-500"
              style={{ width: `${pctDepenses}%`, background: COLORS_TYPE.depenses }}
            >
              {pctDepenses > 15 && (
                <span className="text-[9px] text-white font-medium">{pctDepenses.toFixed(0)}%</span>
              )}
            </div>
          )}
          {totals.epargnes > 0 && (
            <div 
              className="h-full flex items-center justify-center transition-all duration-500"
              style={{ width: `${pctEpargnes}%`, background: COLORS_TYPE.epargnes }}
            >
              {pctEpargnes > 15 && (
                <span className="text-[9px] text-white font-medium">{pctEpargnes.toFixed(0)}%</span>
              )}
            </div>
          )}
        </div>

        {/* Légende détaillée */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded-lg text-center" style={{ background: `${COLORS_TYPE.factures}15` }}>
            <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ background: COLORS_TYPE.factures }} />
            <p className="text-[9px]" style={textSecondary}>Factures</p>
            <p className="text-xs font-bold" style={{ color: COLORS_TYPE.factures }}>{totals.factures.toFixed(0)} €</p>
            <p className="text-[8px]" style={textSecondary}>{pctFactures.toFixed(1)}%</p>
          </div>
          <div className="p-2 rounded-lg text-center" style={{ background: `${COLORS_TYPE.depenses}15` }}>
            <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ background: COLORS_TYPE.depenses }} />
            <p className="text-[9px]" style={textSecondary}>Dépenses</p>
            <p className="text-xs font-bold" style={{ color: COLORS_TYPE.depenses }}>{totals.depenses.toFixed(0)} €</p>
            <p className="text-[8px]" style={textSecondary}>{pctDepenses.toFixed(1)}%</p>
          </div>
          <div className="p-2 rounded-lg text-center" style={{ background: `${COLORS_TYPE.epargnes}15` }}>
            <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ background: COLORS_TYPE.epargnes }} />
            <p className="text-[9px]" style={textSecondary}>Épargnes</p>
            <p className="text-xs font-bold" style={{ color: COLORS_TYPE.epargnes }}>{totals.epargnes.toFixed(0)} €</p>
            <p className="text-[8px]" style={textSecondary}>{pctEpargnes.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Indicateurs clés */}
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-3" style={cardStyle}>
        <h3 className="text-sm font-semibold mb-3" style={textPrimary}>
          Indicateurs clés
        </h3>
        
        <div className="space-y-3">
          {/* Ratio sorties/revenus */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs" style={textSecondary}>Ratio sorties/revenus</span>
              <span 
                className={`text-xs font-bold ${fluxAnalysis.ratio <= 100 ? 'text-green-500' : 'text-red-500'}`}
              >
                {fluxAnalysis.ratio.toFixed(1)}%
              </span>
            </div>
            <div className="h-2 rounded-full" style={{ background: `${theme.colors.cardBorder}50` }}>
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${Math.min(fluxAnalysis.ratio, 100)}%`,
                  background: fluxAnalysis.ratio <= 80 ? '#22C55E' : fluxAnalysis.ratio <= 100 ? '#F59E0B' : '#EF4444'
                }}
              />
            </div>
            <p className="text-[9px] mt-1" style={textSecondary}>{fluxAnalysis.message}</p>
          </div>

          {/* Taux d'épargne */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs" style={textSecondary}>Taux d'épargne</span>
              <span 
                className={`text-xs font-bold ${tauxEpargne >= 20 ? 'text-green-500' : tauxEpargne >= 10 ? 'text-yellow-500' : 'text-red-500'}`}
              >
                {tauxEpargne.toFixed(1)}%
              </span>
            </div>
            <div className="h-2 rounded-full" style={{ background: `${theme.colors.cardBorder}50` }}>
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${Math.min(tauxEpargne, 100)}%`,
                  background: COLORS_TYPE.epargnes
                }}
              />
            </div>
            <p className="text-[9px] mt-1" style={textSecondary}>
              Objectif recommandé : 20%
            </p>
          </div>
        </div>
      </div>

      {/* Conseil */}
      <div 
        className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-4"
        style={{ 
          background: fluxAnalysis.isPositif ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          borderColor: fluxAnalysis.isPositif ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'
        }}
      >
        <p className="text-xs font-medium mb-1" style={{ color: fluxAnalysis.isPositif ? '#22C55E' : '#EF4444' }}>
          {fluxAnalysis.isPositif ? '✅ Flux positif' : '⚠️ Flux négatif'}
        </p>
        <p className="text-[10px]" style={textSecondary}>
          {fluxAnalysis.isPositif 
            ? `Vous avez économisé ${totals.solde.toFixed(0)}€ ce mois. ${tauxEpargne >= 20 ? 'Excellent travail !' : 'Essayez d\'atteindre 20% d\'épargne.'}`
            : `Vos dépenses dépassent vos revenus de ${Math.abs(totals.solde).toFixed(0)}€. Identifiez les postes à réduire.`
          }
        </p>
      </div>

      <SmartTips page="statistiques" />
    </div>
  );
}