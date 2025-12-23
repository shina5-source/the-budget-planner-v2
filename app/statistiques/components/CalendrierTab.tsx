'use client';

import { useState, useMemo } from 'react';
import { Calendar, ExternalLink, X, TrendingDown, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/theme-context';
import { SmartTips } from '@/components';
import { Transaction, monthsFull, daysOfWeek, COLORS_TYPE } from './types';

interface CalendrierTabProps {
  filteredTransactions: Transaction[];
  selectedMonth: number | null;
  selectedYear: number;
}

export default function CalendrierTab({ filteredTransactions, selectedMonth, selectedYear }: CalendrierTabProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const router = useRouter();
  
  // État pour le jour sélectionné (pour afficher les détails)
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };

  const currentMonth = selectedMonth ?? new Date().getMonth();
  const daysInMonth = new Date(selectedYear, currentMonth + 1, 0).getDate();
  
  const firstDayOfMonth = new Date(selectedYear, currentMonth, 1).getDay();
  const firstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  // FIX: Exclure les Revenus (pluriel) - ne garder que les sorties
  const depensesTransactions = useMemo(() => {
    return filteredTransactions.filter(t => 
      t.type === 'Factures' || t.type === 'Dépenses' || t.type === 'Épargnes'
    );
  }, [filteredTransactions]);

  // Calculer les dépenses par jour
  const depensesParJour: Record<number, number> = {};
  let maxDepense = 0;

  depensesTransactions
    .filter(t => t.date)
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

  // Obtenir les transactions d'un jour spécifique
  const getTransactionsDuJour = (jour: number): Transaction[] => {
    return depensesTransactions.filter(t => {
      if (!t.date) return false;
      const date = new Date(t.date);
      return date.getDate() === jour && 
             date.getMonth() === currentMonth && 
             date.getFullYear() === selectedYear;
    });
  };

  // Transactions du jour sélectionné
  const transactionsDuJourSelectionne = useMemo(() => {
    if (selectedDay === null) return [];
    return getTransactionsDuJour(selectedDay);
  }, [selectedDay, depensesTransactions, currentMonth, selectedYear]);

  const getHeatColor = (amount: number): string => {
    if (amount === 0) return 'transparent';
    const intensity = maxDepense > 0 ? amount / maxDepense : 0;
    
    if (intensity < 0.25) return 'rgba(34, 197, 94, 0.3)';
    if (intensity < 0.5) return 'rgba(234, 179, 8, 0.4)';
    if (intensity < 0.75) return 'rgba(249, 115, 22, 0.5)';
    return 'rgba(239, 68, 68, 0.6)';
  };

  // Couleur du type de transaction
  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'Factures': return COLORS_TYPE.factures;
      case 'Dépenses': return COLORS_TYPE.depenses;
      case 'Épargnes': return COLORS_TYPE.epargnes;
      default: return theme.colors.primary;
    }
  };

  // Icône du type
  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'Factures': return '🏠';
      case 'Dépenses': return '🛒';
      case 'Épargnes': return '💰';
      default: return '📝';
    }
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

  // Navigation vers la page Transactions avec filtre de date
  const navigateToTransactions = (jour?: number) => {
    const day = jour ?? selectedDay;
    if (day) {
      const dateStr = `${selectedYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      router.push(`/transactions?date=${dateStr}`);
    } else {
      router.push('/transactions');
    }
  };

  // Handler de clic sur un jour
  const handleDayClick = (day: number) => {
    if (depensesParJour[day] > 0) {
      setSelectedDay(selectedDay === day ? null : day);
    }
  };

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
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold" style={textPrimary}>
            Carte de chaleur des sorties
          </h3>
          <span className="text-[9px] px-2 py-1 rounded-full" style={{ background: `${theme.colors.primary}20`, color: theme.colors.textSecondary }}>
            Cliquez sur un jour
          </span>
        </div>
        
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
            const isSelected = selectedDay === day;

            return (
              <div
                key={day}
                onClick={() => handleDayClick(day)}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-[10px] transition-all ${depense > 0 ? 'cursor-pointer hover:scale-105 hover:shadow-md' : ''}`}
                style={{ 
                  background: isSelected ? theme.colors.primary : bgColor || `${theme.colors.cardBorder}30`,
                  boxShadow: isToday ? `0 0 0 2px ${theme.colors.primary}` : isSelected ? `0 0 0 2px ${theme.colors.primary}` : 'none',
                  color: isSelected ? theme.colors.textOnPrimary : undefined
                }}
                title={depense > 0 ? `${day}/${currentMonth + 1}: ${depense.toFixed(2)}€ - Cliquez pour détails` : ''}
              >
                <span style={isSelected ? { color: theme.colors.textOnPrimary } : textPrimary}>{day}</span>
                {depense > 0 && (
                  <span className="text-[7px] font-medium" style={isSelected ? { color: theme.colors.textOnPrimary, opacity: 0.8 } : textSecondary}>
                    {depense.toFixed(0)}€
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Légende des couleurs */}
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

        {/* Info: que des sorties */}
        <p className="text-[8px] text-center mt-2" style={textSecondary}>
          💡 Affiche uniquement les sorties (Factures, Dépenses, Épargnes)
        </p>
      </div>

      {/* Détails du jour sélectionné */}
      {selectedDay !== null && transactionsDuJourSelectionne.length > 0 && (
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up" style={{ ...cardStyle, borderColor: theme.colors.primary }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${theme.colors.primary}20` }}
              >
                <TrendingDown size={16} style={{ color: theme.colors.primary }} />
              </div>
              <div>
                <h3 className="text-sm font-semibold" style={textPrimary}>
                  {selectedDay} {monthsFull[currentMonth]} {selectedYear}
                </h3>
                <p className="text-[9px]" style={textSecondary}>
                  {transactionsDuJourSelectionne.length} transaction{transactionsDuJourSelectionne.length > 1 ? 's' : ''} • {depensesParJour[selectedDay]?.toFixed(2)} €
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateToTransactions(selectedDay)}
                className="p-2 rounded-lg transition-all hover:scale-105"
                style={{ background: `${theme.colors.primary}20` }}
                title="Voir dans Transactions"
              >
                <ExternalLink size={14} style={{ color: theme.colors.primary }} />
              </button>
              <button
                onClick={() => setSelectedDay(null)}
                className="p-2 rounded-lg transition-all hover:scale-105"
                style={{ background: `${theme.colors.cardBorder}30` }}
                title="Fermer"
              >
                <X size={14} style={textSecondary} />
              </button>
            </div>
          </div>

          {/* Liste des transactions du jour */}
          <div className="space-y-2">
            {transactionsDuJourSelectionne.map((t, i) => (
              <div 
                key={t.id || i} 
                className="flex items-center justify-between p-2 rounded-lg transition-all hover:scale-[1.01]"
                style={{ background: `${theme.colors.primary}05` }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{getTypeLabel(t.type)}</span>
                  <div>
                    <p className="text-xs font-medium" style={textPrimary}>
                      {t.categorie || 'Sans catégorie'}
                    </p>
                    <div className="flex items-center gap-1">
                      <span 
                        className="text-[8px] px-1.5 py-0.5 rounded-full"
                        style={{ background: `${getTypeColor(t.type)}20`, color: getTypeColor(t.type) }}
                      >
                        {t.type}
                      </span>
                      {t.description && (
                        <span className="text-[8px]" style={textSecondary}>
                          {t.description.length > 20 ? t.description.substring(0, 20) + '...' : t.description}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold" style={{ color: getTypeColor(t.type) }}>
                  -{parseFloat(t.montant || '0').toFixed(2)} €
                </span>
              </div>
            ))}
          </div>

          {/* Bouton voir toutes les transactions */}
          <button
            onClick={() => navigateToTransactions(selectedDay)}
            className="w-full mt-3 py-2 rounded-lg text-xs font-medium transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}
          >
            <ExternalLink size={12} />
            Voir dans Transactions
          </button>
        </div>
      )}

      {/* Top 5 jours les plus dépensiers */}
      {top5Jours.length > 0 && (
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-3" style={cardStyle}>
          <h3 className="text-sm font-semibold mb-3" style={textPrimary}>
            Top 5 jours les plus dépensiers
          </h3>
          <div className="space-y-2">
            {top5Jours.map((item, i) => {
              const percentage = maxDepense > 0 ? (item.montant / maxDepense) * 100 : 0;
              const txCount = getTransactionsDuJour(item.jour).length;
              
              return (
                <div 
                  key={item.jour} 
                  className="flex items-center gap-3 cursor-pointer transition-all hover:scale-[1.01]"
                  onClick={() => setSelectedDay(item.jour)}
                >
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
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium" style={textPrimary}>
                          {item.jour} {monthsFull[currentMonth].slice(0, 3)}
                        </span>
                        <span className="text-[8px] px-1.5 py-0.5 rounded-full" style={{ background: `${theme.colors.cardBorder}50`, color: theme.colors.textSecondary }}>
                          {txCount} tx
                        </span>
                      </div>
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