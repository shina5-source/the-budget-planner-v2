'use client';

import { useTheme } from '@/contexts/theme-context';

interface CircularProgressProps {
  value: number;
  max: number;
  color: string;
  size?: number;
  label: string;
}

export function CircularProgress({ value, max, color, size = 80, label }: CircularProgressProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  
  const percentage = Math.min((value / max) * 100, 100);
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  const textSecondary = { color: theme.colors.textSecondary };
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle 
          cx={size / 2} 
          cy={size / 2} 
          r={radius} 
          stroke={`${theme.colors.cardBorder}50`} 
          strokeWidth={strokeWidth} 
          fill="none" 
        />
        <circle 
          cx={size / 2} 
          cy={size / 2} 
          r={radius} 
          stroke={color} 
          strokeWidth={strokeWidth} 
          fill="none" 
          strokeDasharray={circumference} 
          strokeDashoffset={offset} 
          strokeLinecap="round" 
          className="transition-all duration-1000 ease-out" 
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold" style={{ color }}>{percentage.toFixed(0)}%</span>
        <span className="text-[8px]" style={textSecondary}>{label}</span>
      </div>
    </div>
  );
}
