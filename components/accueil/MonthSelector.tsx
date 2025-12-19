'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface MonthSelectorProps {
  selectedYear: number;
  selectedMonth: number;
  setSelectedYear: (year: number) => void;
  setSelectedMonth: (month: number) => void;
  isCompactMode: boolean;
}

const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const monthsFull = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const years = Array.from({ length: 76 }, (_, i) => 2025 + i);

export default function MonthSelector({
  selectedYear,
  selectedMonth,
  setSelectedYear,
  setSelectedMonth,
  isCompactMode
}: MonthSelectorProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    setSelectedMonth(index);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    setSelectedYear(parseInt(e.target.value));
  };

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
          className="p-2 transition-all hover:scale-110 active:scale-95 rounded-lg"
          style={{ color: theme.colors.textSecondary }}
        >
          <ChevronLeft className="w-5 h-5" />
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
            {years.map(year => (
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
          {monthsShort.map((month, index) => (
            <button 
              type="button"
              key={index} 
              onClick={(e) => handleSelectMonth(e, index)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 active:scale-95 border" 
              style={selectedMonth === index 
                ? { 
                    background: theme.colors.primary, 
                    color: theme.colors.textOnPrimary || '#ffffff', 
                    borderColor: theme.colors.primary,
                    boxShadow: `0 2px 8px ${theme.colors.primary}40`
                  } 
                : { 
                    background: 'transparent', 
                    color: theme.colors.textPrimary, 
                    borderColor: theme.colors.cardBorder 
                  }
              }
            >
              {month}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
