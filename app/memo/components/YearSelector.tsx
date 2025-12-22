'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface YearSelectorProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  onPrevYear: () => void;
  onNextYear: () => void;
}

const years = Array.from({ length: 76 }, (_, i) => 2025 + i);

export default function YearSelector({ 
  selectedYear, 
  onYearChange, 
  onPrevYear, 
  onNextYear 
}: YearSelectorProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const inputStyle = { 
    background: theme.colors.cardBackgroundLight, 
    borderColor: theme.colors.cardBorder, 
    color: theme.colors.textPrimary 
  };

  return (
    <div className="flex items-center justify-between">
      <button 
        onClick={onPrevYear} 
        className="p-2 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
        style={{ background: `${theme.colors.primary}15` }}
      >
        <ChevronLeft className="w-5 h-5" style={{ color: theme.colors.textPrimary }} />
      </button>
      
      <div className="flex items-center gap-2">
        <span 
          className="text-lg font-semibold" 
          style={{ color: theme.colors.textPrimary }}
        >
          Année
        </span>
        <select 
          value={selectedYear} 
          onChange={(e) => onYearChange(parseInt(e.target.value))} 
          className="rounded-xl px-3 py-2 text-lg font-semibold border cursor-pointer transition-all duration-200 hover:scale-105"
          style={inputStyle}
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      
      <button 
        onClick={onNextYear} 
        className="p-2 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
        style={{ background: `${theme.colors.primary}15` }}
      >
        <ChevronRight className="w-5 h-5" style={{ color: theme.colors.textPrimary }} />
      </button>
    </div>
  );
}