"use client";

import { Target } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface EmptyStateProps {
  activeFilter: 'tous' | 'court' | 'long';
}

export default function EmptyState({ activeFilter }: EmptyStateProps) {
  const { theme } = useTheme();

  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };
  const textSecondary = { color: theme.colors.textSecondary };

  const getMessage = () => {
    if (activeFilter === 'tous') return 'Aucun objectif';
    if (activeFilter === 'court') return 'Aucun objectif court terme';
    return 'Aucun objectif long terme';
  };

  return (
    <div 
      className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border text-center py-8 mb-4 animate-fadeIn"
      style={{ ...cardStyle, animationDelay: '300ms' }}
    >
      {/* Cercles décoratifs animés */}
      <div className="relative w-20 h-20 mx-auto mb-4">
        <div 
          className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{ background: theme.colors.primary }}
        />
        <div 
          className="absolute inset-2 rounded-full animate-pulse opacity-30"
          style={{ background: theme.colors.primary }}
        />
        <div 
          className="absolute inset-0 w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: `${theme.colors.primary}20` }}
        >
          <Target className="w-10 h-10" style={{ color: theme.colors.primary }} />
        </div>
      </div>
      
      <p className="text-sm font-medium mb-1" style={{ color: theme.colors.textPrimary }}>
        {getMessage()}
      </p>
      <p className="text-xs" style={textSecondary}>
        Créez votre premier objectif pour commencer à épargner
      </p>
    </div>
  );
}