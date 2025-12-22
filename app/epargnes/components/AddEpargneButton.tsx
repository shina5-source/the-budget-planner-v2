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
    <>
      <style jsx global>{`
        @keyframes add-button-pulse {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
          }
          50% { 
            transform: scale(1.08);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
          }
        }
        @keyframes add-button-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4); }
          50% { box-shadow: 0 0 15px 5px rgba(139, 92, 246, 0.3); }
        }
        .animate-add-button {
          animation: add-button-pulse 2s ease-in-out infinite, add-button-glow 2s ease-in-out infinite;
        }
      `}</style>

      <button
        onClick={onClick}
        className="p-2.5 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg animate-fadeIn animate-add-button"
        style={{ 
          background: theme.colors.primary,
          boxShadow: `0 4px 20px ${theme.colors.primary}50`
        }}
        title="Ajouter une épargne"
      >
        <Plus className="w-5 h-5" style={{ color: theme.colors.textOnPrimary }} />
      </button>
    </>
  );
}