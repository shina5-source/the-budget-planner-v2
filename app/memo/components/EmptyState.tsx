'use client';

import { FileText, Plus } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface EmptyStateProps {
  monthLabel: string;
  onAddClick: () => void;
}

export default function EmptyState({ monthLabel, onAddClick }: EmptyStateProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  return (
    <div className="py-8 flex flex-col items-center justify-center">
      <div 
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: `${theme.colors.primary}15` }}
      >
        <FileText className="w-8 h-8" style={{ color: theme.colors.primary }} />
      </div>
      
      <p 
        className="text-sm font-medium mb-1"
        style={{ color: theme.colors.textPrimary }}
      >
        Aucun mémo pour {monthLabel}
      </p>
      
      <p 
        className="text-xs mb-4 text-center max-w-[200px]"
        style={{ color: theme.colors.textSecondary }}
      >
        Ajoutez vos rappels et dépenses prévues
      </p>

      <button
        onClick={onAddClick}
        className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-105 active:scale-95"
        style={{ 
          background: theme.colors.primary, 
          color: theme.colors.textOnPrimary 
        }}
      >
        <Plus className="w-4 h-4" />
        Ajouter un mémo
      </button>
    </div>
  );
}