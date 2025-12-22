"use client";

import { Percent } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface TauxEndettementProps {
  tauxEndettement: number;
}

export default function TauxEndettement({ tauxEndettement }: TauxEndettementProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };
  const textSecondary = { color: theme.colors.textSecondary };

  const getTauxColor = (taux: number) => {
    if (taux > 35) return '#ef4444';
    if (taux > 25) return '#f97316';
    return '#22c55e';
  };

  const getTauxTextColor = (taux: number) => {
    if (taux > 35) return 'text-red-400';
    if (taux > 25) return 'text-orange-400';
    return 'text-green-400';
  };

  return (
    <div 
      className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border text-center mb-4 animate-fadeIn transition-all duration-300 hover:scale-[1.02]"
      style={{ ...cardStyle, animationDelay: '150ms' }}
    >
      <div className="flex items-center justify-center gap-2 mb-3">
        <div 
          className="p-2 rounded-lg"
          style={{ background: `${theme.colors.primary}20` }}
        >
          <Percent className="w-5 h-5" style={{ color: theme.colors.primary }} />
        </div>
        <p className="text-xs uppercase tracking-wide" style={textSecondary}>
          Taux d&apos;Endettement
        </p>
      </div>

      <div className="relative w-24 h-24 mx-auto">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle 
            cx="48" 
            cy="48" 
            r="40" 
            stroke={theme.colors.primary} 
            strokeOpacity="0.2" 
            strokeWidth="8" 
            fill="none" 
          />
          <circle 
            cx="48" 
            cy="48" 
            r="40" 
            stroke={getTauxColor(tauxEndettement)} 
            strokeWidth="8" 
            fill="none" 
            strokeDasharray={`${Math.min(tauxEndettement, 100) * 2.51} 251`} 
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${getTauxTextColor(tauxEndettement)}`}>
            {Math.round(tauxEndettement)}%
          </span>
        </div>
      </div>

      <p className="text-xs mt-3" style={textSecondary}>
        {tauxEndettement > 35 ? (
          <span className="text-red-400">⚠️ Au-dessus du seuil recommandé (35%)</span>
        ) : tauxEndettement > 25 ? (
          <span className="text-orange-400">⚡ Proche du seuil (35%)</span>
        ) : (
          <span className="text-green-400">✅ Taux d&apos;endettement sain</span>
        )}
      </p>
    </div>
  );
}