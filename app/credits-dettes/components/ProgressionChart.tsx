"use client";

import { CheckCircle } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface Credit {
  id: number;
  categorie: string;
  montant: string;
  capitalTotal?: string;
  tauxInteret?: string;
  dureeMois?: string;
  dateDebut?: string;
}

interface CreditStats {
  progression: number;
  totalRembourse: number;
  estTermine: boolean;
}

interface ProgressionChartProps {
  credits: Credit[];
  getRemboursements: (credit: Credit) => CreditStats;
  devise: string;
}

export default function ProgressionChart({ credits, getRemboursements, devise }: ProgressionChartProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };

  const getProgressColor = (percent: number) => {
    if (percent >= 75) return 'bg-green-500';
    if (percent >= 50) return 'bg-yellow-500';
    if (percent >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (credits.length === 0) return null;

  return (
    <div 
      className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4 animate-fadeIn"
      style={{ ...cardStyle, animationDelay: '350ms' }}
    >
      <h3 
        className="text-sm font-semibold mb-4 text-center uppercase tracking-wide"
        style={textPrimary}
      >
        Progression des Remboursements
      </h3>

      <div className="space-y-3">
        {credits.map((credit, index) => {
          const { progression, totalRembourse, estTermine } = getRemboursements(credit);
          
          return (
            <div 
              key={credit.id} 
              className="space-y-1.5 animate-fadeIn"
              style={{ animationDelay: `${400 + index * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs flex-1 truncate pr-2 flex items-center gap-1" style={textSecondary}>
                  {estTermine && <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />}
                  <span className={estTermine ? 'text-green-400' : ''}>{credit.categorie}</span>
                </p>
                <p className="text-xs font-medium" style={textSecondary}>
                  {Math.round(progression)}%
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div 
                  className="flex-1 h-3 rounded-full overflow-hidden border"
                  style={{ 
                    background: theme.colors.cardBackgroundLight, 
                    borderColor: theme.colors.cardBorder 
                  }}
                >
                  <div 
                    className={`h-full ${getProgressColor(progression)} transition-all duration-1000 ease-out`}
                    style={{ width: `${Math.min(progression, 100)}%` }}
                  />
                </div>
                <p className="text-[10px] w-20 text-right tabular-nums" style={textSecondary}>
                  {totalRembourse.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} {devise}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}