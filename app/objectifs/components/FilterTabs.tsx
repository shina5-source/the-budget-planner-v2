"use client";

import { useTheme } from '@/contexts/theme-context';

type FilterType = 'tous' | 'court' | 'long';

interface FilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    tous: number;
    court: number;
    long: number;
  };
}

export default function FilterTabs({ activeFilter, onFilterChange, counts }: FilterTabsProps) {
  const { theme } = useTheme();

  const filters: { id: FilterType; label: string; emoji: string }[] = [
    { id: 'tous', label: 'Tous', emoji: '📋' },
    { id: 'court', label: 'Court terme', emoji: '🎯' },
    { id: 'long', label: 'Long terme', emoji: '🏔️' },
  ];

  return (
    <div className="flex gap-2 mb-4 animate-fadeIn" style={{ animationDelay: '200ms' }}>
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        const count = counts[filter.id];
        
        return (
          <button 
            key={filter.id} 
            onClick={() => onFilterChange(filter.id)} 
            className="flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all duration-300 border hover:scale-[1.02] active:scale-[0.98]"
            style={isActive 
              ? { 
                  background: theme.colors.primary, 
                  color: theme.colors.textOnPrimary, 
                  borderColor: theme.colors.primary,
                  boxShadow: `0 2px 10px ${theme.colors.primary}40`
                } 
              : { 
                  background: theme.colors.cardBackground, 
                  color: theme.colors.textPrimary, 
                  borderColor: theme.colors.cardBorder 
                }
            }
          >
            {filter.emoji} {filter.label}
            <span 
              className="ml-1 px-1.5 py-0.5 rounded-full text-[10px]"
              style={{
                background: isActive ? 'rgba(255,255,255,0.25)' : `${theme.colors.primary}20`,
                color: isActive ? theme.colors.textOnPrimary : theme.colors.primary
              }}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}