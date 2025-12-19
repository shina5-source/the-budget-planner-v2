'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/theme-context';

interface ProgressBarProps {
  value: number;
  max: number;
  color: string;
  animated?: boolean;
  height?: number;
}

export default function ProgressBar({ value, max, color, animated = false, height = 8 }: ProgressBarProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const [width, setWidth] = useState(0);
  const percent = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  useEffect(() => {
    if (animated) {
      setTimeout(() => setWidth(percent), 100);
    } else {
      setWidth(percent);
    }
  }, [percent, animated]);

  return (
    <div 
      className="rounded-full overflow-hidden" 
      style={{ height, backgroundColor: `${theme.colors.cardBorder}50` }}
    >
      <div 
        className="h-full rounded-full transition-all duration-1000 ease-out" 
        style={{ width: `${width}%`, backgroundColor: color }} 
      />
    </div>
  );
}