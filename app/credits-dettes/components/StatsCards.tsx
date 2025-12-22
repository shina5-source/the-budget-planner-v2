"use client";

import { Wallet, Calendar, TrendingDown } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface StatsCardsProps {
  totalEndettement: number;
  totalMensualites: number;
  cumulAnnuel: number;
  devise: string;
}

export default function StatsCards({ 
  totalEndettement, 
  totalMensualites, 
  cumulAnnuel, 
  devise 
}: StatsCardsProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };

  return (
    <>
      {/* Card Endettement Total */}
      <div 
        className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border text-center mb-4 animate-fadeIn transition-all duration-300 hover:scale-[1.02]"
        style={{ ...cardStyle, animationDelay: '100ms' }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <div 
            className="p-2 rounded-lg"
            style={{ background: `${theme.colors.primary}20` }}
          >
            <Wallet className="w-5 h-5" style={{ color: theme.colors.primary }} />
          </div>
          <p className="text-xs uppercase tracking-wide" style={textSecondary}>
            Endettement Total
          </p>
        </div>
        <p className="text-2xl font-bold" style={textPrimary}>
          {totalEndettement.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {devise}
        </p>
        <p className="text-[10px] mt-1" style={textSecondary}>
          reste à rembourser
        </p>
      </div>

      {/* Cards Mensualité et Cumul */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div 
          className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border text-center animate-fadeIn transition-all duration-300 hover:scale-[1.02]"
          style={{ ...cardStyle, animationDelay: '200ms' }}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <Calendar className="w-4 h-4" style={{ color: theme.colors.primary }} />
            <p className="text-[10px]" style={textSecondary}>Mensualité totale</p>
          </div>
          <p className="text-lg font-semibold" style={textPrimary}>
            {totalMensualites.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {devise}
          </p>
        </div>

        <div 
          className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border text-center animate-fadeIn transition-all duration-300 hover:scale-[1.02]"
          style={{ ...cardStyle, animationDelay: '250ms' }}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4" style={{ color: theme.colors.primary }} />
            <p className="text-[10px]" style={textSecondary}>Cumul annuel</p>
          </div>
          <p className="text-lg font-semibold" style={textPrimary}>
            {cumulAnnuel.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {devise}
          </p>
        </div>
      </div>
    </>
  );
}