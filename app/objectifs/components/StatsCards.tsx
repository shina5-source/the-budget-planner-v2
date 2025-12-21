"use client";

import { useTheme } from '@/contexts/theme-context';

interface StatsCardsProps {
  totalObjectifs: number;
  totalEpargne: number;
  progressionGlobale: number;
  devise: string;
}

export default function StatsCards({ 
  totalObjectifs, 
  totalEpargne, 
  progressionGlobale, 
  devise 
}: StatsCardsProps) {
  const { theme } = useTheme();

  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };

  const stats = [
    { label: 'Total objectifs', value: `${totalObjectifs.toFixed(0)}${devise}` },
    { label: 'Épargné', value: `${totalEpargne.toFixed(0)}${devise}` },
    { label: 'Progression', value: `${Math.round(progressionGlobale)}%` },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border text-center transition-all duration-300 hover:scale-[1.02] animate-fadeIn"
          style={{ ...cardStyle, animationDelay: `${index * 50}ms` }}
        >
          <p className="text-[10px]" style={textSecondary}>{stat.label}</p>
          <p className="text-xs font-semibold tabular-nums" style={textPrimary}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}