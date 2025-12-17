'use client';

import { useTheme } from '@/contexts/theme-context';

interface ResteAVivreProps {
  resteAVivre: number;
  selectedYear: number;
  selectedMonth: number;
  className?: string;
  style?: React.CSSProperties;
}

export function ResteAVivre({ resteAVivre, selectedYear, selectedMonth, className = '', style = {} }: ResteAVivreProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  
  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  
  const joursRestants = Math.max(1, new Date(selectedYear, selectedMonth + 1, 0).getDate() - new Date().getDate());
  const parJour = resteAVivre > 0 ? (resteAVivre / joursRestants).toFixed(0) : 0;

  return (
    <div 
      className={`backdrop-blur-sm rounded-2xl p-4 shadow-sm border flex items-center ${className}`} 
      style={{ ...cardStyle, ...style }}
    >
      <div className="flex items-center justify-between w-full">
        <div>
          <p className="text-xs" style={textSecondary}>Reste à vivre</p>
          <p className={`text-xl font-semibold ${resteAVivre >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {resteAVivre.toFixed(2)} €
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px]" style={textSecondary}>Par jour restant</p>
          <p className="text-lg font-semibold" style={textPrimary}>
            {parJour} €
          </p>
        </div>
      </div>
    </div>
  );
}