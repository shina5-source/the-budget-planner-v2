'use client';

import { Target } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { ProgressBar } from '@/components/ui';

interface Objectif {
  id: number;
  nom: string;
  montantCible: number;
  montantActuel: number;
}

interface ObjectifCardProps {
  objectif: Objectif;
  devise: string;
}

export default function ObjectifCard({ objectif, devise }: ObjectifCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };

  const pourcentage = objectif.montantCible > 0 
    ? ((objectif.montantActuel / objectif.montantCible) * 100).toFixed(0) 
    : 0;

  return (
    <div 
      className="backdrop-blur-sm rounded-xl p-3 shadow-sm border transition-transform hover:scale-[1.02]" 
      style={cardStyle}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <div 
            className="w-7 h-7 rounded-lg flex items-center justify-center" 
            style={{ background: `${theme.colors.primary}20` }}
          >
            <Target className="w-3.5 h-3.5" style={{ color: theme.colors.primary }} />
          </div>
          <span className="text-xs font-medium truncate" style={textPrimary}>
            {objectif.nom}
          </span>
        </div>
        <span className="text-xs font-bold" style={{ color: theme.colors.primary }}>
          {pourcentage}%
        </span>
      </div>
      
      <ProgressBar 
        value={objectif.montantActuel} 
        max={objectif.montantCible} 
        color={theme.colors.primary} 
        animated 
      />
      
      <p className="text-[9px] mt-2 text-center" style={textSecondary}>
        {objectif.montantActuel.toFixed(0)} / {objectif.montantCible.toFixed(0)} {devise}
      </p>
    </div>
  );
}