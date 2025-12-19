'use client';

interface VariationBadgeProps {
  variation: number;
  inverse?: boolean;
  showPoints?: boolean;
  animate?: boolean;
}

export default function VariationBadge({ 
  variation, 
  inverse = false, 
  showPoints = false,
  animate = true 
}: VariationBadgeProps) {
  // Si la variation est trop faible, afficher "="
  if (Math.abs(variation) < (showPoints ? 0.5 : 1)) {
    return (
      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-500/20 text-gray-400">
        =
      </span>
    );
  }
  
  // Pour les dépenses/factures, une baisse est positive (inverse=true)
  const isPositive = inverse ? variation < 0 : variation > 0;
  const isSignificant = Math.abs(variation) >= 10;
  const isVerySignificant = Math.abs(variation) >= 25;
  
  const baseColor = isPositive ? 'text-green-400 bg-green-500/20' : 'text-red-400 bg-red-500/20';
  const arrow = variation > 0 ? '▲' : '▼';
  const suffix = showPoints ? 'pts' : '%';
  
  // Animation pour les variations significatives
  const animationClass = animate && isVerySignificant 
    ? 'animate-pulse-badge' 
    : animate && isSignificant 
      ? 'animate-pulse' 
      : '';
  
  // Effet de brillance pour les très bonnes performances
  const glowEffect = isPositive && isVerySignificant 
    ? { boxShadow: '0 0 8px rgba(34, 197, 94, 0.5)' } 
    : isPositive && isSignificant
      ? { boxShadow: '0 0 4px rgba(34, 197, 94, 0.3)' }
      : {};

  // Effet d'alerte pour les mauvaises performances
  const alertEffect = !isPositive && isVerySignificant
    ? { boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)' }
    : !isPositive && isSignificant
      ? { boxShadow: '0 0 4px rgba(239, 68, 68, 0.3)' }
      : {};

  return (
    <span 
      className={`text-[9px] px-1.5 py-0.5 rounded-full transition-all duration-300 ${baseColor} ${animationClass}`}
      style={{ ...glowEffect, ...alertEffect }}
    >
      {arrow} {Math.abs(variation).toFixed(1)}{suffix}
      {isVerySignificant && (
        <span className="ml-0.5">
          {isPositive ? '🔥' : '⚠️'}
        </span>
      )}
    </span>
  );
}