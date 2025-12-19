"use client";

import { LucideIcon } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface PrevisionCardProps {
  title: string;
  prevu: number;
  reel: number;
  icon: LucideIcon;
  devise?: string;
  index?: number;
}

export default function PrevisionCard({ 
  title, 
  prevu, 
  reel, 
  icon: Icon,
  devise = '€',
  index = 0
}: PrevisionCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };

  const ecart = reel - prevu;
  const pourcentage = prevu > 0 ? Math.min((reel / prevu) * 100, 100) : 0;

  return (
    <div 
      className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg animate-fadeIn"
      style={{ ...cardStyle, animationDelay: `${150 + index * 100}ms` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs" style={textSecondary}>{title}</p>
          <p className="text-lg font-bold mt-1 tabular-nums" style={textPrimary}>
            {reel.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {devise}
          </p>
        </div>
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center border transition-transform duration-300 hover:scale-110"
          style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}
        >
          <Icon className="w-5 h-5" style={{ color: theme.colors.primary }} />
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-[10px]" style={textSecondary}>Prévu</span>
          <span className="text-xs font-medium tabular-nums" style={textPrimary}>
            {prevu.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {devise}
          </span>
        </div>
        
        {/* Progress bar */}
        <div 
          className="w-full rounded-full h-2 overflow-hidden"
          style={{ background: theme.colors.cardBackgroundLight }}
        >
          <div 
            className="h-2 rounded-full transition-all duration-500 ease-out"
            style={{ 
              width: `${pourcentage}%`, 
              background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primaryLight || theme.colors.primary})` 
            }} 
          />
        </div>
        
        <div className="flex justify-between">
          <span className="text-[10px]" style={textSecondary}>Écart</span>
          <span className={`text-xs font-semibold tabular-nums ${ecart >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {ecart >= 0 ? '+' : ''}{ecart.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {devise}
          </span>
        </div>
      </div>
    </div>
  );
}
