"use client";

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const monthsFull = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const years = Array.from({ length: 76 }, (_, i) => 2025 + i);

interface MonthSelectorProps {
  selectedYear: number;
  selectedMonth: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
}

export default function MonthSelector({
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange
}: MonthSelectorProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };
  const textPrimary = { color: theme.colors.textPrimary };
  const inputStyle = { 
    background: theme.colors.cardBackgroundLight, 
    borderColor: theme.colors.cardBorder, 
    color: theme.colors.textPrimary 
  };

  const prevMonth = () => {
    if (selectedMonth === 0) {
      onMonthChange(11);
      onYearChange(selectedYear - 1);
    } else {
      onMonthChange(selectedMonth - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      onMonthChange(0);
      onYearChange(selectedYear + 1);
    } else {
      onMonthChange(selectedMonth + 1);
    }
  };

  return (
    <div 
      className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4 animate-fadeIn"
      style={{ ...cardStyle, animationDelay: '50ms' }}
    >
      {/* Navigation mois/année */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={prevMonth} 
          className="p-2 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ background: theme.colors.cardBackgroundLight }}
        >
          <ChevronLeft className="w-5 h-5" style={textPrimary} />
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold" style={textPrimary}>
            {monthsFull[selectedMonth]}
          </span>
          <select 
            value={selectedYear} 
            onChange={(e) => onYearChange(parseInt(e.target.value))} 
            className="rounded-lg px-3 py-1 text-lg font-semibold border focus:outline-none transition-all duration-200"
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
          style={{ background: theme.colors.cardBackgroundLight }}
        >
          <ChevronRight className="w-5 h-5" style={textPrimary} />
        </button>
      </div>

      {/* Boutons mois */}
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
                  borderColor: theme.colors.primary 
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