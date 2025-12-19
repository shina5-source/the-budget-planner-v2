"use client";

import { Plus, RefreshCw } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface ActionButtonsProps {
  onNewTransaction: () => void;
  onOpenRecurring: () => void;
}

export default function ActionButtons({ 
  onNewTransaction, 
  onOpenRecurring 
}: ActionButtonsProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  return (
    <div className="flex gap-3 mb-4 animate-fadeIn" style={{ animationDelay: '250ms' }}>
      {/* Bouton Nouvelle transaction avec glow amélioré */}
      <button 
        onClick={onNewTransaction} 
        className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] relative overflow-hidden group"
        style={{ 
          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryLight || theme.colors.primary})`,
          color: theme.colors.textOnPrimary,
          boxShadow: `0 4px 15px ${theme.colors.primary}50, 0 8px 30px ${theme.colors.primary}30`
        }}
      >
        {/* Effet de brillance au hover */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        
        <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
        <span>Nouvelle transaction</span>
      </button>
      
      {/* Bouton Récurrentes */}
      <button 
        onClick={onOpenRecurring} 
        className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] relative overflow-hidden group"
        style={{ 
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(168, 85, 247, 0.9))',
          color: '#FFFFFF',
          boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4), 0 8px 30px rgba(139, 92, 246, 0.2)'
        }}
      >
        {/* Effet de brillance au hover */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        
        <RefreshCw className="w-4 h-4 transition-transform duration-500 group-hover:rotate-180" />
        <span>Récurrentes</span>
      </button>
    </div>
  );
}
