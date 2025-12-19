'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { monthsFull, monthsShort, years } from './types';

interface MonthSelectorProps {
  selectedMonth: number | null;
  selectedYear: number;
  onMonthChange: (month: number | null) => void;
  onYearChange: (year: number) => void;
}

export default function MonthSelector({ 
  selectedMonth, 
  selectedYear, 
  onMonthChange, 
  onYearChange 
}: MonthSelectorProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  
  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };
  const textSecondary = { color: theme.colors.textSecondary };
  const inputStyle = { 
    background: theme.colors.cardBackgroundLight || theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder, 
    color: theme.colors.textPrimary 
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedMonth === null) {
      onYearChange(selectedYear - 1);
    } else if (selectedMonth === 0) {
      onMonthChange(11);
      onYearChange(selectedYear - 1);
    } else {
      onMonthChange(selectedMonth - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedMonth === null) {
      onYearChange(selectedYear + 1);
    } else if (selectedMonth === 11) {
      onMonthChange(0);
      onYearChange(selectedYear + 1);
    } else {
      onMonthChange(selectedMonth + 1);
    }
  };

  const handleSelectMonth = (e: React.MouseEvent, index: number | null) => {
    e.preventDefault();
    e.stopPropagation();
    onMonthChange(index);
  };

  return (
    <div 
      className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border mb-4"
      style={cardStyle}
    >
      {/* Navigation mois - Style identique aux autres pages */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-2 transition-all hover:scale-110 active:scale-95 rounded-lg"
          style={{ color: textSecondary.color }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-2">
          {/* Mois en couleur primary */}
          <span 
            className="text-lg font-bold"
            style={{ color: theme.colors.primary }}
          >
            {selectedMonth !== null ? monthsFull[selectedMonth] : 'Année'}
          </span>
          
          {/* Select année */}
          <select
            value={selectedYear}
            onChange={(e) => {
              e.stopPropagation();
              onYearChange(parseInt(e.target.value));
            }}
            onClick={(e) => e.stopPropagation()}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold border cursor-pointer transition-all hover:opacity-80"
            style={inputStyle}
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
          style={{ color: textSecondary.color }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      {/* Boutons mois - Style identique aux autres pages */}
      <div className="flex flex-wrap gap-2 justify-center mt-3">
        {/* Bouton "Année" pour voir l'année entière */}
        <button
          type="button"
          onClick={(e) => handleSelectMonth(e, null)}
          className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 active:scale-95 border"
          style={selectedMonth === null
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
          Année
        </button>
        
        {/* Boutons pour chaque mois */}
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
    </div>
  );
}
