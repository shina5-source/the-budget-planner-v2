"use client";

import { useTheme } from '@/contexts/theme-context';

interface EmptyStateObjectifProps {
  title?: string;
  message?: string;
}

export default function EmptyStateObjectif({ 
  title = "Aucun objectif défini",
  message = "Créez des objectifs pour suivre vos dépenses et épargnes" 
}: EmptyStateObjectifProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  return (
    <>
      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes targetPulse {
          0%, 100% { 
            transform: scale(1); 
            opacity: 1;
          }
          50% { 
            transform: scale(1.05); 
            opacity: 0.9;
          }
        }
        @keyframes targetGlow {
          0%, 100% { 
            box-shadow: 0 0 15px rgba(var(--glow-color), 0.2),
                        0 0 30px rgba(var(--glow-color), 0.1);
          }
          50% { 
            box-shadow: 0 0 25px rgba(var(--glow-color), 0.4),
                        0 0 50px rgba(var(--glow-color), 0.2);
          }
        }
        @keyframes targetRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ringPulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.3;
          }
          50% { 
            transform: scale(1.15);
            opacity: 0.1;
          }
        }
        .target-container-sm {
          animation: targetPulse 2s ease-in-out infinite;
        }
        .target-glow-sm {
          animation: targetGlow 2s ease-in-out infinite;
        }
        .target-icon-sm {
          animation: targetRotate 8s linear infinite;
        }
        .ring-pulse-sm {
          animation: ringPulse 2s ease-in-out infinite;
        }
        .ring-pulse-delayed-sm {
          animation: ringPulse 2s ease-in-out infinite;
          animation-delay: 0.5s;
        }
      `}</style>

      <div className="flex flex-col items-center justify-center py-4">
        {/* Container de l'icône avec effets */}
        <div className="relative w-12 h-12 mx-auto mb-3">
          {/* Cercles pulsants en arrière-plan */}
          <div 
            className="absolute inset-0 rounded-full ring-pulse-sm"
            style={{ background: `${theme.colors.primary}20` }}
          />
          <div 
            className="absolute -inset-1 rounded-full ring-pulse-delayed-sm"
            style={{ background: `${theme.colors.primary}10` }}
          />
          
          {/* Container principal avec glow */}
          <div 
            className="relative w-12 h-12 rounded-full flex items-center justify-center target-container-sm target-glow-sm"
            style={{ 
              background: `linear-gradient(135deg, ${theme.colors.primary}30, ${theme.colors.primary}10)`,
              '--glow-color': theme.colors.primary.replace('#', '').match(/.{2}/g)?.map((x: string) => parseInt(x, 16)).join(', ') || '147, 51, 234'
            } as React.CSSProperties}
          >
            {/* Emoji cible avec flèche */}
            <span className="text-xl target-icon-sm">🎯</span>
          </div>
        </div>

        {/* Titre */}
        <p className="text-sm font-medium mb-1" style={{ color: theme.colors.textSecondary }}>
          {title}
        </p>

        {/* Message */}
        <p className="text-[10px] text-center" style={{ color: theme.colors.textSecondary }}>
          {message}
        </p>
      </div>
    </>
  );
}