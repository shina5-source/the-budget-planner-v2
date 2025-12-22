'use client';

import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface MonthData {
  count: number;
  total: number;
  checkedCount: number;
}

interface CalendarGridProps {
  selectedYear: number;
  selectedMonth: string | null;
  onYearChange: (year: number) => void;
  onPrevYear: () => void;
  onNextYear: () => void;
  onMonthSelect: (monthNum: string) => void;
  getMonthData: (monthNum: string) => MonthData;
}

const monthsData = [
  { num: '01', short: 'Jan', label: 'Janvier' },
  { num: '02', short: 'Fév', label: 'Février' },
  { num: '03', short: 'Mar', label: 'Mars' },
  { num: '04', short: 'Avr', label: 'Avril' },
  { num: '05', short: 'Mai', label: 'Mai' },
  { num: '06', short: 'Jui', label: 'Juin' },
  { num: '07', short: 'Jul', label: 'Juillet' },
  { num: '08', short: 'Aoû', label: 'Août' },
  { num: '09', short: 'Sep', label: 'Septembre' },
  { num: '10', short: 'Oct', label: 'Octobre' },
  { num: '11', short: 'Nov', label: 'Novembre' },
  { num: '12', short: 'Déc', label: 'Décembre' },
];

const years = Array.from({ length: 76 }, (_, i) => 2025 + i);

export default function CalendarGrid({
  selectedYear,
  selectedMonth,
  onYearChange,
  onPrevYear,
  onNextYear,
  onMonthSelect,
  getMonthData
}: CalendarGridProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  return (
    <div 
      className="rounded-2xl border p-4 shadow-sm"
      style={{ background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }}
    >
      {/* Header avec navigation année */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={onPrevYear}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ background: `${theme.colors.primary}15` }}
        >
          <ChevronLeft className="w-5 h-5" style={{ color: theme.colors.primary }} />
        </button>
        
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(parseInt(e.target.value))}
          className="text-xl font-bold bg-transparent border-none cursor-pointer text-center focus:outline-none"
          style={{ color: theme.colors.textPrimary }}
        >
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        
        <button 
          onClick={onNextYear}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ background: `${theme.colors.primary}15` }}
        >
          <ChevronRight className="w-5 h-5" style={{ color: theme.colors.primary }} />
        </button>
      </div>

      {/* Grille des mois */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {monthsData.map((month, index) => {
          const data = getMonthData(month.num);
          const isSelected = selectedMonth === month.num;
          const isCurrentMonth = parseInt(month.num) === currentMonth && selectedYear === currentYear;
          const hasItems = data.count > 0;
          const allChecked = data.count > 0 && data.checkedCount === data.count;
          const progress = data.count > 0 ? (data.checkedCount / data.count) * 100 : 0;

          return (
            <button
              key={month.num}
              onClick={() => onMonthSelect(month.num)}
              className="relative p-2 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden group"
              style={{
                background: isSelected 
                  ? theme.colors.primary 
                  : allChecked 
                    ? 'rgba(34, 197, 94, 0.15)'
                    : hasItems 
                      ? `${theme.colors.primary}10`
                      : theme.colors.cardBackgroundLight,
                borderWidth: 2,
                borderColor: isSelected 
                  ? theme.colors.primary 
                  : isCurrentMonth 
                    ? theme.colors.primary 
                    : allChecked
                      ? '#22c55e'
                      : 'transparent',
                animationDelay: `${index * 0.05}s`
              }}
            >
              {/* Indicateur de progression */}
              {hasItems && !isSelected && (
                <div 
                  className="absolute bottom-0 left-0 h-1 transition-all duration-500"
                  style={{ 
                    width: `${progress}%`,
                    background: allChecked ? '#22c55e' : theme.colors.primary,
                    borderRadius: '0 2px 0 0'
                  }}
                />
              )}

              {/* Contenu */}
              <div className="flex flex-col items-center">
                <span 
                  className="text-xs font-bold"
                  style={{ 
                    color: isSelected 
                      ? theme.colors.textOnPrimary 
                      : allChecked 
                        ? '#22c55e'
                        : theme.colors.textPrimary 
                  }}
                >
                  {month.short}
                </span>
                
                {hasItems ? (
                  <div className="flex items-center gap-1 mt-1">
                    {allChecked ? (
                      <Check className="w-3.5 h-3.5" style={{ color: isSelected ? theme.colors.textOnPrimary : '#22c55e' }} />
                    ) : (
                      <span 
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                        style={{ 
                          background: isSelected ? 'rgba(255,255,255,0.2)' : `${theme.colors.primary}20`,
                          color: isSelected ? theme.colors.textOnPrimary : theme.colors.primary
                        }}
                      >
                        {data.checkedCount}/{data.count}
                      </span>
                    )}
                  </div>
                ) : (
                  <span 
                    className="text-[10px] mt-1"
                    style={{ color: isSelected ? theme.colors.textOnPrimary : theme.colors.textSecondary }}
                  >
                    —
                  </span>
                )}
              </div>

              {/* Point mois actuel */}
              {isCurrentMonth && !isSelected && (
                <div 
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
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