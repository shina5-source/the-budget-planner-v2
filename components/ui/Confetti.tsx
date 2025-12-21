'use client';

import { useState, useEffect, useCallback } from 'react';
import ReactConfetti from 'react-confetti';
import { useTheme } from '@/contexts/theme-context';

interface ConfettiProps {
  trigger: boolean;
}

export default function Confetti({ trigger }: ConfettiProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme, isDark } = useTheme() as any;

  // Gérer la taille de la fenêtre
  useEffect(() => {
    const updateSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (trigger) {
      setIsRunning(true);
      const timer = setTimeout(() => {
        setIsRunning(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [trigger]);

  // Générer les couleurs basées sur le thème actif
  const getThemeColors = useCallback(() => {
    const primary = theme?.colors?.primary || '#D4AF37';
    const accent = theme?.colors?.accent || '#4ECDC4';
    
    // Fonction pour éclaircir une couleur
    const lighten = (color: string, amount: number): string => {
      try {
        const hex = color.startsWith('#') ? color.slice(1) : color;
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
        const hex = color.startsWith('#') ? color.slice(1) : color;
        const r = Math.max(0, parseInt(hex.slice(0, 2), 16) - amount);
        const g = Math.max(0, parseInt(hex.slice(2, 4), 16) - amount);
        const b = Math.max(0, parseInt(hex.slice(4, 6), 16) - amount);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      } catch {
        return color;
      }
    };

    // Couleurs adaptées au mode clair/sombre
    if (isDark) {
      // Mode sombre : couleurs vives et lumineuses
      return [
        primary,
        accent,
        lighten(primary, 60),
        lighten(accent, 40),
        '#FFD700', // Or
        '#FF6B6B', // Rouge corail
        '#4CAF50', // Vert
        '#E0E0E0', // Gris clair
      ];
    } else {
      // Mode clair : couleurs plus saturées et profondes
      return [
        primary,
        accent,
        darken(primary, 30),
        darken(accent, 20),
        '#DAA520', // Or foncé
        '#DC143C', // Cramoisi
        '#228B22', // Vert forêt
        '#4A4A4A', // Gris foncé
      ];
    }
  }, [theme?.colors?.primary, theme?.colors?.accent, isDark]);

  if (!isRunning || windowSize.width === 0) {
    return null;
  }

  return (
    <ReactConfetti
      width={windowSize.width}
      height={windowSize.height}
      numberOfPieces={250}
      recycle={false}
      // Configuration pour effet EXPLOSION depuis le centre
      confettiSource={{
        x: windowSize.width / 2,
        y: windowSize.height / 2,
        w: 10,
        h: 10
      }}
      initialVelocityX={15}
      initialVelocityY={30}
      gravity={0.12}
      tweenDuration={100}
      onConfettiComplete={() => setIsRunning(false)}
      colors={getThemeColors()}
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: 'none'
      }}
    />
  );
}

// Export nommé pour compatibilité
export { Confetti };
