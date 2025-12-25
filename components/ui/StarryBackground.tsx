"use client";

import { useEffect, useState, useMemo } from 'react';
import { useTheme } from '@/contexts/theme-context';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  animationDuration: number;
  animationDelay: number;
  color: string;
}

export function StarryBackground() {
  const { themeKey, isDarkMode } = useTheme();
  const [stars, setStars] = useState<Star[]>([]);

  // Afficher uniquement pour le thème nuit-etoilee
  const isStarryTheme = themeKey === 'nuit-etoilee';

  useEffect(() => {
    if (!isStarryTheme) return;

    const generateStars = () => {
      const newStars: Star[] = [];
      const starCount = isDarkMode ? 100 : 50;
      
      const lightColors = ['#818CF8', '#A5B4FC', '#C7D2FE', '#6366F1', '#8B5CF6'];
      const darkColors = ['#FBBF24', '#FCD34D', '#FDE68A', '#FFFFFF', '#E0F2FE', '#93C5FD'];
      
      for (let i = 0; i < starCount; i++) {
        const colors = isDarkMode ? darkColors : lightColors;
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: isDarkMode ? Math.random() * 3 + 1 : Math.random() * 2 + 1,
          animationDuration: Math.random() * 4 + 3,
          animationDelay: Math.random() * 5,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, [isStarryTheme, isDarkMode]);

  // Générer le CSS dynamique pour chaque étoile
  const starsCSS = useMemo(() => {
    return stars.map((star) => `
      .star-${star.id} {
        left: ${star.x}%;
        top: ${star.y}%;
        width: ${star.size}px;
        height: ${star.size}px;
        background-color: ${star.color};
        box-shadow: 0 0 ${star.size * 2}px ${star.size}px ${star.color}${isDarkMode ? '40' : '30'};
        animation: ${isDarkMode ? 'twinkle' : 'twinkleLight'} ${star.animationDuration}s ease-in-out ${star.animationDelay}s infinite;
      }
    `).join('\n');
  }, [stars, isDarkMode]);

  if (!isStarryTheme) return null;

  return (
    <>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes twinkleLight {
          0%, 100% { opacity: 0.15; transform: scale(0.9); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        @keyframes shootingStar {
          0% { transform: translateX(0) translateY(0) rotate(-45deg); opacity: 1; }
          100% { transform: translateX(-500px) translateY(500px) rotate(-45deg); opacity: 0; }
        }
        .star {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .shooting-star-1 {
          position: absolute;
          width: 100px;
          height: 2px;
          background: linear-gradient(90deg, #FBBF24, transparent);
          border-radius: 50%;
          pointer-events: none;
          top: 15%;
          right: -100px;
          animation: shootingStar 4s ease-in-out 2s infinite;
        }
        .shooting-star-2 {
          position: absolute;
          width: 100px;
          height: 2px;
          background: linear-gradient(90deg, #FBBF24, transparent);
          border-radius: 50%;
          pointer-events: none;
          top: 40%;
          right: -100px;
          animation: shootingStar 4s ease-in-out 7s infinite;
        }
        ${starsCSS}
      `}</style>
      
      <div 
        className="fixed inset-0 overflow-hidden pointer-events-none"
        style={{ zIndex: 0 }}
      >
        {stars.map((star) => (
          <div
            key={star.id}
            className={`star star-${star.id}`}
          />
        ))}
        
        {isDarkMode && (
          <>
            <div className="shooting-star-1" />
            <div className="shooting-star-2" />
          </>
        )}
      </div>
    </>
  );
}

export default StarryBackground;