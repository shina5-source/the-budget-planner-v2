'use client';

import { Calendar } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { SmartTips } from '@/components';
import { Transaction, monthsFull, daysOfWeek } from './types';

interface CalendrierTabProps {
  filteredTransactions: Transaction[];
  selectedMonth: number | null;
  selectedYear: number;
}

export default function CalendrierTab({ filteredTransactions, selectedMonth, selectedYear }: CalendrierTabProps) {
  const { theme } = useTheme();

  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };

  const currentMonth = selectedMonth ?? new Date().getMonth();
  const daysInMonth = new Date(selectedYear, currentMonth + 1, 0).getDate();
  
  const firstDayOfMonth = new Date(selectedYear, currentMonth, 1).getDay();
  const firstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const depensesParJour: Record<number, number> = {};
  let maxDepense = 0;

  filteredTransactions
    .filter(t => t.type !== 'Revenu' && t.date)
    .forEach(t => {
      const date = new Date(t.date!);
      if (date.getMonth() === currentMonth && date.getFullYear() === selectedYear) {
        const jour = date.getDate();
        depensesParJour[jour] = (depensesParJour[jour] || 0) + parseFloat(t.montant || '0');
        if (depensesParJour[jour] > maxDepense) {
          maxDepense = depensesParJour[jour];
        }
      }
    });

  const getHeatColor = (amount: number): string => {
    if (amount === 0) return 'transparent';
    const intensity = maxDepense > 0 ? amount / maxDepense : 0;
    
    if (intensity < 0.25) return 'rgba(34, 197, 94, 0.3)';
    if (intensity < 0.5) return 'rgba(234, 179, 8, 0.4)';
    if (intensity < 0.75) return 'rgba(249, 115, 22, 0.5)';
    return 'rgba(239, 68, 68, 0.6)';
  };

  const top5Jours = Object.entries(depensesParJour)
    .map(([jour, montant]) => ({ jour: parseInt(jour), montant }))
    .sort((a, b) => b.montant - a.montant)
    .slice(0, 5);

  const calendarCells: (number | null)[] = [];
  
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(null);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day);
  }

  const totalMois = Object.values(depensesParJour).reduce((s, v) => s + v, 0);
  const joursAvecDepenses = Object.keys(depensesParJour).length;
  const moyenneParJour = joursAvecDepenses > 0 ? totalMois / joursAvecDepenses : 0;

  return (
    <div className="space-y-4">
      {/* En-tête */}
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-1" style={cardStyle}>
        <div className="flex items-center gap-2 mb-2">
          <Calendar size={18} style={{ color: theme.colors.primary }} />
          <h3 className="text-sm font-semibold" style={textPrimary}>
            {monthsFull[currentMonth]} {selectedYear}
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-[9px]" style={textSecondary}>Total sorties</p>
            <p className="text-sm font-bold text-red-500">{totalMois.toFixed(0)} €</p>
          </div>
          <div>
            <p className="text-[9px]" style={textSecondary}>Jours actifs</p>
            <p className="text-sm font-bold" style={textPrimary}>{joursAvecDepenses}</p>
          </div>
          <div>
            <p className="text-[9px]" style={textSecondary}>Moyenne/jour</p>
            <p className="text-sm font-bold" style={{ color: theme.colors.primary }}>{moyenneParJour.toFixed(0)} €</p>
          </div>
        </div>
      </div>

      {/* Calendrier Heatmap */}
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-2" style={cardStyle}>
        <h3 className="text-sm font-semibold mb-3" style={textPrimary}>
          Carte de chaleur des dépenses
        </h3>
        
        {/* Jours de la semaine */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center text-[9px] font-medium py-1" style={textSecondary}>
              {day}
            </div>
          ))}
        </div>

        {/* Grille du calendrier */}
        <div className="grid grid-cols-7 gap-1">
          {calendarCells.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const depense = depensesParJour[day] || 0;
            const bgColor = getHeatColor(depense);
            const isToday = 
              day === new Date().getDate() && 
              currentMonth === new Date().getMonth() && 
              selectedYear === new Date().getFullYear();

            return (
              <div
                key={day}
                className="aspect-square rounded-lg flex flex-col items-center justify-center text-[10px] transition-all hover:scale-105"
                style={{ 
                  background: bgColor || `${theme.colors.cardBorder}30`,
                  boxShadow: isToday ? `0 0 0 2px ${theme.colors.primary}` : 'none'
                }}
                title={depense > 0 ? `${day}/${currentMonth + 1}: ${depense.toFixed(2)}€` : ''}
              >
                <span style={textPrimary}>{day}</span>
                {depense > 0 && (
                  <span className="text-[7px] font-medium" style={textSecondary}>
                    {depense.toFixed(0)}€
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Légende */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <span className="text-[8px]" style={textSecondary}>Faible</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded" style={{ background: 'rgba(34, 197, 94, 0.3)' }} />
            <div className="w-4 h-4 rounded" style={{ background: 'rgba(234, 179, 8, 0.4)' }} />
            <div className="w-4 h-4 rounded" style={{ background: 'rgba(249, 115, 22, 0.5)' }} />
            <div className="w-4 h-4 rounded" style={{ background: 'rgba(239, 68, 68, 0.6)' }} />
          </div>
          <span className="text-[8px]" style={textSecondary}>Élevé</span>
        </div>
      </div>

      {/* Top 5 jours les plus dépensiers */}
      {top5Jours.length > 0 && (
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-3" style={cardStyle}>
          <h3 className="text-sm font-semibold mb-3" style={textPrimary}>
            Top 5 jours les plus dépensiers
          </h3>
          <div className="space-y-2">
            {top5Jours.map((item, i) => {
              const percentage = maxDepense > 0 ? (item.montant / maxDepense) * 100 : 0;
              
              return (
                <div key={item.jour} className="flex items-center gap-3">
                  <span 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ 
                      background: i === 0 ? 'rgba(239, 68, 68, 0.2)' : `${theme.colors.primary}20`,
                      color: i === 0 ? '#EF4444' : theme.colors.primary
                    }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium" style={textPrimary}>
                        {item.jour} {monthsFull[currentMonth].slice(0, 3)}
                      </span>
                      <span className="text-xs font-bold text-red-500">
                        {item.montant.toFixed(2)} €
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: `${theme.colors.cardBorder}50` }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${percentage}%`,
                          background: i === 0 ? '#EF4444' : theme.colors.primary
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Analyse par jour de la semaine */}
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-4" style={cardStyle}>
        <h3 className="text-sm font-semibold mb-3" style={textPrimary}>
          Dépenses par jour de la semaine
        </h3>
        <div className="grid grid-cols-7 gap-1">
          {daysOfWeek.map((day, dayIndex) => {
            let totalJour = 0;
            Object.entries(depensesParJour).forEach(([jour, montant]) => {
              const date = new Date(selectedYear, currentMonth, parseInt(jour));
              const jourSemaine = date.getDay();
              const jourAjuste = jourSemaine === 0 ? 6 : jourSemaine - 1;
              if (jourAjuste === dayIndex) {
                totalJour += montant;
              }
            });

            const maxJourSemaine = Math.max(...daysOfWeek.map((_, di) => {
              let t = 0;
              Object.entries(depensesParJour).forEach(([jour, montant]) => {
                const date = new Date(selectedYear, currentMonth, parseInt(jour));
                const js = date.getDay();
                const ja = js === 0 ? 6 : js - 1;
                if (ja === di) t += montant;
              });
              return t;
            }));

            const height = maxJourSemaine > 0 ? (totalJour / maxJourSemaine) * 100 : 0;

            return (
              <div key={day} className="flex flex-col items-center">
                <div 
                  className="w-full rounded-t-lg mb-1"
                  style={{ 
                    height: `${Math.max(height, 5)}px`,
                    maxHeight: '60px',
                    minHeight: '4px',
                    background: totalJour > 0 ? theme.colors.primary : `${theme.colors.cardBorder}50`
                  }}
                />
                <span className="text-[8px]" style={textSecondary}>{day}</span>
                <span className="text-[8px] font-medium" style={textPrimary}>
                  {totalJour > 0 ? `${totalJour.toFixed(0)}€` : '-'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <SmartTips page="statistiques" />
    </div>
  );
}