'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { useMemo, useCallback } from 'react';

interface MonthSelectorProps {
  selectedYear: number;
  selectedMonth: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
}

const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const monthsFull = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export default function MonthSelector({ selectedYear, selectedMonth, onYearChange, onMonthChange }: MonthSelectorProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const years = useMemo(() => Array.from({ length: 81 }, (_, i) => 2020 + i), []);

  const cardStyle = useMemo(() => ({ 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  }), [theme.colors.cardBackground, theme.colors.cardBorder]);

  const inputStyle = useMemo(() => ({ 
    background: theme.colors.cardBackgroundLight, 
    borderColor: theme.colors.cardBorder, 
    color: theme.colors.textPrimary 
  }), [theme.colors.cardBackgroundLight, theme.colors.cardBorder, theme.colors.textPrimary]);

  const prevMonth = useCallback(() => {
    if (selectedMonth === 0) {
      onMonthChange(11);
      onYearChange(selectedYear - 1);
    } else {
      onMonthChange(selectedMonth - 1);
    }
  }, [selectedMonth, selectedYear, onMonthChange, onYearChange]);

  const nextMonth = useCallback(() => {
    if (selectedMonth === 11) {
      onMonthChange(0);
      onYearChange(selectedYear + 1);
    } else {
      onMonthChange(selectedMonth + 1);
    }
  }, [selectedMonth, selectedYear, onMonthChange, onYearChange]);

  return (
    <div 
      className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4 animate-fadeIn"
      style={{ ...cardStyle, animationDelay: '0.1s' }}
    >
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={prevMonth} 
          className="p-2 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ background: `${theme.colors.primary}15` }}
        >
          <ChevronLeft className="w-5 h-5" style={{ color: theme.colors.primary }} />
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold" style={{ color: theme.colors.textPrimary }}>
            {monthsFull[selectedMonth]}
          </span>
          <select 
            value={selectedYear} 
            onChange={(e) => onYearChange(parseInt(e.target.value))} 
            className="rounded-lg px-3 py-1 text-lg font-semibold border cursor-pointer transition-all duration-200 hover:opacity-80"
            style={inputStyle}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        <button 
          onClick={nextMonth} 
          className="p-2 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ background: `${theme.colors.primary}15` }}
        >
          <ChevronRight className="w-5 h-5" style={{ color: theme.colors.primary }} />
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center">
        {monthsShort.map((month, index) => (
          <button 
            key={index} 
            onClick={() => onMonthChange(index)} 
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border hover:scale-105 active:scale-95"
            style={selectedMonth === index 
              ? { 
                  background: theme.colors.primary, 
                  color: theme.colors.textOnPrimary, 
                  borderColor: theme.colors.primary,
                  transform: 'scale(1.05)'
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