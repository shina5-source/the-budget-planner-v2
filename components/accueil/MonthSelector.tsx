'use client';

import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface MonthSelectorProps {
  selectedYear: number;
  selectedMonth: number;
  setSelectedYear: (year: number) => void;
  setSelectedMonth: (month: number) => void;
  isCompactMode: boolean;
  // Nouvelles props pour la date de départ
  minMonth?: number;
  minYear?: number;
}

const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const monthsFull = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const years = Array.from({ length: 76 }, (_, i) => 2025 + i);

export default function MonthSelector({
  selectedYear,
  selectedMonth,
  setSelectedYear,
  setSelectedMonth,
  isCompactMode,
  minMonth,
  minYear
}: MonthSelectorProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };

  /**
   * Vérifie si un mois/année est accessible (après la date de départ)
   */
  const estMoisAccessible = (mois: number, annee: number): boolean => {
    // Si pas de limite définie, tout est accessible
    if (minMonth === undefined || minYear === undefined) return true;
    
    // Comparer année puis mois
    if (annee > minYear) return true;
    if (annee < minYear) return false;
    // Même année, comparer les mois
    return mois >= minMonth;
  };

  /**
   * Vérifie si on peut aller au mois précédent
   */
  const peutAllerMoisPrecedent = (): boolean => {
    let prevMonth = selectedMonth - 1;
    let prevYear = selectedYear;
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear--;
    }
    return estMoisAccessible(prevMonth, prevYear);
  };

  /**
   * Filtre les années accessibles
   */
  const anneesAccessibles = years.filter(year => {
    if (minYear === undefined) return true;
    return year >= minYear;
  });

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!peutAllerMoisPrecedent()) return;
    
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleSelectMonth = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Vérifier si le mois est accessible
    if (!estMoisAccessible(index, selectedYear)) return;
    
    setSelectedMonth(index);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const newYear = parseInt(e.target.value);
    setSelectedYear(newYear);
    
    // Si le mois sélectionné n'est plus accessible avec la nouvelle année, 
    // aller au premier mois accessible
    if (!estMoisAccessible(selectedMonth, newYear) && minMonth !== undefined) {
      setSelectedMonth(minMonth);
    }
  };

  const canGoPrev = peutAllerMoisPrecedent();

  return (
    <div 
      className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border"
      style={cardStyle}
    >
      {/* Navigation mois */}
      <div className="flex items-center justify-between">
        <button 
          type="button"
          onClick={handlePrevMonth}
          disabled={!canGoPrev}
          className={`p-2 transition-all rounded-lg ${canGoPrev ? 'hover:scale-110 active:scale-95' : 'opacity-30 cursor-not-allowed'}`}
          style={{ color: theme.colors.textSecondary }}
          title={!canGoPrev ? 'Date de départ atteinte' : 'Mois précédent'}
        >
          {canGoPrev ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <Lock className="w-4 h-4" />
          )}
        </button>
        
        <div className="flex items-center gap-2">
          <span 
            className="text-lg font-bold"
            style={{ color: theme.colors.primary }}
          >
            {monthsFull[selectedMonth]}
          </span>
          
          <select 
            value={selectedYear} 
            onChange={handleYearChange}
            onClick={(e) => e.stopPropagation()}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold border cursor-pointer transition-all hover:opacity-80" 
            style={{ 
              background: theme.colors.cardBackgroundLight, 
              borderColor: theme.colors.cardBorder, 
              color: theme.colors.textPrimary 
            }}
          >
            {anneesAccessibles.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        <button 
          type="button"
          onClick={handleNextMonth}
          className="p-2 transition-all hover:scale-110 active:scale-95 rounded-lg"
          style={{ color: theme.colors.textSecondary }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      {/* Boutons mois */}
      {!isCompactMode && (
        <div className="flex flex-wrap gap-2 justify-center mt-3">
          {monthsShort.map((month, index) => {
            const accessible = estMoisAccessible(index, selectedYear);
            const isSelected = selectedMonth === index;
            
            return (
              <button 
                type="button"
                key={index} 
                onClick={(e) => handleSelectMonth(e, index)}
                disabled={!accessible}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  accessible ? 'hover:scale-105 active:scale-95' : 'opacity-30 cursor-not-allowed'
                }`}
                style={isSelected 
                  ? { 
                      background: theme.colors.primary, 
                      color: theme.colors.textOnPrimary || '#ffffff', 
                      borderColor: theme.colors.primary,
                      boxShadow: `0 2px 8px ${theme.colors.primary}40`
                    } 
                  : { 
                      background: 'transparent', 
                      color: accessible ? theme.colors.textPrimary : theme.colors.textSecondary, 
                      borderColor: theme.colors.cardBorder 
                    }
                }
                title={!accessible ? 'Avant la date de départ' : monthsFull[index]}
              >
                {month}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}