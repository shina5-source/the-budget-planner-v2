"use client";

import { CreditCard, Plus, Sparkles } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface EmptyStateProps {
  onAddCredit: () => void;
}

export default function EmptyState({ onAddCredit }: EmptyStateProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };
  const textSecondary = { color: theme.colors.textSecondary };

  return (
    <>
      <style jsx global>{`
        @keyframes pulse-glow-credit {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4);
          }
          50% { 
            transform: scale(1.05); 
            box-shadow: 0 0 20px 10px rgba(139, 92, 246, 0.2);
          }
        }
        @keyframes card-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(-2deg); }
          50% { transform: translateY(-5px) rotate(0deg); }
          75% { transform: translateY(-3px) rotate(2deg); }
        }
        @keyframes sparkle-rotate-credit {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(10deg) scale(1.1); }
          50% { transform: rotate(0deg) scale(1); }
          75% { transform: rotate(-10deg) scale(1.1); }
        }
        @keyframes button-pulse-credit {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          }
          50% { 
            transform: scale(1.03);
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
          }
        }
        @keyframes button-shine-credit {
          0% { transform: translateX(-200%); }
          100% { transform: translateX(200%); }
        }
        .animate-pulse-glow-credit {
          animation: pulse-glow-credit 2s ease-in-out infinite;
        }
        .animate-card-float {
          animation: card-float 3s ease-in-out infinite;
        }
        .animate-sparkle-credit {
          animation: sparkle-rotate-credit 2s ease-in-out infinite;
        }
        .animate-button-pulse-credit {
          animation: button-pulse-credit 2s ease-in-out infinite;
        }
        .button-shine-credit {
          position: relative;
          overflow: hidden;
        }
        .button-shine-credit::after {
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
          animation: button-shine-credit 3s ease-in-out infinite;
        }
      `}</style>

      <div 
        className="backdrop-blur-sm rounded-2xl p-6 shadow-sm border text-center mb-4 animate-fadeIn"
        style={{ ...cardStyle, animationDelay: '300ms' }}
      >
        {/* Icône avec animation pulse-glow */}
        <div className="relative inline-block mb-4">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse-glow-credit"
            style={{ background: `${theme.colors.primary}20` }}
          >
            <CreditCard className="w-8 h-8 animate-card-float" style={{ color: theme.colors.primary }} />
          </div>
          {/* Badge Sparkles */}
          <div 
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 animate-sparkle-credit"
            style={{ background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: theme.colors.primary }} />
          </div>
        </div>

        <h3 className="text-sm font-medium mb-2" style={{ color: theme.colors.textPrimary }}>
          Aucun crédit enregistré
        </h3>

        <p className="text-xs mb-4" style={textSecondary}>
          Ajoutez vos crédits et dettes pour suivre<br />
          automatiquement vos remboursements
        </p>

        {/* Bouton avec animation pulse + shine */}
        <button
          onClick={onAddCredit}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg animate-button-pulse-credit button-shine-credit"
          style={{ 
            background: theme.colors.primary,
            color: theme.colors.textOnPrimary,
            boxShadow: `0 4px 20px ${theme.colors.primary}50`
          }}
        >
          <Plus className="w-5 h-5" />
          Ajouter un crédit
        </button>

        <div 
          className="mt-4 p-3 rounded-xl text-left"
          style={{ background: theme.colors.cardBackgroundLight }}
        >
          <p className="text-[10px] font-medium mb-2" style={{ color: theme.colors.textPrimary }}>
            💡 Types de crédits à suivre :
          </p>
          <ul className="text-[10px] space-y-1" style={textSecondary}>
            <li className="transition-transform duration-200 hover:translate-x-1">• Crédit immobilier</li>
            <li className="transition-transform duration-200 hover:translate-x-1">• Crédit auto / moto</li>
            <li className="transition-transform duration-200 hover:translate-x-1">• Crédit à la consommation</li>
            <li className="transition-transform duration-200 hover:translate-x-1">• Prêt étudiant</li>
            <li className="transition-transform duration-200 hover:translate-x-1">• Dettes personnelles</li>
          </ul>
        </div>
      </div>
    </>
  );
}