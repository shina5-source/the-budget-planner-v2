'use client';

import { Wallet, Sparkles, Plus } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface EmptyStateProps {
  userName: string;
  onNavigate: (page: string) => void;
}

export default function EmptyState({ userName, onNavigate }: EmptyStateProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };

  return (
    <>
      <style jsx global>{`
        @keyframes pulse-glow {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4);
          }
          50% { 
            transform: scale(1.05); 
            box-shadow: 0 0 20px 10px rgba(139, 92, 246, 0.2);
          }
        }
        @keyframes sparkle-rotate {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(10deg) scale(1.1); }
          50% { transform: rotate(0deg) scale(1); }
          75% { transform: rotate(-10deg) scale(1.1); }
        }
        @keyframes wallet-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes button-pulse {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          }
          50% { 
            transform: scale(1.03);
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
          }
        }
        @keyframes button-shine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .animate-sparkle {
          animation: sparkle-rotate 2s ease-in-out infinite;
        }
        .animate-wallet-float {
          animation: wallet-float 3s ease-in-out infinite;
        }
        .animate-button-pulse {
          animation: button-pulse 2s ease-in-out infinite;
        }
        .button-shine {
          position: relative;
          overflow: hidden;
        }
        .button-shine::after {
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
          animation: button-shine 3s ease-in-out infinite;
        }
      `}</style>

      <div 
        className="backdrop-blur-sm rounded-2xl p-6 shadow-sm border text-center animate-fade-in-up" 
        style={cardStyle}
      >
        {/* Icône portefeuille avec animation */}
        <div className="relative inline-block mb-4">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center animate-pulse-glow" 
            style={{ background: `${theme.colors.primary}15` }}
          >
            <Wallet 
              className="w-10 h-10 animate-wallet-float" 
              style={{ color: theme.colors.primary }} 
            />
          </div>
          {/* Badge Sparkles avec animation */}
          <div 
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center border-2 animate-sparkle" 
            style={{ background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }}
          >
            <Sparkles className="w-4 h-4" style={{ color: theme.colors.primary }} />
          </div>
        </div>
        
        <p className="text-base font-semibold mb-2" style={textPrimary}>
          Bienvenue {userName} !
        </p>
        <p className="text-sm mb-4" style={textSecondary}>
          Commencez par ajouter vos premières transactions
        </p>
        
        {/* Bouton avec animation pulse + shine */}
        <button 
          onClick={() => onNavigate('transactions')} 
          className="flex items-center justify-center gap-2 mx-auto px-5 py-3 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 animate-button-pulse button-shine"
          style={{ 
            background: theme.colors.primary, 
            color: theme.colors.textOnPrimary,
            boxShadow: `0 4px 20px ${theme.colors.primary}50`
          }}
        >
          <Plus className="w-5 h-5" />
          Ajouter une transaction
        </button>
      </div>
    </>
  );
}