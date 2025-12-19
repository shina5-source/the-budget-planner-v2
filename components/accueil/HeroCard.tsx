'use client';

import { Trophy, Flame, Sun, CloudSun, Cloud, CloudRain } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { ProgressBar, VariationBadge } from '@/components/ui';

interface HeroCardProps {
  totals: {
    totalRevenus: number;
    totalFactures: number;
    totalDepenses: number;
    totalEpargnes: number;
    soldeReel: number;
  };
  prevTotals: {
    prevSolde: number;
  };
  financialData: {
    score: number;
    label: string;
    color: string;
    emoji: string;
  };
  animatedScore: number;
  epargneStreak: number;
  budgetParJour: number;
  joursRestants: number;
  devise: string;
}

export default function HeroCard({
  totals,
  prevTotals,
  financialData,
  animatedScore,
  epargneStreak,
  budgetParJour,
  joursRestants,
  devise
}: HeroCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const textSecondary = { color: theme.colors.textSecondary };

  const getScoreColor = (s: number) => 
    s >= 80 ? '#4CAF50' : s >= 60 ? '#2196F3' : s >= 40 ? '#FF9800' : '#F44336';

  const weather = (() => {
    if (totals.soldeReel > totals.totalRevenus * 0.2) 
      return { icon: Sun, label: 'Ensoleillé', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    if (totals.soldeReel > 0) 
      return { icon: CloudSun, label: 'Nuageux', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    if (totals.soldeReel > -100) 
      return { icon: Cloud, label: 'Couvert', color: 'text-gray-400', bg: 'bg-gray-500/20' };
    return { icon: CloudRain, label: 'Orageux', color: 'text-red-400', bg: 'bg-red-500/20' };
  })();

  const WeatherIcon = weather.icon;

  return (
    <div 
      className="backdrop-blur-sm rounded-2xl p-4 shadow-lg border animate-fade-in-up stagger-2 opacity-0" 
      style={{ 
        background: totals.soldeReel >= 0 
          ? `linear-gradient(135deg, ${theme.colors.cardBackground} 0%, rgba(74, 222, 128, 0.1) 100%)`
          : `linear-gradient(135deg, ${theme.colors.cardBackground} 0%, rgba(248, 113, 113, 0.1) 100%)`,
        borderColor: theme.colors.cardBorder,
        animationFillMode: 'forwards'
      }}
    >
      {/* Ligne 1: Score + Météo + Streak */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <svg width={50} height={50} className="transform -rotate-90">
                <circle cx={25} cy={25} r={20} stroke={`${theme.colors.cardBorder}50`} strokeWidth={4} fill="none" />
                <circle 
                  cx={25} cy={25} r={20} 
                  stroke={getScoreColor(financialData.score)} 
                  strokeWidth={4} fill="none" 
                  strokeDasharray={126} 
                  strokeDashoffset={126 - (animatedScore / 100) * 126} 
                  strokeLinecap="round" 
                  className="transition-all duration-1000 ease-out" 
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Trophy className="w-4 h-4" style={{ color: getScoreColor(financialData.score) }} />
              </div>
            </div>
            <div>
              <span className={`text-xl font-bold ${financialData.color}`}>{animatedScore}</span>
              <span className="text-[10px]" style={textSecondary}>/100</span>
            </div>
          </div>
          <span 
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${financialData.color}`} 
            style={{ background: `${theme.colors.primary}15` }}
          >
            {financialData.emoji} {financialData.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {epargneStreak > 0 && (
            <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-orange-500/20 text-orange-400 animate-pulse-slow">
              <Flame className="w-3 h-3" /> {epargneStreak}
            </span>
          )}
          <div className={`p-2 rounded-lg ${weather.bg} transition-transform hover:scale-110`}>
            <WeatherIcon className={`w-5 h-5 ${weather.color}`} />
          </div>
        </div>
      </div>

      {/* Ligne 2: Solde principal */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-xs mb-1" style={textSecondary}>Solde réel</p>
          <p className={`text-3xl font-bold ${totals.soldeReel >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totals.soldeReel >= 0 ? '+' : ''}{totals.soldeReel.toFixed(0)} <span className="text-lg">{devise}</span>
          </p>
        </div>
        <div className="text-right">
          {prevTotals.prevSolde !== 0 && (
            <VariationBadge current={totals.soldeReel} previous={prevTotals.prevSolde} />
          )}
          <p className="text-[10px] mt-1" style={textSecondary}>
            {budgetParJour.toFixed(0)}{devise}/jour • {joursRestants}j
          </p>
        </div>
      </div>

      {/* Ligne 3: Progress bar */}
      <ProgressBar 
        value={totals.totalRevenus - totals.totalFactures - totals.totalDepenses - totals.totalEpargnes} 
        max={totals.totalRevenus || 1} 
        color={totals.soldeReel >= 0 ? '#4ade80' : '#f87171'}
        animated
      />

      {/* Message motivationnel */}
      {(totals.soldeReel > 500 || totals.soldeReel < -50) && (
        <p className="text-[10px] mt-2 text-center animate-fade-in" style={textSecondary}>
          {totals.soldeReel > 500 ? '🎉 Excellent ! Pensez à épargner' : 
           totals.soldeReel > 0 ? '👍 Budget maîtrisé' : 
           totals.soldeReel < -500 ? '🚨 Budget dépassé' :
           totals.soldeReel < -50 ? '⚠️ Attention aux dépenses' : null}
        </p>
      )}
    </div>
  );
}