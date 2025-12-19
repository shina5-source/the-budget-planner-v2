'use client';

import { TrendingUp, Home as HomeIcon, ShoppingBag, PiggyBank } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { VariationBadge } from '@/components/ui';

interface SummaryCardsProps {
  totals: {
    totalRevenus: number;
    totalFactures: number;
    totalDepenses: number;
    totalEpargnes: number;
  };
  prevTotals: {
    prevRevenus: number;
    prevFactures: number;
    prevDepenses: number;
    prevEpargnes: number;
  };
  devise: string;
}

export default function SummaryCards({ totals, prevTotals, devise }: SummaryCardsProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const textSecondary = { color: theme.colors.textSecondary };
  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };

  const items = [
    { label: 'Revenus', amount: totals.totalRevenus, prev: prevTotals.prevRevenus, color: '#4CAF50', icon: TrendingUp, inverse: false },
    { label: 'Factures', amount: totals.totalFactures, prev: prevTotals.prevFactures, color: '#F44336', icon: HomeIcon, inverse: true },
    { label: 'Dépenses', amount: totals.totalDepenses, prev: prevTotals.prevDepenses, color: '#FF9800', icon: ShoppingBag, inverse: true },
    { label: 'Épargne', amount: totals.totalEpargnes, prev: prevTotals.prevEpargnes, color: '#9C27B0', icon: PiggyBank, inverse: false },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 animate-fade-in-up stagger-6 opacity-0" style={{ animationFillMode: 'forwards' }}>
      {items.map((item, i) => (
        <div 
          key={i} 
          className="backdrop-blur-sm rounded-xl p-3 shadow-sm border text-center transition-all hover:scale-105" 
          style={cardStyle}
        >
          <div 
            className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center" 
            style={{ background: `${item.color}20` }}
          >
            <item.icon className="w-4 h-4" style={{ color: item.color }} />
          </div>
          <p className="text-base font-bold" style={{ color: item.color }}>
            {item.amount.toFixed(0)}{devise}
          </p>
          <p className="text-[9px] mb-1" style={textSecondary}>{item.label}</p>
          {item.prev > 0 && (
            <VariationBadge current={item.amount} previous={item.prev} inverse={item.inverse} />
          )}
        </div>
      ))}
    </div>
  );
}