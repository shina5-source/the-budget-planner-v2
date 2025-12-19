"use client";

import { useTheme } from '@/contexts/theme-context';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface SummaryCardsProps {
  totalRevenus: number;
  totalDepenses: number;
  solde: number;
  devise: string;
}

export default function SummaryCards({ 
  totalRevenus, 
  totalDepenses, 
  solde, 
  devise 
}: SummaryCardsProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };
  const textSecondary = { color: theme.colors.textSecondary };

  const cards = [
    {
      label: 'Revenus',
      value: totalRevenus,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      icon: TrendingUp,
      prefix: '+'
    },
    {
      label: 'Dépenses',
      value: totalDepenses,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      icon: TrendingDown,
      prefix: '-'
    },
    {
      label: 'Solde',
      value: solde,
      color: solde >= 0 ? 'text-green-400' : 'text-red-400',
      bgColor: solde >= 0 ? 'bg-green-500/10' : 'bg-red-500/10',
      icon: Wallet,
      prefix: solde >= 0 ? '+' : ''
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      {cards.map((card, index) => (
        <div 
          key={card.label}
          className="backdrop-blur-sm rounded-2xl text-center p-3 border transition-all duration-300 hover:scale-[1.02] animate-fadeIn"
          style={{ 
            ...cardStyle,
            animationDelay: `${index * 100}ms`
          }}
        >
          <div className={`w-8 h-8 ${card.bgColor} rounded-full flex items-center justify-center mx-auto mb-2`}>
            <card.icon className={`w-4 h-4 ${card.color}`} />
          </div>
          <p className="text-[10px] mb-1" style={textSecondary}>
            {card.label}
          </p>
          <p className={`text-sm font-bold ${card.color} tabular-nums`}>
            {card.label !== 'Solde' ? card.prefix : (card.value >= 0 ? '+' : '')}
            {Math.abs(card.value).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            {devise}
          </p>
        </div>
      ))}
    </div>
  );
}