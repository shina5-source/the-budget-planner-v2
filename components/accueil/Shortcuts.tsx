'use client';

import { PieChart, Target, Mail, TrendingUp } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface ShortcutsProps {
  onNavigate: (page: string) => void;
}

export default function Shortcuts({ onNavigate }: ShortcutsProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };

  const shortcuts = [
    { page: 'budget', title: 'Budget', icon: PieChart },
    { page: 'objectifs', title: 'Objectifs', icon: Target },
    { page: 'enveloppes', title: 'Enveloppes', icon: Mail },
    { page: 'statistiques', title: 'Stats', icon: TrendingUp },
  ];

  return (
    <div 
      className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border animate-fade-in-up opacity-0" 
      style={{ ...cardStyle, animationDelay: '0.45s', animationFillMode: 'forwards' }}
    >
      <div className="grid grid-cols-4 gap-2">
        {shortcuts.map((item, idx) => (
          <button 
            key={idx} 
            onClick={() => onNavigate(item.page)} 
            className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all hover:scale-110 active:scale-95"
          >
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors" 
              style={{ background: `${theme.colors.primary}20` }}
            >
              <item.icon className="w-5 h-5" style={textPrimary} />
            </div>
            <span className="text-[9px] font-medium" style={textSecondary}>{item.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}