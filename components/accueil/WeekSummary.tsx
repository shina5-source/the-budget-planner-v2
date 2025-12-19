'use client';

import { Zap } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { VariationBadge } from '@/components/ui';

interface WeekSummaryProps {
  weekData: {
    thisWeekTotal: number;
    lastWeekTotal: number;
    thisWeekCount: number;
  };
  depensesAujourdhui: number;
  devise: string;
}

export default function WeekSummary({ weekData, depensesAujourdhui, devise }: WeekSummaryProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };

  const isJourSansDepense = depensesAujourdhui === 0;

  return (
    <div className="grid grid-cols-2 gap-2 animate-fade-in-up stagger-5 opacity-0" style={{ animationFillMode: 'forwards' }}>
      <div className="backdrop-blur-sm rounded-xl p-3 shadow-sm border transition-transform hover:scale-[1.02]" style={cardStyle}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-medium" style={textSecondary}>Cette semaine</span>
          {weekData.lastWeekTotal > 0 && (
            <VariationBadge current={weekData.thisWeekTotal} previous={weekData.lastWeekTotal} inverse />
          )}
        </div>
        <p className={`text-lg font-bold ${weekData.thisWeekTotal > weekData.lastWeekTotal ? 'text-red-400' : 'text-green-400'}`}>
          -{weekData.thisWeekTotal.toFixed(0)}{devise}
        </p>
        <p className="text-[9px]" style={textSecondary}>{weekData.thisWeekCount} transaction(s)</p>
      </div>
      
      <div 
        className="backdrop-blur-sm rounded-xl p-3 shadow-sm border transition-transform hover:scale-[1.02]" 
        style={{ 
          ...cardStyle, 
          background: isJourSansDepense ? 'rgba(74, 222, 128, 0.1)' : cardStyle.background 
        }}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <Zap className={`w-3.5 h-3.5 ${isJourSansDepense ? 'text-green-400' : 'text-orange-400'}`} />
          <span className="text-[10px] font-medium" style={textSecondary}>Défi du jour</span>
        </div>
        {isJourSansDepense ? (
          <p className="text-sm font-bold text-green-400">🎯 0€ dépensé !</p>
        ) : (
          <p className="text-sm font-bold" style={textPrimary}>{depensesAujourdhui.toFixed(0)}{devise}</p>
        )}
      </div>
    </div>
  );
}