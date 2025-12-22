'use client';

import { TrendingUp, TrendingDown, PiggyBank, Percent } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { useMemo } from 'react';

interface StatsCardsProps {
  totalEpargnesMois: number;
  totalReprisesMois: number;
  netEpargneMois: number;
  tauxEpargne: number;
  devise: string;
}

export default function StatsCards({ 
  totalEpargnesMois, 
  totalReprisesMois, 
  netEpargneMois, 
  tauxEpargne,
  devise 
}: StatsCardsProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const cardStyle = useMemo(() => ({ 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  }), [theme.colors.cardBackground, theme.colors.cardBorder]);

  const stats = useMemo(() => [
    {
      icon: TrendingUp,
      label: 'Épargné',
      value: totalEpargnesMois,
      color: '#22c55e',
      bgColor: 'rgba(34, 197, 94, 0.15)',
      prefix: '+'
    },
    {
      icon: TrendingDown,
      label: 'Repris',
      value: totalReprisesMois,
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.15)',
      prefix: '-'
    },
    {
      icon: PiggyBank,
      label: 'Net',
      value: netEpargneMois,
      color: netEpargneMois >= 0 ? '#22c55e' : '#ef4444',
      bgColor: netEpargneMois >= 0 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
      prefix: netEpargneMois >= 0 ? '+' : ''
    },
    {
      icon: Percent,
      label: 'Taux',
      value: tauxEpargne,
      color: tauxEpargne >= 20 ? '#22c55e' : tauxEpargne >= 10 ? '#f59e0b' : '#ef4444',
      bgColor: tauxEpargne >= 20 ? 'rgba(34, 197, 94, 0.15)' : tauxEpargne >= 10 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
      isPercent: true
    }
  ], [totalEpargnesMois, totalReprisesMois, netEpargneMois, tauxEpargne]);

  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <div 
            key={stat.label}
            className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fadeIn transition-all duration-300 hover:scale-[1.02]"
            style={{ 
              ...cardStyle, 
              animationDelay: `${0.1 + index * 0.05}s` 
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: stat.bgColor }}
              >
                <Icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <span className="text-xs font-medium" style={{ color: theme.colors.textSecondary }}>
                {stat.label}
              </span>
            </div>
            <p 
              className="text-lg font-bold"
              style={{ color: stat.color }}
            >
              {stat.isPercent 
                ? `${stat.value.toFixed(1)}%`
                : `${stat.prefix}${stat.value.toFixed(2)} ${devise}`
              }
            </p>
          </div>
        );
      })}
    </div>
  );
}