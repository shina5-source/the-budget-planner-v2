'use client';

import { TrendingUp, TrendingDown, CheckCircle, AlertTriangle, Award, BarChart3, Zap, Calendar, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { useTheme } from '@/contexts/theme-context';
import { SmartTips } from '@/components';
import {
  EmptyState,
  VariationBadge,
  animationStyles,
  COLORS_TYPE,
  COLORS
} from './index';

interface Transaction {
  id: number;
  date: string;
  montant: string;
  type: string;
  categorie: string;
}

interface EvolutionDataItem {
  name: string;
  revenus: number;
  factures: number;
  depenses: number;
  epargnes: number;
  solde: number;
  total?: number;
}

interface PrevMonthData {
  prevRevenus: number;
  prevFactures: number;
  prevDepenses: number;
  prevEpargnes: number;
  prevSolde: number;
  hasData: boolean;
}

interface TotalsData {
  totalRevenus: number;
  totalFactures: number;
  totalDepenses: number;
  totalEpargnes: number;
  solde: number;
  tauxEpargne: number;
}

interface VariationsData {
  revenus: number;
  factures: number;
  depenses: number;
  epargnes: number;
  solde: number;
}

interface YearAveragesData {
  avgRevenus: number;
  avgFactures: number;
  avgDepenses: number;
  avgEpargnes: number;
  monthsWithData: number;
}

interface TendanceItem {
  type: 'up' | 'down' | 'stable';
  message: string;
  color: string;
}

interface PrevisionAnnuelleData {
  previsionTotal: number;
  previsionEpargne: number;
  monthsRemaining: number;
}

interface AnalyseTabProps {
  filteredTransactions: Transaction[];
  totals: TotalsData;
  prevMonthData: PrevMonthData;
  variations: VariationsData;
  evolution12Mois: EvolutionDataItem[];
  yearAverages: YearAveragesData;
  top5Depenses: Array<{ name: string; value: number }>;
  tendances: TendanceItem[];
  previsionAnnuelle: PrevisionAnnuelleData | null;
  healthScore: number;
  periodeLabel: string;
  selectedYear: number;
  onNavigateToTransactions: () => void;
}

export default function AnalyseTab({
  filteredTransactions,
  totals,
  prevMonthData,
  variations,
  evolution12Mois,
  yearAverages,
  top5Depenses,
  tendances,
  previsionAnnuelle,
  healthScore,
  periodeLabel,
  selectedYear,
  onNavigateToTransactions
}: AnalyseTabProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const tooltipStyle = { 
    fontSize: '10px', 
    backgroundColor: theme.colors.cardBackground, 
    border: `1px solid ${theme.colors.cardBorder}`, 
    borderRadius: '8px', 
    color: theme.colors.textPrimary 
  };

  const { totalRevenus, totalFactures, totalDepenses, totalEpargnes, solde } = totals;
  const totalSorties = totalFactures + totalDepenses + totalEpargnes;

  const hasYearData = evolution12Mois.some(m => m.revenus > 0 || m.depenses > 0);
  const hasData = filteredTransactions.length > 0;

  const getScoreColor = (s: number) => s >= 80 ? '#4CAF50' : s >= 60 ? '#8BC34A' : s >= 40 ? '#FF9800' : s >= 20 ? '#FF5722' : '#F44336';

  // État vide
  if (!hasData && !hasYearData) {
    return (
      <div className="space-y-4">
        <style>{animationStyles}</style>
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-2 animate-fade-in-up">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center border" 
            style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}
          >
            <BarChart3 className="w-5 h-5" style={textPrimary} />
          </div>
          <div>
            <h3 className="text-sm font-semibold" style={textPrimary}>Analyse approfondie</h3>
            <p className="text-[10px]" style={textSecondary}>{periodeLabel}</p>
          </div>
        </div>
        
        <EmptyState 
          message="Ajoutez des transactions pour voir l'analyse" 
          icon="📈" 
          title="Analyses en attente" 
          onAddTransaction={onNavigateToTransactions}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <style>{animationStyles}</style>
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-2 animate-fade-in-up">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center border" 
          style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}
        >
          <BarChart3 className="w-5 h-5" style={textPrimary} />
        </div>
        <div>
          <h3 className="text-sm font-semibold" style={textPrimary}>Analyse approfondie</h3>
          <p className="text-[10px]" style={textSecondary}>{periodeLabel}</p>
        </div>
      </div>

      {/* Flux du mois */}
      {hasData && (
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-1 opacity-0" style={{ ...cardStyle, animationFillMode: 'forwards' }}>
          <h4 className="text-xs font-semibold mb-4 flex items-center gap-2" style={textPrimary}>📊 Flux du mois</h4>
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <TrendingUp className="w-5 h-5 mx-auto text-green-400 mb-1" />
              <p className="text-[9px]" style={textSecondary}>Entrées</p>
              <p className="text-lg font-bold text-green-400">+{totalRevenus.toFixed(0)} €</p>
            </div>
            <div className="w-px h-12" style={{ backgroundColor: theme.colors.cardBorder }} />
            <div className="text-center flex-1">
              <TrendingDown className="w-5 h-5 mx-auto text-red-400 mb-1" />
              <p className="text-[9px]" style={textSecondary}>Sorties</p>
              <p className="text-lg font-bold text-red-400">-{totalSorties.toFixed(0)} €</p>
            </div>
            <div className="w-px h-12" style={{ backgroundColor: theme.colors.cardBorder }} />
            <div className="text-center flex-1">
              {solde >= 0 ? <CheckCircle className="w-5 h-5 mx-auto text-green-400 mb-1" /> : <AlertTriangle className="w-5 h-5 mx-auto text-red-400 mb-1" />}
              <p className="text-[9px]" style={textSecondary}>Balance</p>
              <p className={`text-lg font-bold ${solde >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {solde >= 0 ? '+' : ''}{solde.toFixed(0)} €
              </p>
            </div>
          </div>
        </div>
      )}

      {/* vs Période précédente */}
      {prevMonthData.hasData && (
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-2 opacity-0" style={{ ...cardStyle, animationFillMode: 'forwards' }}>
          <h4 className="text-xs font-semibold mb-3 flex items-center gap-2" style={textPrimary}>
            <Calendar className="w-4 h-4" /> vs Période précédente
          </h4>
          <div className="space-y-2">
            {[
              { label: 'Revenus', prev: prevMonthData.prevRevenus, curr: totalRevenus, variation: variations.revenus, inverse: false },
              { label: 'Factures', prev: prevMonthData.prevFactures, curr: totalFactures, variation: variations.factures, inverse: true },
              { label: 'Dépenses', prev: prevMonthData.prevDepenses, curr: totalDepenses, variation: variations.depenses, inverse: true },
              { label: 'Épargnes', prev: prevMonthData.prevEpargnes, curr: totalEpargnes, variation: variations.epargnes, inverse: false }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg" style={{ background: `${theme.colors.primary}05` }}>
                <span className="text-xs" style={textSecondary}>{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={textPrimary}>{item.prev.toFixed(0)} € → {item.curr.toFixed(0)} €</span>
                  <VariationBadge variation={item.variation} inverse={item.inverse} hasData={prevMonthData.hasData} />
                </div>
              </div>
            ))}
            <div 
              className="flex items-center justify-between p-2 rounded-lg" 
              style={{ background: solde >= prevMonthData.prevSolde ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)' }}
            >
              <span className="text-xs font-medium" style={textPrimary}>Solde</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium" style={textPrimary}>
                  {prevMonthData.prevSolde.toFixed(0)} € → {solde.toFixed(0)} €
                </span>
                <VariationBadge variation={variations.solde} hasData={prevMonthData.hasData} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* vs Moyennes */}
      {yearAverages.monthsWithData > 1 && (
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-3 opacity-0" style={{ ...cardStyle, animationFillMode: 'forwards' }}>
          <h4 className="text-xs font-semibold mb-3 flex items-center gap-2" style={textPrimary}>
            <Zap className="w-4 h-4" /> vs Moyennes {selectedYear}
            <span className="text-[9px] font-normal px-2 py-0.5 rounded-full" style={{ background: `${theme.colors.primary}20`, color: theme.colors.textSecondary }}>
              {yearAverages.monthsWithData} mois
            </span>
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Revenus', curr: totalRevenus, avg: yearAverages.avgRevenus, good: totalRevenus >= yearAverages.avgRevenus },
              { label: 'Factures', curr: totalFactures, avg: yearAverages.avgFactures, good: totalFactures <= yearAverages.avgFactures },
              { label: 'Dépenses', curr: totalDepenses, avg: yearAverages.avgDepenses, good: totalDepenses <= yearAverages.avgDepenses },
              { label: 'Épargnes', curr: totalEpargnes, avg: yearAverages.avgEpargnes, good: totalEpargnes >= yearAverages.avgEpargnes }
            ].map((item, i) => (
              <div key={i} className="p-2 rounded-xl text-center" style={{ background: `${theme.colors.primary}05` }}>
                <p className="text-[9px]" style={textSecondary}>{item.label}</p>
                <p className="text-sm font-semibold" style={textPrimary}>{item.curr.toFixed(0)} €</p>
                <p className={`text-[8px] ${item.good ? 'text-green-400' : 'text-orange-400'}`}>
                  {item.good ? '✓' : '!'} moy: {item.avg.toFixed(0)} €
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Score santé financière */}
      {hasYearData && (
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border text-center animate-fade-in-up stagger-4 opacity-0" style={{ ...cardStyle, animationFillMode: 'forwards' }}>
          <h4 className="text-xs font-semibold mb-3 flex items-center justify-center gap-2" style={textPrimary}>
            <Award className="w-4 h-4" /> Score santé financière
          </h4>
          <div className="relative inline-flex items-center justify-center mb-3">
            <svg width={120} height={120} className="transform -rotate-90">
              <circle cx={60} cy={60} r={50} stroke={`${theme.colors.cardBorder}50`} strokeWidth={10} fill="none" />
              <circle 
                cx={60} cy={60} r={50} 
                stroke={getScoreColor(healthScore)} 
                strokeWidth={10} 
                fill="none" 
                strokeDasharray={314} 
                strokeDashoffset={314 - (healthScore / 100) * 314} 
                strokeLinecap="round" 
                className="transition-all duration-1000 ease-out" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold" style={{ color: getScoreColor(healthScore) }}>{healthScore}</span>
              <span className="text-[9px]" style={textSecondary}>/100</span>
            </div>
          </div>
          <p className="text-sm font-medium" style={{ color: getScoreColor(healthScore) }}>
            {healthScore >= 80 ? 'Excellent !' : healthScore >= 60 ? 'Bien' : healthScore >= 40 ? 'Moyen' : healthScore >= 20 ? 'À améliorer' : 'Critique'}
          </p>
          <p className="text-[10px] mt-2" style={textSecondary}>Basé sur: taux d&apos;épargne, solde, régularité</p>
        </div>
      )}

      {/* Évolution sur 12 mois */}
      {hasYearData && (
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-5 opacity-0" style={{ ...cardStyle, animationFillMode: 'forwards' }}>
          <h4 className="text-xs font-semibold mb-3 flex items-center gap-2" style={textPrimary}>
            <TrendingUp className="w-4 h-4" /> Évolution sur 12 mois
          </h4>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolution12Mois} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.cardBorder} opacity={0.3} />
                <XAxis dataKey="name" tick={{ fill: theme.colors.textSecondary, fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: theme.colors.textSecondary, fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value: number) => `${value.toFixed(0)} €`} contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '9px' }} />
                <Line type="monotone" dataKey="revenus" stroke={COLORS_TYPE.revenus} strokeWidth={2} dot={{ r: 2 }} name="Revenus" />
                <Line type="monotone" dataKey="total" stroke={COLORS_TYPE.depenses} strokeWidth={2} dot={{ r: 2 }} name="Dépenses" />
                <Line type="monotone" dataKey="solde" stroke={theme.colors.primary} strokeWidth={2} dot={{ r: 2 }} name="Solde" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Top 5 catégories */}
      {top5Depenses.length > 0 && (
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-6 opacity-0" style={{ ...cardStyle, animationFillMode: 'forwards' }}>
          <h4 className="text-xs font-semibold mb-3 flex items-center gap-2" style={textPrimary}>
            🏆 Top 5 catégories (sorties {selectedYear})
          </h4>
          <div className="space-y-2">
            {top5Depenses.map((cat, i) => {
              const maxValue = top5Depenses[0].value;
              const pct = (cat.value / maxValue) * 100;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" 
                        style={{ background: `${COLORS[i]}30`, color: COLORS[i] }}
                      >
                        {i + 1}
                      </span>
                      <span className="text-xs" style={textPrimary}>{cat.name}</span>
                    </div>
                    <span className="text-xs font-semibold" style={{ color: COLORS[i] }}>{cat.value.toFixed(0)} €</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${theme.colors.cardBorder}50` }}>
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ width: `${pct}%`, backgroundColor: COLORS[i] }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tendances */}
      {tendances.length > 0 && (
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-7 opacity-0" style={{ ...cardStyle, animationFillMode: 'forwards' }}>
          <h4 className="text-xs font-semibold mb-3 flex items-center gap-2" style={textPrimary}>
            📈 Tendances (3 derniers mois)
          </h4>
          <div className="space-y-2">
            {tendances.map((t, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: `${t.color}10` }}>
                {t.type === 'up' ? (
                  <ArrowUpRight className="w-4 h-4" style={{ color: t.color }} />
                ) : t.type === 'down' ? (
                  <ArrowDownRight className="w-4 h-4" style={{ color: t.color }} />
                ) : (
                  <Info className="w-4 h-4" style={{ color: t.color }} />
                )}
                <span className="text-xs" style={{ color: t.color }}>{t.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prévision fin d'année */}
      {previsionAnnuelle && previsionAnnuelle.monthsRemaining > 0 && (
        <div 
          className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-scale-in" 
          style={{ ...cardStyle, animationDelay: '0.4s', animationFillMode: 'forwards', opacity: 0 }}
        >
          <h4 className="text-xs font-semibold mb-3 flex items-center gap-2" style={textPrimary}>
            🔮 Prévision fin d&apos;année
            <span className="text-[9px] font-normal px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
              {previsionAnnuelle.monthsRemaining} mois restants
            </span>
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl text-center" style={{ background: `${theme.colors.primary}05`, border: '1px dashed', borderColor: theme.colors.cardBorder }}>
              <p className="text-[9px]" style={textSecondary}>Solde annuel prévu</p>
              <p className={`text-xl font-bold ${previsionAnnuelle.previsionTotal >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {previsionAnnuelle.previsionTotal >= 0 ? '+' : ''}{previsionAnnuelle.previsionTotal.toFixed(0)} €
              </p>
            </div>
            <div className="p-3 rounded-xl text-center" style={{ background: `${theme.colors.primary}05`, border: '1px dashed', borderColor: theme.colors.cardBorder }}>
              <p className="text-[9px]" style={textSecondary}>Épargne annuelle prévue</p>
              <p className="text-xl font-bold text-blue-400">{previsionAnnuelle.previsionEpargne.toFixed(0)} €</p>
            </div>
          </div>
          <p className="text-[9px] text-center mt-2" style={textSecondary}>
            Basé sur les moyennes de {yearAverages.monthsWithData} mois
          </p>
        </div>
      )}

      <SmartTips page="budget" />
    </div>
  );
}