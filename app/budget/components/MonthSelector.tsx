'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

export const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
export const monthsFull = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
export const years = Array.from({ length: 76 }, (_, i) => 2025 + i);

interface MonthSelectorProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export function MonthSelector({ 
  selectedMonth, 
  selectedYear, 
  onMonthChange, 
  onYearChange, 
  onPrevMonth, 
  onNextMonth 
}: MonthSelectorProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  
  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const inputStyle = { background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary };

  return (
    <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4" style={cardStyle}>
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={onPrevMonth} 
          className="p-2 hover:scale-110 transition-transform rounded-lg" 
          style={{ background: `${theme.colors.primary}10` }}
        >
          <ChevronLeft className="w-5 h-5" style={textPrimary} />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold" style={textPrimary}>{monthsFull[selectedMonth]}</span>
          <select 
            value={selectedYear} 
            onChange={(e) => onYearChange(parseInt(e.target.value))} 
            className="rounded-lg px-3 py-1 text-lg font-semibold border" 
            style={inputStyle}
          >
            {years.map(year => (<option key={year} value={year}>{year}</option>))}
          </select>
        </div>
        <button 
          onClick={onNextMonth} 
          className="p-2 hover:scale-110 transition-transform rounded-lg" 
          style={{ background: `${theme.colors.primary}10` }}
        >
          <ChevronRight className="w-5 h-5" style={textPrimary} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {monthsShort.map((month, index) => (
          <button 
            key={index} 
            onClick={() => onMonthChange(index)} 
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 border" 
            style={selectedMonth === index 
              ? { background: theme.colors.primary, color: theme.colors.textOnPrimary, borderColor: theme.colors.primary } 
              : { background: 'transparent', color: theme.colors.textPrimary, borderColor: theme.colors.cardBorder }
            }
          >
            {month}
          </button>
        ))}
      </div>
    </div>
  );
}