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

  // Formater le montant (espaces pour les milliers)
  const formatAmount = (value: number) => {
    return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  return (
    <div 
      className="backdrop-blur-sm rounded-2xl p-3 shadow-lg border animate-fade-in-up stagger-2 opacity-0" 
      style={{ 
        background: totals.soldeReel >= 0 
          ? `linear-gradient(135deg, ${theme.colors.cardBackground} 0%, rgba(74, 222, 128, 0.1) 100%)`
          : `linear-gradient(135deg, ${theme.colors.cardBackground} 0%, rgba(248, 113, 113, 0.1) 100%)`,
        borderColor: theme.colors.cardBorder,
        animationFillMode: 'forwards'
      }}
    >
      {/* Ligne 1: Score + Météo + Streak */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="relative">
              <svg width={40} height={40} className="transform -rotate-90">
                <circle cx={20} cy={20} r={16} stroke={`${theme.colors.cardBorder}50`} strokeWidth={3} fill="none" />
                <circle 
                  cx={20} cy={20} r={16} 
                  stroke={getScoreColor(financialData.score)} 
                  strokeWidth={3} fill="none" 
                  strokeDasharray={100} 
                  strokeDashoffset={100 - (animatedScore / 100) * 100} 
                  strokeLinecap="round" 
                  className="transition-all duration-1000 ease-out" 
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Trophy className="w-3.5 h-3.5" style={{ color: getScoreColor(financialData.score) }} />
              </div>
            </div>
            <div>
              <span className={`text-lg font-bold ${financialData.color}`}>{animatedScore}</span>
              <span className="text-[9px]" style={textSecondary}>/100</span>
            </div>
          </div>
          <span 
            className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${financialData.color}`} 
            style={{ background: `${theme.colors.primary}15` }}
          >
            {financialData.emoji} {financialData.label}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {epargneStreak > 0 && (
            <span className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 animate-pulse-slow">
              <Flame className="w-2.5 h-2.5" /> {epargneStreak}
            </span>
          )}
          <div className={`p-1.5 rounded-lg ${weather.bg} transition-transform hover:scale-110`}>
            <WeatherIcon className={`w-4 h-4 ${weather.color}`} />
          </div>
        </div>
      </div>

      {/* Ligne 2: Solde principal */}
      <div className="flex items-end justify-between mb-2">
        <div>
          <p className="text-[10px] mb-0.5" style={textSecondary}>Solde réel</p>
          <p className={`text-xl font-bold ${totals.soldeReel >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totals.soldeReel >= 0 ? '+' : ''}{formatAmount(totals.soldeReel)} <span className="text-sm">{devise}</span>
          </p>
        </div>
        <div className="text-right">
          {prevTotals.prevSolde !== 0 && (
            <VariationBadge current={totals.soldeReel} previous={prevTotals.prevSolde} />
          )}
          <p className="text-[9px] mt-0.5" style={textSecondary}>
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
        <p className="text-[9px] mt-1.5 text-center animate-fade-in" style={textSecondary}>
          {totals.soldeReel > 500 ? '🎉 Excellent ! Pensez à épargner' : 
           totals.soldeReel > 0 ? '👍 Budget maîtrisé' : 
           totals.soldeReel < -500 ? '🚨 Budget dépassé' :
           totals.soldeReel < -50 ? '⚠️ Attention aux dépenses' : null}
        </p>
      )}
    </div>
  );
}
