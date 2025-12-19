'use client';

import { Sparkles } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface DailyInsightProps {
  citation: {
    text: string;
    author: string;
  };
  funFact: string;
  appAge: {
    days: number;
    months: number;
  };
}

export default function DailyInsight({ citation, funFact, appAge }: DailyInsightProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };

  return (
    <div 
      className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border text-center animate-fade-in-up stagger-8 opacity-0" 
      style={{ 
        ...cardStyle, 
        background: `${theme.colors.primary}08`, 
        animationFillMode: 'forwards' 
      }}
    >
      <div className="flex items-center justify-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 animate-pulse-slow" style={{ color: theme.colors.primary }} />
        <span className="text-xs font-semibold" style={textPrimary}>Du jour</span>
        {appAge.days >= 7 && (
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400">
            🎂 {appAge.months > 0 ? `${appAge.months} mois` : `${appAge.days}j`}
          </span>
        )}
      </div>
      
      <div className="space-y-2">
        <p className="text-[11px] italic" style={textSecondary}>
          &ldquo;{citation.text}&rdquo;
        </p>
        <p className="text-[10px]" style={textSecondary}>— {citation.author}</p>
        <p className="text-[10px] pt-1 font-medium" style={textPrimary}>📊 {funFact}</p>
      </div>
    </div>
  );
}