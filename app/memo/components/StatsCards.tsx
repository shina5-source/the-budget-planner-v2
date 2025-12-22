'use client';

import { TrendingUp, CheckCircle2, ListTodo } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface StatsCardsProps {
  yearTotal: number;
  totalItems: number;
  checkedItems: number;
  devise: string;
}

function ProgressRing({ progress, size = 48, strokeWidth = 4, color }: { progress: number; size?: number; strokeWidth?: number; color: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="opacity-20"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700 ease-out"
      />
    </svg>
  );
}

export default function StatsCards({ 
  yearTotal, 
  totalItems, 
  checkedItems,
  devise 
}: StatsCardsProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const completionRate = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
  const isComplete = completionRate === 100 && totalItems > 0;

  const cards = [
    {
      icon: TrendingUp,
      label: 'Total prévu',
      value: `${yearTotal.toFixed(2)} ${devise}`,
      color: theme.colors.primary,
      bgColor: `${theme.colors.primary}15`
    },
    {
      icon: ListTodo,
      label: 'Mémos',
      value: totalItems.toString(),
      subValue: totalItems > 0 ? `élément${totalItems > 1 ? 's' : ''}` : 'aucun',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.15)'
    },
    {
      icon: CheckCircle2,
      label: 'Progression',
      value: `${completionRate}%`,
      subValue: `${checkedItems}/${totalItems}`,
      color: isComplete ? '#22c55e' : '#f59e0b',
      bgColor: isComplete ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
      showRing: true
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="rounded-2xl border p-3 transition-all duration-300 hover:scale-[1.02]"
            style={{ 
              background: theme.colors.cardBackground, 
              borderColor: theme.colors.cardBorder
            }}
          >
            <div className="flex flex-col items-center text-center">
              {card.showRing ? (
                <div className="relative mb-2">
                  <ProgressRing progress={completionRate} color={card.color} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon className="w-5 h-5" style={{ color: card.color }} />
                  </div>
                </div>
              ) : (
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                  style={{ background: card.bgColor }}
                >
                  <Icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
              )}
              
              <p 
                className="text-[10px] font-medium"
                style={{ color: theme.colors.textSecondary }}
              >
                {card.label}
              </p>
              
              <p 
                className="text-sm font-bold"
                style={{ color: card.color }}
              >
                {card.value}
              </p>
              
              {card.subValue && (
                <p 
                  className="text-[10px]"
                  style={{ color: theme.colors.textSecondary }}
                >
                  {card.subValue}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}