"use client";

import { useTheme } from '@/contexts/theme-context';

interface SoldeCardProps {
  soldePrevu: number;
  soldeReel: number;
  devise?: string;
}

export default function SoldeCard({ soldePrevu, soldeReel, devise = '€' }: SoldeCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };
  const textSecondary = { color: theme.colors.textSecondary };

  const ecart = soldeReel - soldePrevu;

  return (
    <div 
      className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border text-center animate-fadeIn"
      style={{ ...cardStyle, animationDelay: '350ms' }}
    >
      <p className="text-xs mb-3" style={textSecondary}>Solde du mois</p>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="transition-transform duration-300 hover:scale-105">
          <p className="text-[10px] mb-1" style={textSecondary}>Prévu</p>
          <p className={`text-base font-bold tabular-nums ${soldePrevu >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {soldePrevu >= 0 ? '+' : ''}{soldePrevu.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {devise}
          </p>
        </div>
        <div className="transition-transform duration-300 hover:scale-105">
          <p className="text-[10px] mb-1" style={textSecondary}>Réel</p>
          <p className={`text-base font-bold tabular-nums ${soldeReel >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {soldeReel >= 0 ? '+' : ''}{soldeReel.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {devise}
          </p>
        </div>
      </div>
      
      <div 
        className="mt-4 pt-4"
        style={{ borderTopWidth: 1, borderColor: theme.colors.cardBorder }}
      >
        <p className="text-[10px] mb-1" style={textSecondary}>Écart</p>
        <p className={`text-xl font-bold tabular-nums transition-all duration-500 ${ecart >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {ecart >= 0 ? '+' : ''}{ecart.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {devise}
        </p>
      </div>
    </div>
  );
}
