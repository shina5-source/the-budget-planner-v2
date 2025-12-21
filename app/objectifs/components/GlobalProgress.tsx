"use client";

import { useTheme } from '@/contexts/theme-context';

interface GlobalProgressProps {
  progressionGlobale: number;
  objectifsCourtTerme: number;
  objectifsLongTerme: number;
  objectifsAvecRecurrence: number;
}

export default function GlobalProgress({
  progressionGlobale,
  objectifsCourtTerme,
  objectifsLongTerme,
  objectifsAvecRecurrence
}: GlobalProgressProps) {
  const { theme } = useTheme();

  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };
  const textSecondary = { color: theme.colors.textSecondary };

  return (
    <div 
      className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4 animate-fadeIn"
      style={{ ...cardStyle, animationDelay: '150ms' }}
    >
      <p className="text-[10px] mb-2 text-center" style={textSecondary}>
        Progression globale
      </p>
      
      <div 
        className="h-3 rounded-full overflow-hidden border"
        style={{ background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder }}
      >
        <div 
          className="h-full transition-all duration-700 ease-out"
          style={{ 
            width: `${Math.min(progressionGlobale, 100)}%`, 
            background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primaryLight || theme.colors.primary})` 
          }} 
        />
      </div>
      
      <div className="flex justify-center gap-4 mt-2">
        <span className="text-[10px]" style={textSecondary}>
          🎯 Court terme: {objectifsCourtTerme}
        </span>
        <span className="text-[10px]" style={textSecondary}>
          🏔️ Long terme: {objectifsLongTerme}
        </span>
        <span className="text-[10px]" style={textSecondary}>
          🔄 Récurrents: {objectifsAvecRecurrence}
        </span>
      </div>
    </div>
  );
}