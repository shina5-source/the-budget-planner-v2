'use client';

import { Activity } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface HealthGaugeProps {
  score: number;
}

export function HealthGauge({ score }: HealthGaugeProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  
  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  
  const getScoreColor = (s: number) => s >= 80 ? '#4CAF50' : s >= 60 ? '#8BC34A' : s >= 40 ? '#FF9800' : s >= 20 ? '#FF5722' : '#F44336';
  const getScoreLabel = (s: number) => s >= 80 ? 'Excellent !' : s >= 60 ? 'Bien' : s >= 40 ? 'Moyen' : s >= 20 ? 'À améliorer' : 'Critique';
  const getScoreMessage = (s: number) => s >= 80 ? 'Félicitations ! Gestion exemplaire.' : s >= 60 ? 'Bonne gestion, continuez !' : s >= 40 ? 'Des améliorations possibles.' : s >= 20 ? 'Attention aux dépenses.' : 'Situation critique !';
  
  const scoreColor = getScoreColor(score);
  
  return (
    <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up" style={cardStyle}>
      <div className="flex items-center gap-4">
        <div className="relative">
          <svg width={70} height={70} className="transform -rotate-90">
            <circle cx={35} cy={35} r={30} stroke={`${theme.colors.cardBorder}50`} strokeWidth={6} fill="none" />
            <circle 
              cx={35} 
              cy={35} 
              r={30} 
              stroke={scoreColor} 
              strokeWidth={6} 
              fill="none" 
              strokeDasharray={188} 
              strokeDashoffset={188 - (score / 100) * 188} 
              strokeLinecap="round" 
              className="transition-all duration-1000 ease-out" 
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold" style={{ color: scoreColor }}>{score}</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" style={{ color: scoreColor }} />
            <span className="text-sm font-semibold" style={textPrimary}>Santé du budget</span>
          </div>
          <p className="text-lg font-bold mt-1" style={{ color: scoreColor }}>{getScoreLabel(score)}</p>
          <p className="text-[10px]" style={textSecondary}>{getScoreMessage(score)}</p>
        </div>
      </div>
    </div>
  );
}