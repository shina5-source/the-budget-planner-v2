'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Activity, Trophy } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { Confetti } from './Confetti';

interface HealthGaugeProps {
  score: number;
}

export function HealthGauge({ score }: HealthGaugeProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const [showConfetti, setShowConfetti] = useState(false);
  const [celebrated, setCelebrated] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const prevScoreRef = useRef<number>(0);
  const initialRenderRef = useRef(true);
  
  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  
  const getScoreColor = (s: number) => s >= 80 ? '#4CAF50' : s >= 60 ? '#8BC34A' : s >= 40 ? '#FF9800' : s >= 20 ? '#FF5722' : '#F44336';
  const getScoreLabel = (s: number) => s >= 80 ? 'Excellent !' : s >= 60 ? 'Bien' : s >= 40 ? 'Moyen' : s >= 20 ? 'À améliorer' : 'Critique';
  const getScoreEmoji = (s: number) => s >= 80 ? '🎉' : s >= 60 ? '👍' : s >= 40 ? '💡' : s >= 20 ? '⚠️' : '🚨';
  const getScoreMessage = (s: number) => s >= 80 ? 'Félicitations ! Gestion exemplaire.' : s >= 60 ? 'Bonne gestion, continuez !' : s >= 40 ? 'Des améliorations possibles.' : s >= 20 ? 'Attention aux dépenses.' : 'Situation critique !';
  
  const scoreColor = getScoreColor(score);
  const isExcellent = score >= 80;

  // Générer les couleurs des confettis basées sur le thème
  const confettiColors = useMemo(() => {
    const primary = theme.colors.primary || '#D4AF37';
    const accent = theme.colors.accent || theme.colors.primary || '#D4AF37';
    
    // Fonction pour éclaircir une couleur
    const lighten = (color: string, amount: number): string => {
      const hex = color.replace('#', '');
      const r = Math.min(255, parseInt(hex.slice(0, 2), 16) + amount);
      const g = Math.min(255, parseInt(hex.slice(2, 4), 16) + amount);
      const b = Math.min(255, parseInt(hex.slice(4, 6), 16) + amount);
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };
    
    // Fonction pour assombrir une couleur
    const darken = (color: string, amount: number): string => {
      const hex = color.replace('#', '');
      const r = Math.max(0, parseInt(hex.slice(0, 2), 16) - amount);
      const g = Math.max(0, parseInt(hex.slice(2, 4), 16) - amount);
      const b = Math.max(0, parseInt(hex.slice(4, 6), 16) - amount);
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    return [
      primary,                    // Couleur primaire du thème
      accent,                     // Couleur accent du thème
      lighten(primary, 60),       // Version claire de la primaire
      darken(primary, 30),        // Version foncée de la primaire
      '#4CAF50',                  // Vert succès (universel)
      '#FFD700',                  // Or (universel pour célébration)
    ];
  }, [theme.colors.primary, theme.colors.accent]);

  // Animation du score (compteur)
  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      prevScoreRef.current = 0;
    }
    
    const duration = 1500;
    const startTime = Date.now();
    const startScore = prevScoreRef.current;
    
    const animateScore = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startScore + (score - startScore) * eased);
      
      setDisplayScore(current);
      
      if (progress < 1) {
        requestAnimationFrame(animateScore);
      } else {
        prevScoreRef.current = score;
      }
    };
    
    requestAnimationFrame(animateScore);
  }, [score]);

  // Déclencher les confettis pour score >= 80 (une seule fois)
  useEffect(() => {
    if (score >= 80 && !celebrated) {
      const timer = setTimeout(() => {
        setShowConfetti(true);
        setCelebrated(true);
      }, 1200);
      
      return () => clearTimeout(timer);
    }
  }, [score, celebrated]);

  // Reset si le score descend sous 80
  useEffect(() => {
    if (score < 80) {
      setCelebrated(false);
      setShowConfetti(false);
    }
  }, [score]);

  const handleConfettiComplete = () => {
    setShowConfetti(false);
  };

  return (
    <>
      <Confetti 
        trigger={showConfetti} 
        duration={3000}
        particleCount={60}
        spread="burst"
        colors={confettiColors}
        onComplete={handleConfettiComplete}
      />
      
      <div 
        className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up"
        style={cardStyle}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <svg width={70} height={70} className="transform -rotate-90">
              <circle 
                cx={35} cy={35} r={30} 
                stroke={`${theme.colors.cardBorder}50`} 
                strokeWidth={6} fill="none" 
              />
              <circle 
                cx={35} cy={35} r={30} 
                stroke={scoreColor} 
                strokeWidth={6} fill="none" 
                strokeDasharray={188} 
                strokeDashoffset={188 - (displayScore / 100) * 188} 
                strokeLinecap="round" 
                className="transition-all duration-300 ease-out"
              />
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold" style={{ color: scoreColor }}>
                {displayScore}
              </span>
            </div>

            {isExcellent && (
              <div 
                className="absolute w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg"
                style={{ top: -2, right: -2 }}
              >
                <Trophy className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" style={{ color: scoreColor }} />
              <span className="text-sm font-semibold" style={textPrimary}>Santé du budget</span>
            </div>
            <p className="text-lg font-bold mt-1" style={{ color: scoreColor }}>
              {getScoreLabel(score)}
            </p>
            <p className="text-[10px]" style={textSecondary}>
              {getScoreEmoji(score)} {getScoreMessage(score)}
            </p>
          </div>
        </div>

        <div className="mt-3">
          <div 
            className="h-1.5 rounded-full overflow-hidden" 
            style={{ backgroundColor: `${theme.colors.cardBorder}30` }}
          >
            <div 
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${displayScore}%`, backgroundColor: scoreColor }}
            />
          </div>
          
          <div className="flex justify-between mt-1">
            {[20, 40, 60, 80, 100].map((milestone) => (
              <div 
                key={milestone} 
                className="text-[8px]"
                style={{ 
                  color: displayScore >= milestone ? scoreColor : theme.colors.textSecondary,
                  opacity: displayScore >= milestone ? 1 : 0.4
                }}
              >
                {milestone === 80 ? '🎯' : milestone === 100 ? '⭐' : milestone}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
