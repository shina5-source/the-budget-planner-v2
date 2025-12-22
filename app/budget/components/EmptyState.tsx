'use client';

import { Sparkles, Wallet, Plus } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface EmptyStateProps {
  message: string;
  icon?: string;
  title?: string;
  onAddTransaction?: () => void;
}

export function EmptyState({ 
  message, 
  icon = '📊', 
  title = 'Aucune donnée',
  onAddTransaction 
}: EmptyStateProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  
  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };

  return (
    <>
      <style jsx global>{`
        @keyframes pulse-glow-budget {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4);
          }
          50% { 
            transform: scale(1.05); 
            box-shadow: 0 0 20px 10px rgba(139, 92, 246, 0.2);
          }
        }
        @keyframes icon-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes sparkle-rotate-budget {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(10deg) scale(1.1); }
          50% { transform: rotate(0deg) scale(1); }
          75% { transform: rotate(-10deg) scale(1.1); }
        }
        @keyframes button-pulse-budget {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          }
          50% { 
            transform: scale(1.03);
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
          }
        }
        @keyframes button-shine-budget {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-pulse-glow-budget {
          animation: pulse-glow-budget 2s ease-in-out infinite;
        }
        .animate-icon-float {
          animation: icon-float 3s ease-in-out infinite;
          display: inline-block;
        }
        .animate-sparkle-budget {
          animation: sparkle-rotate-budget 2s ease-in-out infinite;
        }
        .animate-button-pulse-budget {
          animation: button-pulse-budget 2s ease-in-out infinite;
        }
        .button-shine-budget {
          position: relative;
          overflow: hidden;
        }
        .button-shine-budget::after {
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
          background-size: 200% 100%;
          animation: button-shine-budget 3s ease-in-out infinite;
        }
      `}</style>

      <div className="backdrop-blur-sm rounded-2xl p-8 shadow-sm border text-center animate-fade-in-up" style={cardStyle}>
        {/* Icône avec animation pulse-glow */}
        <div className="relative inline-block mb-4">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center animate-pulse-glow-budget" 
            style={{ background: `${theme.colors.primary}15` }}
          >
            <span className="text-4xl animate-icon-float">{icon}</span>
          </div>
          {/* Badge Sparkles avec animation */}
          <div 
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center border-2 animate-sparkle-budget" 
            style={{ background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }}
          >
            <Sparkles className="w-4 h-4" style={{ color: theme.colors.primary }} />
          </div>
        </div>

        <p className="text-base font-semibold mb-2" style={textPrimary}>{title}</p>
        <p className="text-sm mb-4" style={textSecondary}>{message}</p>
        
        {/* Bouton cliquable avec animation */}
        {onAddTransaction ? (
          <button
            type="button"
            onClick={onAddTransaction}
            className="flex items-center justify-center gap-2 text-xs px-5 py-3 rounded-full mx-auto transition-all hover:scale-105 active:scale-95 cursor-pointer animate-button-pulse-budget button-shine-budget font-semibold"
            style={{ 
              background: theme.colors.primary, 
              color: theme.colors.textOnPrimary || '#ffffff',
              boxShadow: `0 4px 20px ${theme.colors.primary}50`
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une transaction</span>
          </button>
        ) : (
          <div 
            className="flex items-center justify-center gap-2 text-xs px-4 py-2 rounded-full" 
            style={{ background: `${theme.colors.primary}10`, color: theme.colors.primary }}
          >
            <Wallet className="w-4 h-4" />
            <span>Ajoutez des transactions pour commencer</span>
          </div>
        )}
      </div>
    </>
  );
}