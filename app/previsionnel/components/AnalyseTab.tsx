"use client";

import { useTheme } from '@/contexts/theme-context';

interface AnalyseCategory {
  label: string;
  prevu: number;
  reel: number;
}

interface AnalyseTabProps {
  categories: AnalyseCategory[];
  totalBudgetPrevu: number;
  totalDepenseReel: number;
  soldeReel: number;
  devise?: string;
}

export default function AnalyseTab({
  categories,
  totalBudgetPrevu,
  totalDepenseReel,
  soldeReel,
  devise = '€'
}: AnalyseTabProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };

  return (
    <div className="space-y-4 animate-fadeIn" style={{ animationDelay: '150ms' }}>
      {/* Analyse comparative */}
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={textPrimary}>
          <span>📊</span> Analyse comparative
        </h3>
        
        <div className="space-y-4">
          {categories.map((cat, index) => {
            const ecart = cat.reel - cat.prevu;
            const pourcentage = cat.prevu > 0 ? ((cat.reel / cat.prevu) * 100).toFixed(0) : 0;
            
            return (
              <div 
                key={cat.label} 
                className="space-y-2 animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium" style={textPrimary}>{cat.label}</span>
                  <span className={`text-[10px] font-semibold ${ecart >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {pourcentage}% ({ecart >= 0 ? '+' : ''}{ecart.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {devise})
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="flex gap-2 items-center">
                  <div 
                    className="flex-1 rounded-full h-3 overflow-hidden"
                    style={{ background: theme.colors.cardBackgroundLight }}
                  >
                    <div 
                      className="h-3 rounded-full transition-all duration-700 ease-out"
                      style={{ 
                        width: `${Math.min(Number(pourcentage), 100)}%`, 
                        background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primaryLight || theme.colors.primary})` 
                      }} 
                    />
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-[10px]" style={textSecondary}>
                    Prévu: {cat.prevu.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {devise}
                  </span>
                  <span className="text-[10px]" style={textSecondary}>
                    Réel: {cat.reel.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {devise}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bilan du mois */}
      <div 
        className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border text-center animate-fadeIn"
        style={{ ...cardStyle, animationDelay: '400ms' }}
      >
        <p className="text-xs mb-3" style={textSecondary}>Bilan du mois</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-[10px] mb-1" style={textSecondary}>Budget total prévu</p>
            <p className="text-lg font-bold tabular-nums" style={textPrimary}>
              {totalBudgetPrevu.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {devise}
            </p>
          </div>
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-[10px] mb-1" style={textSecondary}>Dépensé réel</p>
            <p className="text-lg font-bold tabular-nums" style={textPrimary}>
              {totalDepenseReel.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {devise}
            </p>
          </div>
        </div>
        
        <div 
          className="pt-4"
          style={{ borderTopWidth: 1, borderColor: theme.colors.cardBorder }}
        >
          <p className="text-[10px] mb-1" style={textSecondary}>Reste disponible</p>
          <p className={`text-3xl font-bold tabular-nums ${soldeReel >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {soldeReel >= 0 ? '+' : ''}{soldeReel.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {devise}
          </p>
        </div>
      </div>
    </div>
  );
}