'use client';

import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface VariationBadgeProps {
  current: number;
  previous: number;
  inverse?: boolean;
}

export default function VariationBadge({ current, previous, inverse = false }: VariationBadgeProps) {
  if (previous === 0 && current === 0) return null;
  
  const variation = previous === 0 
    ? (current > 0 ? 100 : 0) 
    : ((current - previous) / Math.abs(previous)) * 100;
  
  const isPositive = inverse ? variation <= 0 : variation >= 0;
  const Icon = variation >= 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <span className={`flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full ${
      isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
    }`}>
      <Icon className="w-2.5 h-2.5" />
      {Math.abs(variation).toFixed(0)}%
    </span>
  );
}