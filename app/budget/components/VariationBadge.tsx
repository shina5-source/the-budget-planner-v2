'use client';

interface VariationBadgeProps {
  variation: number;
  inverse?: boolean;
  small?: boolean;
  hasData?: boolean;
}

export function VariationBadge({ variation, inverse = false, small = false, hasData = true }: VariationBadgeProps) {
  if (Math.abs(variation) < 1 || !hasData) return null;
  
  const isPositive = inverse ? variation < 0 : variation > 0;
  const color = isPositive ? 'text-green-400 bg-green-500/20' : 'text-red-400 bg-red-500/20';
  const arrow = variation > 0 ? '▲' : '▼';
  
  return (
    <span className={`${small ? 'text-[8px]' : 'text-[9px]'} px-1.5 py-0.5 rounded-full ${color}`}>
      {arrow} {Math.abs(variation).toFixed(0)}%
    </span>
  );
}
