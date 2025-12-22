'use client';

import { useTheme } from '@/contexts/theme-context';

export default function EmptyState() {
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
          className="text-xs" 
          style={{ color: theme.colors.textSecondary }}
        >
          Créez votre première enveloppe budgétaire
        </p>
      </div>
    </>
  );
}