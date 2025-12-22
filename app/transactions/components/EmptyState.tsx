"use client";

import { Receipt, Plus, Sparkles } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface EmptyStateProps {
  onAddNew: () => void;
}

export default function EmptyState({ onAddNew }: EmptyStateProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };

  const tips = ['💰 Revenus', '🧾 Factures', '🛒 Dépenses', '🐷 Épargne'];

  return (
    <>
      <style jsx global>{`
        @keyframes pulse-glow-trans {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4);
          }
          50% { 
            transform: scale(1.05); 
            box-shadow: 0 0 20px 10px rgba(139, 92, 246, 0.2);
          }
        }
        @keyframes icon-float-trans {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes sparkle-rotate-trans {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(10deg) scale(1.1); }
          50% { transform: rotate(0deg) scale(1); }
          75% { transform: rotate(-10deg) scale(1.1); }
        }
        @keyframes button-pulse-trans {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          }
          50% { 
            transform: scale(1.03);
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
          }
        }
        @keyframes button-shine-trans {
          0% { transform: translateX(-200%); }
          100% { transform: translateX(200%); }
        }
        @keyframes float-circle {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
          50% { transform: translateY(-8px) scale(1.1); opacity: 1; }
        }
        .animate-pulse-glow-trans {
          animation: pulse-glow-trans 2s ease-in-out infinite;
        }
        .animate-icon-float-trans {
          animation: icon-float-trans 3s ease-in-out infinite;
        }
        .animate-sparkle-trans {
          animation: sparkle-rotate-trans 2s ease-in-out infinite;
        }
        .animate-button-pulse-trans {
          animation: button-pulse-trans 2s ease-in-out infinite;
        }
        .button-shine-trans {
          position: relative;
          overflow: hidden;
        }
        .button-shine-trans::after {
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
          animation: button-shine-trans 3s ease-in-out infinite;
        }
        .animate-float-circle {
          animation: float-circle 3s ease-in-out infinite;
        }
      `}</style>

      <div className="py-12 flex flex-col items-center justify-center animate-fadeIn">
        {/* Illustration animée avec pulse-glow */}
        <div className="relative mb-6">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center animate-pulse-glow-trans"
            style={{ background: theme.colors.primary + '15' }}
          >
            <Receipt className="w-12 h-12 animate-icon-float-trans" style={{ color: theme.colors.primary }} />
          </div>
          
          {/* Badge Sparkles */}
          <div 
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center border-2 animate-sparkle-trans"
            style={{ background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }}
          >
            <Sparkles className="w-4 h-4" style={{ color: theme.colors.primary }} />
          </div>
          
          {/* Cercles décoratifs animés améliorés */}
          <div 
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full animate-float-circle"
            style={{ background: theme.colors.primary + '30', animationDelay: '0ms' }}
          />
          <div 
            className="absolute -bottom-1 -left-3 w-4 h-4 rounded-full animate-float-circle"
            style={{ background: theme.colors.primary + '20', animationDelay: '500ms' }}
          />
          <div 
            className="absolute top-1/2 -right-4 w-3 h-3 rounded-full animate-float-circle"
            style={{ background: theme.colors.primary + '25', animationDelay: '1000ms' }}
          />
        </div>

        {/* Texte */}
        <h4 className="text-base font-semibold mb-2" style={textPrimary}>
          Aucune transaction
        </h4>
        <p className="text-xs text-center max-w-[220px] mb-6 leading-relaxed" style={textSecondary}>
          Commencez à suivre vos finances en ajoutant votre première transaction
        </p>

        {/* Bouton CTA avec animation pulse + shine */}
        <button 
          onClick={onAddNew}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg animate-button-pulse-trans button-shine-trans"
          style={{ 
            background: theme.colors.primary,
            color: theme.colors.textOnPrimary,
            boxShadow: `0 4px 20px ${theme.colors.primary}50`
          }}
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter une transaction</span>
        </button>

        {/* Tags types avec animation staggered */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {tips.map((tip, index) => (
            <span 
              key={tip}
              className="px-3 py-1.5 rounded-full text-[10px] font-medium animate-fadeIn transition-all duration-300 hover:scale-110 cursor-default"
              style={{ 
                background: theme.colors.cardBackgroundLight,
                color: theme.colors.textSecondary,
                animationDelay: `${(index + 1) * 150}ms`
              }}
            >
              {tip}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}