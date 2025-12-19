'use client';

import { AlertTriangle, Clock } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface RecurringTransaction {
  id: string;
  nom: string;
  montant: number;
  jourDuMois?: number;
}

interface NextPayday {
  nom: string;
  jours: number;
  montant: number;
}

interface AlertCardsProps {
  facturesAVenir: RecurringTransaction[];
  nextPayday: NextPayday | null;
  currentDay: number;
  devise: string;
}

export default function AlertCards({ facturesAVenir, nextPayday, currentDay, devise }: AlertCardsProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const textSecondary = { color: theme.colors.textSecondary };

  if (facturesAVenir.length === 0 && !nextPayday) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 animate-fade-in-up stagger-4 opacity-0" style={{ animationFillMode: 'forwards' }}>
      {facturesAVenir.length > 0 && (
        <div 
          className="backdrop-blur-sm rounded-xl p-3 shadow-sm border bg-orange-500/10 transition-transform hover:scale-[1.02]" 
          style={{ borderColor: '#FF980050' }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[10px] font-semibold text-orange-400">
              {facturesAVenir.length} facture(s) à venir
            </span>
          </div>
          {facturesAVenir.slice(0, 2).map(f => (
            <p key={f.id} className="text-[9px]" style={textSecondary}>
              {f.nom} • J-{f.jourDuMois ? f.jourDuMois - currentDay : '?'}
            </p>
          ))}
        </div>
      )}
      
      {nextPayday && (
        <div 
          className="backdrop-blur-sm rounded-xl p-3 shadow-sm border bg-green-500/10 transition-transform hover:scale-[1.02]" 
          style={{ borderColor: '#4ade8050' }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-green-400" />
            <span className="text-[10px] font-semibold text-green-400">Prochain revenu</span>
          </div>
          <p className="text-[9px]" style={textSecondary}>{nextPayday.nom}</p>
          <p className="text-xs font-bold text-green-400">
            J-{nextPayday.jours} • +{nextPayday.montant.toFixed(0)}{devise}
          </p>
        </div>
      )}
    </div>
  );
}