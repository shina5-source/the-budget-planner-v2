'use client';

import { Maximize2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useTheme } from '@/contexts/theme-context';
import { SmartTips } from '@/components';
import VariationBadge from './VariationBadge';
import { Transaction, COLORS, monthsShort } from './types';
import { groupByCategory, calculateVariation } from './utils';

interface DetailTabProps {
  type: 'Revenus' | 'Factures' | 'Dépenses' | 'Épargnes';
  color: string;
  filteredTransactions: Transaction[];
  allTransactions: Transaction[];
  selectedMonth: number | null;
  selectedYear: number;
  onExpandChart: (chartId: string) => void;
}

export default function DetailTab({
  type,
  color,
  filteredTransactions,
  allTransactions,
  selectedMonth,
  selectedYear,
  onExpandChart
}: DetailTabProps) {
  const { theme } = useTheme();

  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };

  const tooltipStyle = {
    fontSize: '10px',
    backgroundColor: theme.colors.cardBackground,
    border: `1px solid ${theme.colors.cardBorder}`,
    borderRadius: '8px',
    color: theme.colors.textPrimary
  };

  const typeMapping: Record<string, string> = {
    'Revenus': 'Revenu',
    'Factures': 'Facture',
    'Dépenses': 'Dépense',
    'Épargnes': 'Épargne'
  };
  const actualType = typeMapping[type];

  const categoryData = groupByCategory(filteredTransactions, type);
  const total = categoryData.reduce((s, c) => s + c.value, 0);

  // Données pour PieChart (format compatible)
  const pieChartData = categoryData.map((cat, index) => ({
    name: cat.name,
    value: cat.value,
    fill: COLORS[index % COLORS.length]
  }));

  const getPrevMonthTransactions = () => {
    if (selectedMonth === null) {
      return allTransactions.filter(t => {
        if (!t.date) return false;
        return new Date(t.date).getFullYear() === selectedYear - 1;
      });
    }
    
    let prevMonth = selectedMonth - 1;
    let prevYear = selectedYear;
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear = selectedYear - 1;
    }
    
    return allTransactions.filter(t => {
      if (!t.date) return false;
      const d = new Date(t.date);
      return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
    });
  };

  const prevTransactions = getPrevMonthTransactions();
  const prevCategoryData = groupByCategory(prevTransactions, type);
  const prevTotal = prevCategoryData.reduce((s, c) => s + c.value, 0);
  const variationTotal = calculateVariation(total, prevTotal);

  const isExpense = type === 'Dépenses' || type === 'Factures';

  const getCategoryEvolution = (categoryName: string) => {
    const result: { name: string; value: number }[] = [];
    const currentMonth = selectedMonth ?? new Date().getMonth();
    
    for (let i = 5; i >= 0; i--) {
      let m = currentMonth - i;
      let y = selectedYear;
      while (m < 0) {
        m += 12;
        y -= 1;
      }
      
      const monthTx = allTransactions.filter(t => {
        if (!t.date) return false;
        const d = new Date(t.date);
        return d.getMonth() === m && d.getFullYear() === y && t.type === actualType && t.categorie === categoryName;
      });
      
      const monthTotal = monthTx.reduce((s, t) => s + parseFloat(t.montant || '0'), 0);
      result.push({ name: monthsShort[m], value: monthTotal });
    }
    
    return result;
  };

  const top5 = [...filteredTransactions]
    .filter(t => t.type === actualType)
    .sort((a, b) => parseFloat(b.montant || '0') - parseFloat(a.montant || '0'))
    .slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Total avec variation */}
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-1" style={cardStyle}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px]" style={textSecondary}>Total {type}</p>
            <p className="text-2xl font-bold" style={{ color }}>{total.toFixed(2)} €</p>
          </div>
          <div className="text-right">
            <VariationBadge variation={variationTotal} inverse={isExpense} />
            <p className="text-[9px] mt-1" style={textSecondary}>
              vs {selectedMonth !== null ? 'mois préc.' : 'année préc.'}
            </p>
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border relative animate-fade-in-up stagger-2" style={cardStyle}>
        <button
          onClick={() => onExpandChart(`pie-${type.toLowerCase()}`)}
          className="absolute top-3 right-3 p-1.5 rounded-lg transition-all hover:scale-110"
          style={{ background: `${theme.colors.primary}20` }}
        >
          <Maximize2 size={14} style={{ color: theme.colors.primary }} />
        </button>
        <h3 className="text-sm font-semibold mb-3" style={textPrimary}>
          Répartition {type}
        </h3>
        {pieChartData.length > 0 ? (
          <div className="flex justify-center">
            <div style={{ width: 200, height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${value.toFixed(2)} €`}
                    contentStyle={tooltipStyle}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <p className="text-center text-xs py-8" style={textSecondary}>
            Aucune donnée pour cette période
          </p>
        )}
      </div>

      {/* Détail par catégorie avec mini graphiques */}
      {categoryData.length > 0 && (
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-3" style={cardStyle}>
          <h3 className="text-sm font-semibold mb-3" style={textPrimary}>
            Détail par catégorie
          </h3>
          <div className="space-y-3">
            {categoryData.map((cat, i) => {
              const prevCat = prevCategoryData.find(c => c.name === cat.name);
              const prevValue = prevCat?.value || 0;
              const variation = calculateVariation(cat.value, prevValue);
              const evolution = getCategoryEvolution(cat.name);
              const catColor = COLORS[i % COLORS.length];
              const percentage = total > 0 ? (cat.value / total * 100) : 0;

              return (
                <div key={cat.name} className="p-3 rounded-xl" style={{ background: `${catColor}10` }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ background: catColor }}
                      />
                      <span className="text-xs font-medium" style={textPrimary}>{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <VariationBadge variation={variation} inverse={isExpense} />
                      <span className="text-sm font-bold" style={{ color: catColor }}>
                        {cat.value.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                  
                  {/* Barre de progression */}
                  <div className="h-1.5 rounded-full mb-2" style={{ background: `${catColor}20` }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%`, background: catColor }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {/* Mini graphique évolution */}
                    <div style={{ width: 100, height: 30 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={evolution} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                          <Bar dataKey="value" fill={catColor} radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-[9px]" style={textSecondary}>
                        {cat.count} transaction{cat.count > 1 ? 's' : ''} • {percentage.toFixed(1)}%
                      </p>
                      {prevValue > 0 && (
                        <p className="text-[8px]" style={textSecondary}>
                          Mois préc: {prevValue.toFixed(0)}€
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top 5 transactions */}
      {top5.length > 0 && (
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-4" style={cardStyle}>
          <h3 className="text-sm font-semibold mb-3" style={textPrimary}>
            Top 5 {type}
          </h3>
          <div className="space-y-2">
            {top5.map((t, i) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-2 rounded-xl"
                style={{ background: i === 0 ? `${color}15` : 'transparent', borderBottom: i < 4 ? `1px solid ${theme.colors.cardBorder}30` : 'none' }}
              >
                <div className="flex items-center gap-2 flex-1">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ background: `${color}20`, color }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={textPrimary}>{t.categorie}</p>
                    <p className="text-[9px]" style={textSecondary}>
                      {t.date ? new Date(t.date).toLocaleDateString('fr-FR') : '-'}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold" style={{ color }}>
                  {parseFloat(t.montant || '0').toFixed(2)} €
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <SmartTips page="statistiques" />
    </div>
  );
}