'use client';

import { PiggyBank, Plus, Sparkles } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface EmptyStateProps {
  message?: string;
  subMessage?: string;
  onAddClick?: () => void;
  showAddButton?: boolean;
}

export default function EmptyState({ 
  message = "Aucune épargne ce mois",
  subMessage = "Commencez à épargner pour voir vos statistiques",
  onAddClick,
  showAddButton = true
}: EmptyStateProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  return (
    <>
      <style jsx global>{`
        @keyframes pulse-glow-epargne {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4);
          }
          50% { 
            transform: scale(1.05); 
            box-shadow: 0 0 20px 10px rgba(139, 92, 246, 0.2);
          }
        }
        @keyframes piggy-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(-2deg); }
          50% { transform: translateY(-5px) rotate(0deg); }
          75% { transform: translateY(-3px) rotate(2deg); }
        }
        @keyframes sparkle-rotate-epargne {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(10deg) scale(1.1); }
          50% { transform: rotate(0deg) scale(1); }
          75% { transform: rotate(-10deg) scale(1.1); }
        }
        @keyframes button-pulse-epargne {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          }
          50% { 
            transform: scale(1.03);
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
          }
        }
        @keyframes button-shine-epargne {
          0% { transform: translateX(-200%); }
          100% { transform: translateX(200%); }
        }
        .animate-pulse-glow-epargne {
          animation: pulse-glow-epargne 2s ease-in-out infinite;
        }
        .animate-piggy-float {
          animation: piggy-float 3s ease-in-out infinite;
        }
        .animate-sparkle-epargne {
          animation: sparkle-rotate-epargne 2s ease-in-out infinite;
        }
        .animate-button-pulse-epargne {
          animation: button-pulse-epargne 2s ease-in-out infinite;
        }
        .button-shine-epargne {
          position: relative;
          overflow: hidden;
        }
        .button-shine-epargne::after {
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
          animation: button-shine-epargne 3s ease-in-out infinite;
        }
      `}</style>

      <div 
        className="backdrop-blur-sm rounded-2xl p-8 shadow-sm border text-center animate-fadeIn"
        style={{ background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }}
      >
        {/* Icône avec animation pulse-glow */}
        <div className="relative inline-block mb-4">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse-glow-epargne"
            style={{ background: `${theme.colors.primary}15` }}
          >
            <PiggyBank className="w-8 h-8 animate-piggy-float" style={{ color: theme.colors.primary }} />
          </div>
          {/* Badge Sparkles */}
          <div 
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 animate-sparkle-epargne"
            style={{ background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: theme.colors.primary }} />
          </div>
        </div>

        <p className="text-sm font-medium mb-1" style={{ color: theme.colors.textPrimary }}>
          {message}
        </p>
        <p className="text-xs mb-4" style={{ color: theme.colors.textSecondary }}>
          {subMessage}
        </p>

        {/* Bouton avec animation pulse + shine */}
        {showAddButton && onAddClick && (
          <button
            onClick={onAddClick}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 animate-button-pulse-epargne button-shine-epargne"
            style={{ 
              background: theme.colors.primary, 
              color: theme.colors.textOnPrimary,
              boxShadow: `0 4px 20px ${theme.colors.primary}50`
            }}
          >
            <Plus className="w-5 h-5" />
            Ajouter une épargne
          </button>
        )}

        {/* Types d'épargnes suggérés */}
        <div 
          className="mt-6 p-4 rounded-xl text-left"
          style={{ background: `${theme.colors.primary}10` }}
        >
          <p className="text-xs font-medium mb-2 flex items-center gap-2" style={{ color: theme.colors.primary }}>
            💡 Types d'épargnes à suivre :
          </p>
          <ul className="text-xs space-y-1" style={{ color: theme.colors.textSecondary }}>
            <li className="transition-transform duration-200 hover:translate-x-1">• Livret A / LEP / LDDS</li>
            <li className="transition-transform duration-200 hover:translate-x-1">• Épargne vacances</li>
            <li className="transition-transform duration-200 hover:translate-x-1">• Épargne projets</li>
            <li className="transition-transform duration-200 hover:translate-x-1">• Fonds d'urgence</li>
            <li className="transition-transform duration-200 hover:translate-x-1">• Épargne retraite</li>
          </ul>
        </div>
      </div>
    </>
  );
}