'use client';

import { useTheme } from '@/contexts/theme-context';

interface SkeletonCardProps {
  height?: number;
}

export function SkeletonCard({ height = 100 }: SkeletonCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  
  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  
  return (
    <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-pulse" style={cardStyle}>
      <div className="h-4 w-24 rounded mb-3" style={{ backgroundColor: `${theme.colors.cardBorder}50` }} />
      <div className="rounded-lg" style={{ height, backgroundColor: `${theme.colors.cardBorder}30` }} />
    </div>
  );
}