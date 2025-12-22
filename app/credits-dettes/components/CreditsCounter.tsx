"use client";

import { useTheme } from '@/contexts/theme-context';

interface CreditsCounterProps {
  total: number;
  actifs: number;
  termines: number;
}

export default function CreditsCounter({ total, actifs, termines }: CreditsCounterProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };

  if (total === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-2 mb-4 animate-fadeIn" style={{ animationDelay: '300ms' }}>
      <div 
        className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border text-center transition-all duration-300 hover:scale-[1.02]"
        style={cardStyle}
      >
        <p className="text-[10px]" style={textSecondary}>Total</p>
        <p className="text-xl font-bold" style={textPrimary}>{total}</p>
        <p className="text-[10px]" style={textSecondary}>crédit{total > 1 ? 's' : ''}</p>
      </div>

      <div 
        className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border text-center transition-all duration-300 hover:scale-[1.02]"
        style={cardStyle}
      >
        <p className="text-[10px]" style={textSecondary}>En cours</p>
        <p className="text-xl font-bold text-orange-400">{actifs}</p>
        <p className="text-[10px]" style={textSecondary}>actif{actifs > 1 ? 's' : ''}</p>
      </div>

      <div 
        className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border text-center transition-all duration-300 hover:scale-[1.02]"
        style={cardStyle}
      >
        <p className="text-[10px]" style={textSecondary}>Terminé{termines > 1 ? 's' : ''}</p>
        <p className="text-xl font-bold text-green-400">{termines}</p>
        <p className="text-[10px]" style={textSecondary}>remboursé{termines > 1 ? 's' : ''}</p>
      </div>
    </div>
  );
}