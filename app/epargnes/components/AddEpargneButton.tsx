'use client';

import { Plus } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface AddEpargneButtonProps {
  onClick: () => void;
}

export default function AddEpargneButton({ onClick }: AddEpargneButtonProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  return (
    <button
      onClick={onClick}
      className="p-2.5 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg animate-fadeIn"
      style={{ 
        background: theme.colors.primary,
        boxShadow: `0 4px 14px ${theme.colors.primary}50`
      }}
      title="Ajouter une épargne"
    >
      <Plus className="w-5 h-5" style={{ color: theme.colors.textOnPrimary }} />
    </button>
  );
}