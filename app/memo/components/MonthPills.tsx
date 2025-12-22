'use client';

import { useTheme } from '@/contexts/theme-context';

interface MonthPillsProps {
  expandedMonth: string | null;
  onMonthClick: (monthNum: string) => void;
  hasItemsForMonth: (monthNum: string) => boolean;
}

const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

export default function MonthPills({ 
  expandedMonth, 
  onMonthClick, 
  hasItemsForMonth 
}: MonthPillsProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {monthsShort.map((month, index) => {
        const monthNum = String(index + 1).padStart(2, '0');
        const isSelected = expandedMonth === monthNum;
        const hasItems = hasItemsForMonth(monthNum);

        return (
          <button 
            key={index} 
            onClick={() => onMonthClick(monthNum)} 
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border hover:scale-105 active:scale-95"
            style={
              isSelected 
                ? { 
                    background: theme.colors.primary, 
                    color: theme.colors.textOnPrimary, 
                    borderColor: theme.colors.primary,
                    boxShadow: `0 2px 8px ${theme.colors.primary}40`
                  } 
                : hasItems 
                  ? { 
                      background: `${theme.colors.primary}20`, 
                      color: theme.colors.textPrimary, 
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
            {hasItems && !isSelected && (
              <span 
                className="ml-1 w-1.5 h-1.5 rounded-full inline-block"
                style={{ background: theme.colors.primary }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}