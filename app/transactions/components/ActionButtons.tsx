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
    <>
      <style jsx global>{`
        @keyframes button-pulse-action {
          0%, 100% { 
            transform: scale(1);
          }
          50% { 
            transform: scale(1.02);
          }
        }
        @keyframes button-shine-action {
          0% { transform: translateX(-200%); }
          100% { transform: translateX(200%); }
        }
        @keyframes icon-rotate-subtle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          75% { transform: rotate(-5deg); }
        }
        .animate-button-pulse-action {
          animation: button-pulse-action 2.5s ease-in-out infinite;
        }
        .button-shine-action {
          position: relative;
          overflow: hidden;
        }
        .button-shine-action::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.25),
            transparent
          );
          animation: button-shine-action 3s ease-in-out infinite;
        }
        .animate-icon-rotate {
          animation: icon-rotate-subtle 3s ease-in-out infinite;
        }
      `}</style>

      <div className="flex gap-3 mb-4 animate-fadeIn" style={{ animationDelay: '250ms' }}>
        {/* Bouton Nouvelle transaction avec pulse + shine automatique */}
        <button 
          onClick={onNewTransaction} 
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.05] active:scale-[0.97] animate-button-pulse-action button-shine-action"
          style={{ 
            background: theme.colors.primary,
            color: theme.colors.textOnPrimary,
            boxShadow: `0 4px 20px ${theme.colors.primary}50, 0 8px 30px ${theme.colors.primary}30`
          }}
        >
          <Plus className="w-5 h-5 transition-transform duration-300 hover:rotate-90" />
          <span>Nouvelle transaction</span>
        </button>
        
        {/* Bouton Récurrentes avec animation subtile */}
        <button 
          onClick={onOpenRecurring} 
          className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.05] active:scale-[0.97] button-shine-action"
          style={{ 
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(168, 85, 247, 0.9))',
            color: '#FFFFFF',
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4), 0 8px 30px rgba(139, 92, 246, 0.2)'
          }}
        >
          <RefreshCw className="w-4 h-4 animate-icon-rotate" />
          <span>Récurrentes</span>
        </button>
      </div>
    </>
  );
}