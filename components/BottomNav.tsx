"use client";

import { Home, DollarSign, Calendar, Target, MoreHorizontal } from 'lucide-react';
import { useTheme } from '../contexts/theme-context';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'accueil', icon: Home, label: 'Accueil' },
  { id: 'budget', icon: DollarSign, label: 'Budget' },
  { id: 'previsionnel', icon: Calendar, label: 'Prévisionnel' },
  { id: 'objectifs', icon: Target, label: 'Objectifs' },
  { id: 'plus', icon: MoreHorizontal, label: 'Plus' },
];

export default function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const { theme } = useTheme();
  
  // Couleur du texte sur fond secondary (bottomNav)
  const navTextColor = theme.colors.textOnSecondary;

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-[50] border-t"
      style={{ 
        backgroundColor: theme.colors.secondary,
        borderColor: `${navTextColor}30`
      }}
    >
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors"
              style={{ 
                color: isActive ? navTextColor : `${navTextColor}80`
              }}
            >
              <Icon className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}