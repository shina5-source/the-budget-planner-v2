'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

const monthsFull = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

interface MonthSelectorProps {
  selectedYear: number;
  selectedMonth: number | null;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number | null) => void;
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
  const inputStyle = { 
    background: theme.colors.cardBackgroundLight, 
    borderColor: theme.colors.cardBorder, 
    color: theme.colors.textPrimary 
  };

  return (
    <>
      <style jsx global>{`
        @keyframes month-btn-glow {
          0%, 100% { box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3); }
          50% { box-shadow: 0 4px 16px rgba(139, 92, 246, 0.5); }
        }
        .animate-month-btn-glow {
          animation: month-btn-glow 2s ease-in-out infinite;
        }
      `}</style>

      <div 
        className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border mb-4 animate-fadeIn"
        style={{ ...cardStyle, animationDelay: '100ms' }}
      >
        {/* Navigation mois */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onPrevMonth}
            className="p-2 transition-all duration-300 hover:scale-110 active:scale-95 rounded-lg"
            style={{ color: theme.colors.textSecondary }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <span 
              className="text-lg font-bold"
              style={{ color: theme.colors.primary }}
            >
              {selectedMonth !== null ? monthsFull[selectedMonth] : 'Année'}
            </span>
            
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(parseInt(e.target.value))}
              onClick={(e) => e.stopPropagation()}
              className="rounded-lg px-3 py-1.5 text-sm font-semibold border cursor-pointer transition-all duration-200 hover:opacity-80"
              style={inputStyle}
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <button
            type="button"
            onClick={onNextMonth}
            className="p-2 transition-all duration-300 hover:scale-110 active:scale-95 rounded-lg"
            style={{ color: theme.colors.textSecondary }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        {/* Boutons mois */}
        <div className="flex flex-wrap gap-2 justify-center mt-3">
          <button
            type="button"
            onClick={() => onMonthChange(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 active:scale-95 border ${selectedMonth === null ? 'animate-month-btn-glow' : ''}`}
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
          
          {monthsShort.map((month, index) => (
            <button
              type="button"
              key={index}
              onClick={() => onMonthChange(index)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 active:scale-95 border ${selectedMonth === index ? 'animate-month-btn-glow' : ''}`}
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
    </>
  );
}