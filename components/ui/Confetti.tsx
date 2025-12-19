'use client';

import { useEffect, useState, useMemo } from 'react';
import { useTheme } from '@/contexts/theme-context';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
}

interface ConfettiProps {
  trigger: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[]; // Optionnel - si non fourni, utilise les couleurs du thème
}

export default function Confetti({ 
  trigger, 
  duration = 3500, 
  particleCount = 60,
  colors: customColors 
}: ConfettiProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [isActive, setIsActive] = useState(false);

  // Générer les couleurs basées sur le thème si non fournies
  const colors = useMemo(() => {
    if (customColors && customColors.length > 0) {
      return customColors;
    }

    const primary = theme?.colors?.primary || '#D4AF37';
    const accent = theme?.colors?.accent || primary;

    // Fonction pour éclaircir une couleur
    const lighten = (color: string, amount: number): string => {
      try {
        const hex = color.replace('#', '');
        const r = Math.min(255, parseInt(hex.slice(0, 2), 16) + amount);
        const g = Math.min(255, parseInt(hex.slice(2, 4), 16) + amount);
        const b = Math.min(255, parseInt(hex.slice(4, 6), 16) + amount);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      } catch {
        return color;
      }
    };

    // Fonction pour assombrir une couleur
    const darken = (color: string, amount: number): string => {
      try {
        const hex = color.replace('#', '');
        const r = Math.max(0, parseInt(hex.slice(0, 2), 16) - amount);
        const g = Math.max(0, parseInt(hex.slice(2, 4), 16) - amount);
        const b = Math.max(0, parseInt(hex.slice(4, 6), 16) - amount);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      } catch {
        return color;
      }
    };

    return [
      primary,                    // Couleur primaire du thème
      accent,                     // Couleur accent
      lighten(primary, 60),       // Version claire
      darken(primary, 40),        // Version foncée
      '#4CAF50',                  // Vert succès (universel)
      '#FFD700',                  // Or célébration (universel)
      '#FF6B6B',                  // Rouge festif
      '#4ECDC4',                  // Turquoise
    ];
  }, [theme?.colors?.primary, theme?.colors?.accent, customColors]);

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true);
      
      // Générer les confettis
      const newPieces: ConfettiPiece[] = [];
      for (let i = 0; i < particleCount; i++) {
        newPieces.push({
          id: i,
          x: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 0.5,
          duration: 2 + Math.random() * 2,
          size: 6 + Math.random() * 8,
          rotation: Math.random() * 360,
        });
      }
      setPieces(newPieces);

      // Nettoyer après l'animation
      const timer = setTimeout(() => {
        setIsActive(false);
        setPieces([]);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [trigger, duration, isActive, colors, particleCount]);

  // Reset quand trigger passe à false
  useEffect(() => {
    if (!trigger && isActive) {
      // Laisser l'animation finir naturellement
    }
  }, [trigger, isActive]);

  if (!isActive || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes confetti-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-12px); }
          75% { transform: translateX(12px); }
        }
        .confetti-piece {
          position: absolute;
          top: -20px;
          animation: confetti-fall linear forwards, confetti-shake 0.5s ease-in-out infinite;
          border-radius: 2px;
        }
        .confetti-circle {
          border-radius: 50%;
        }
        .confetti-ribbon {
          border-radius: 1px;
        }
      `}</style>
      
      {pieces.map((piece) => {
        // Varier les formes
        const shapeClass = piece.id % 3 === 0 
          ? 'confetti-circle' 
          : piece.id % 3 === 1 
            ? 'confetti-ribbon' 
            : '';
        
        const height = piece.id % 3 === 1 
          ? piece.size * 0.3  // Ribbon (plus fin)
          : piece.size * 0.6; // Square/Circle

        return (
          <div
            key={piece.id}
            className={`confetti-piece ${shapeClass}`}
            style={{
              left: `${piece.x}%`,
              width: piece.size,
              height: height,
              backgroundColor: piece.color,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s, 0.5s`,
              transform: `rotate(${piece.rotation}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}

// Export nommé aussi pour compatibilité
export { Confetti };
