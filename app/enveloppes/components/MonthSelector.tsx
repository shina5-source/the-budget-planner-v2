'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { monthsShort, monthsFull, years } from './constants';

interface MonthSelectorProps {
  selectedYear: number;
  selectedMonth: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function MonthSelector({
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
  onPrevMonth,
  onNextMonth
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

  return (
    <div 
      className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4 animate-fade-in-up stagger-1"
      style={cardStyle}
    >
      {/* Header avec navigation */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={onPrevMonth} 
          className="p-2 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ background: `${theme.colors.primary}15` }}
        >
          <ChevronLeft className="w-5 h-5" style={{ color: theme.colors.primary }} />
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold" style={textPrimary}>
            {monthsFull[selectedMonth]}
          </span>
          <select 
            value={selectedYear} 
            onChange={(e) => onYearChange(parseInt(e.target.value))} 
            className="rounded-lg px-3 py-1 text-lg font-semibold border cursor-pointer focus:outline-none"
            style={inputStyle}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        <button 
          onClick={onNextMonth} 
          className="p-2 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ background: `${theme.colors.primary}15` }}
        >
          <ChevronRight className="w-5 h-5" style={{ color: theme.colors.primary }} />
        </button>
      </div>

      {/* Pills des mois */}
      <div className="flex flex-wrap gap-2 justify-center">
        {monthsShort.map((month, index) => {
          const isSelected = selectedMonth === index;
          const isCurrentMonth = index === new Date().getMonth() && selectedYear === new Date().getFullYear();
          
          return (
            <button 
              key={index} 
              onClick={() => onMonthChange(index)} 
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border hover:scale-105 active:scale-95 relative"
              style={isSelected 
                ? { 
                    background: theme.colors.primary, 
                    color: theme.colors.textOnPrimary, 
                    borderColor: theme.colors.primary 
                  } 
                : { 
                    background: 'transparent', 
                    color: theme.colors.textPrimary, 
                    borderColor: isCurrentMonth ? theme.colors.primary : theme.colors.cardBorder 
                  }
              }
            >
              {month}
              {isCurrentMonth && !isSelected && (
                <div 
                  className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                  style={{ background: theme.colors.primary }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}