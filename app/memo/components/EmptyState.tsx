'use client';

import { FileText, Plus, Sparkles } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface EmptyStateProps {
  monthLabel: string;
  onAddClick: () => void;
}

export default function EmptyState({ monthLabel, onAddClick }: EmptyStateProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  return (
    <>
      <style jsx global>{`
        @keyframes pulse-glow-memo {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4);
          }
          50% { 
            transform: scale(1.05); 
            box-shadow: 0 0 20px 10px rgba(139, 92, 246, 0.2);
          }
        }
        @keyframes file-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes sparkle-rotate-memo {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(10deg) scale(1.1); }
          50% { transform: rotate(0deg) scale(1); }
          75% { transform: rotate(-10deg) scale(1.1); }
        }
        @keyframes button-pulse-memo {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          }
          50% { 
            transform: scale(1.03);
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
          }
        }
        @keyframes button-shine-memo {
          0% { transform: translateX(-200%); }
          100% { transform: translateX(200%); }
        }
        .animate-pulse-glow-memo {
          animation: pulse-glow-memo 2s ease-in-out infinite;
        }
        .animate-file-float {
          animation: file-float 3s ease-in-out infinite;
        }
        .animate-sparkle-memo {
          animation: sparkle-rotate-memo 2s ease-in-out infinite;
        }
        .animate-button-pulse-memo {
          animation: button-pulse-memo 2s ease-in-out infinite;
        }
        .button-shine-memo {
          position: relative;
          overflow: hidden;
        }
        .button-shine-memo::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          animation: button-shine-memo 3s ease-in-out infinite;
        }
      `}</style>

      <div className="py-8 flex flex-col items-center justify-center animate-fadeIn">
        {/* Icône avec animation pulse-glow */}
        <div className="relative inline-block mb-4">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse-glow-memo"
            style={{ background: `${theme.colors.primary}15` }}
          >
            <FileText className="w-8 h-8 animate-file-float" style={{ color: theme.colors.primary }} />
          </div>
          {/* Badge Sparkles */}
          <div 
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 animate-sparkle-memo"
            style={{ background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: theme.colors.primary }} />
          </div>
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

        {/* Bouton avec animation pulse + shine */}
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95 animate-button-pulse-memo button-shine-memo"
          style={{ 
            background: theme.colors.primary, 
            color: theme.colors.textOnPrimary,
            boxShadow: `0 4px 20px ${theme.colors.primary}50`
          }}
        >
          <Plus className="w-5 h-5" />
          Ajouter un mémo
        </button>
      </div>
    </>
  );
}