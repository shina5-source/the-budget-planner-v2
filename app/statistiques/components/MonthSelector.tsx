'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { monthsFull, years } from './types';

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
  const { theme } = useTheme();
  
  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };
  const textPrimary = { color: theme.colors.textPrimary };
  const inputStyle = { 
    background: theme.colors.cardBackgroundLight || theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder, 
    color: theme.colors.textPrimary 
  };

  const handlePrevMonth = () => {
    if (selectedMonth === null) {
      onYearChange(selectedYear - 1);
    } else if (selectedMonth === 0) {
      onMonthChange(11);
      onYearChange(selectedYear - 1);
    } else {
      onMonthChange(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === null) {
      onYearChange(selectedYear + 1);
    } else if (selectedMonth === 11) {
      onMonthChange(0);
      onYearChange(selectedYear + 1);
    } else {
      onMonthChange(selectedMonth + 1);
    }
  };

  return (
    <div 
      className="flex items-center justify-between p-3 rounded-2xl border mb-4"
      style={cardStyle}
    >
      <button
        onClick={handlePrevMonth}
        className="p-2 rounded-full transition-all hover:scale-110"
        style={{ background: `${theme.colors.primary}20` }}
      >
        <ChevronLeft size={18} style={{ color: theme.colors.primary }} />
      </button>
      
      <div className="flex items-center gap-2">
        <select
          value={selectedMonth ?? 'all'}
          onChange={(e) => onMonthChange(e.target.value === 'all' ? null : parseInt(e.target.value))}
          className="px-3 py-1.5 rounded-lg border text-sm font-medium"
          style={inputStyle}
        >
          <option value="all">Année entière</option>
          {monthsFull.map((month, i) => (
            <option key={i} value={i}>{month}</option>
          ))}
        </select>
        
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(parseInt(e.target.value))}
          className="px-3 py-1.5 rounded-lg border text-sm font-medium"
          style={inputStyle}
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      
      <button
        onClick={handleNextMonth}
        className="p-2 rounded-full transition-all hover:scale-110"
        style={{ background: `${theme.colors.primary}20` }}
      >
        <ChevronRight size={18} style={{ color: theme.colors.primary }} />
      </button>
    </div>
  );
}