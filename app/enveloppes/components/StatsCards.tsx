'use client';

import { useTheme } from '@/contexts/theme-context';

interface StatsCardsProps {
  totalBudget: number;
  totalDepense: number;
  totalReste: number;
  devise: string;
}

export default function StatsCards({
  totalBudget,
  totalDepense,
  totalReste,
  devise
}: StatsCardsProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };

  const stats = [
    { 
      label: 'Budget', 
      value: totalBudget, 
      color: textPrimary.color 
    },
    { 
      label: 'Dépensé', 
      value: totalDepense, 
      color: '#f87171' // red-400
    },
    { 
      label: 'Reste', 
      value: totalReste, 
      color: totalReste >= 0 ? '#4ade80' : '#f87171' // green-400 or red-400
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className={`backdrop-blur-sm rounded-2xl text-center p-3 border animate-fade-in-up stagger-${index + 2} transition-all duration-200 hover:scale-[1.02]`}
          style={cardStyle}
        >
          <p className="text-[10px]" style={textSecondary}>
            {stat.label}
          </p>
          <p 
            className="text-xs font-semibold"
            style={{ color: stat.color }}
          >
            {stat.value.toFixed(0)}{devise}
          </p>
        </div>
      ))}
    </div>
  );
}