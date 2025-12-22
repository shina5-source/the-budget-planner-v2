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
    <>
      <style jsx global>{`
        @keyframes tab-glow {
          0%, 100% { box-shadow: 0 2px 10px rgba(139, 92, 246, 0.3); }
          50% { box-shadow: 0 4px 20px rgba(139, 92, 246, 0.5); }
        }
        .animate-tab-glow {
          animation: tab-glow 2s ease-in-out infinite;
        }
      `}</style>

      <div className="flex gap-2 mb-4 animate-fadeIn" style={{ animationDelay: '200ms' }}>
        {filters.map((filter, index) => {
          const isActive = activeFilter === filter.id;
          const count = counts[filter.id];
          
          return (
            <button 
              key={filter.id} 
              onClick={() => onFilterChange(filter.id)} 
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-medium transition-all duration-300 border hover:scale-[1.03] active:scale-[0.97] ${isActive ? 'animate-tab-glow' : ''}`}
              style={{
                ...(isActive 
                  ? { 
                      background: theme.colors.primary, 
                      color: theme.colors.textOnPrimary, 
                      borderColor: theme.colors.primary,
                      boxShadow: `0 2px 15px ${theme.colors.primary}40`
                    } 
                  : { 
                      background: theme.colors.cardBackground, 
                      color: theme.colors.textPrimary, 
                      borderColor: theme.colors.cardBorder 
                    }
                ),
                animationDelay: `${index * 50}ms`
              }}
            >
              <span className="inline-block transition-transform duration-300 hover:scale-110">
                {filter.emoji}
              </span>
              {' '}{filter.label}
              <span 
                className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold transition-all duration-300"
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
    </>
  );
}