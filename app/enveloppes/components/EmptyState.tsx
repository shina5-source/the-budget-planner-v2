'use client';

import { Plus, Sparkles } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface EmptyStateProps {
  onAddClick?: () => void;
}

export default function EmptyState({ onAddClick }: EmptyStateProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  return (
    <>
      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes envelopePulse {
          0%, 100% { 
            transform: scale(1); 
            opacity: 1;
          }
          50% { 
            transform: scale(1.05); 
            opacity: 0.9;
          }
        }
        @keyframes envelopeGlow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(var(--glow-color), 0.3),
                        0 0 40px rgba(var(--glow-color), 0.1);
          }
          50% { 
            box-shadow: 0 0 30px rgba(var(--glow-color), 0.5),
                        0 0 60px rgba(var(--glow-color), 0.2);
          }
        }
        @keyframes envelopeFloat {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }
        @keyframes ringPulseEnv {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.3;
          }
          50% { 
            transform: scale(1.2);
            opacity: 0.1;
          }
        }
        @keyframes sparkle-rotate-env {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(10deg) scale(1.1); }
          50% { transform: rotate(0deg) scale(1); }
          75% { transform: rotate(-10deg) scale(1.1); }
        }
        @keyframes button-pulse-env {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          }
          50% { 
            transform: scale(1.03);
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
          }
        }
        @keyframes button-shine-env {
          0% { transform: translateX(-200%); }
          100% { transform: translateX(200%); }
        }
        .envelope-container {
          animation: envelopePulse 2s ease-in-out infinite;
        }
        .envelope-glow {
          animation: envelopeGlow 2s ease-in-out infinite;
        }
        .envelope-icon {
          animation: envelopeFloat 3s ease-in-out infinite;
        }
        .ring-pulse-env {
          animation: ringPulseEnv 2s ease-in-out infinite;
        }
        .ring-pulse-env-delayed {
          animation: ringPulseEnv 2s ease-in-out infinite;
          animation-delay: 0.5s;
        }
        .animate-sparkle-env {
          animation: sparkle-rotate-env 2s ease-in-out infinite;
        }
        .animate-button-pulse-env {
          animation: button-pulse-env 2s ease-in-out infinite;
        }
        .button-shine-env {
          position: relative;
          overflow: hidden;
        }
        .button-shine-env::after {
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
          animation: button-shine-env 3s ease-in-out infinite;
        }
      `}</style>

      <div 
        className="backdrop-blur-sm rounded-2xl border text-center py-10 mb-4"
        style={{ 
          background: theme.colors.cardBackground, 
          borderColor: theme.colors.cardBorder 
        }}
      >
        {/* Container de l'icône avec effets */}
        <div className="relative w-20 h-20 mx-auto mb-5">
          {/* Cercles pulsants en arrière-plan */}
          <div 
            className="absolute inset-0 rounded-full ring-pulse-env"
            style={{ background: `${theme.colors.primary}20` }}
          />
          <div 
            className="absolute -inset-2 rounded-full ring-pulse-env-delayed"
            style={{ background: `${theme.colors.primary}10` }}
          />
          <div 
            className="absolute -inset-4 rounded-full ring-pulse-env"
            style={{ background: `${theme.colors.primary}05` }}
          />
          
          {/* Container principal avec glow */}
          <div 
            className="relative w-20 h-20 rounded-full flex items-center justify-center envelope-container envelope-glow"
            style={{ 
              background: `linear-gradient(135deg, ${theme.colors.primary}30, ${theme.colors.primary}10)`,
              '--glow-color': theme.colors.primary.replace('#', '').match(/.{2}/g)?.map((x: string) => parseInt(x, 16)).join(', ') || '147, 51, 234'
            } as React.CSSProperties}
          >
            {/* Emoji enveloppe avec animation float */}
            <span className="text-4xl envelope-icon">✉️</span>
          </div>

          {/* Badge Sparkles */}
          <div 
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center border-2 animate-sparkle-env"
            style={{ background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }}
          >
            <Sparkles className="w-4 h-4" style={{ color: theme.colors.primary }} />
          </div>
        </div>

        {/* Titre */}
        <p 
          className="text-sm font-semibold mb-2" 
          style={{ color: theme.colors.textPrimary }}
        >
          Aucune enveloppe
        </p>

        {/* Sous-titre */}
        <p 
          className="text-xs mb-5" 
          style={{ color: theme.colors.textSecondary }}
        >
          Créez votre première enveloppe budgétaire
        </p>

        {/* Bouton avec animation pulse + shine */}
        {onAddClick && (
          <button
            onClick={onAddClick}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg animate-button-pulse-env button-shine-env"
            style={{ 
              background: theme.colors.primary, 
              color: theme.colors.textOnPrimary,
              boxShadow: `0 4px 20px ${theme.colors.primary}50`
            }}
          >
            <Plus className="w-5 h-5" />
            Nouvelle enveloppe
          </button>
        )}
      </div>
    </>
  );
}