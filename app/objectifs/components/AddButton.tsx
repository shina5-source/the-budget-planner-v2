"use client";

import { Plus } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface AddButtonProps {
  onClick: () => void;
}

export default function AddButton({ onClick }: AddButtonProps) {
  const { theme } = useTheme();

  return (
    <button 
      onClick={onClick} 
      className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg animate-fadeIn"
      style={{ 
        background: theme.colors.primary, 
        color: theme.colors.textOnPrimary,
        boxShadow: `0 4px 15px ${theme.colors.primary}40`,
        animationDelay: '250ms'
      }}
    >
      <Plus className="w-4 h-4" />
      Nouvel objectif
    </button>
  );
}