'use client';

import { useTheme } from '@/contexts/theme-context';

export default function SkeletonLoader() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const shimmerBg = theme.colors.cardBackgroundLight;

  return (
    <div className="space-y-4 animate-pulse">
      {/* Calendar Grid Skeleton */}
      <div 
        className="rounded-2xl border p-4"
        style={{ background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="w-8 h-8 rounded-lg" style={{ background: shimmerBg }} />
          <div className="w-24 h-8 rounded-lg" style={{ background: shimmerBg }} />
          <div className="w-8 h-8 rounded-lg" style={{ background: shimmerBg }} />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl" style={{ background: shimmerBg }} />
          ))}
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div 
            key={i}
            className="rounded-2xl border p-4 h-24"
            style={{ background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }}
          >
            <div className="w-full h-full rounded-lg" style={{ background: shimmerBg }} />
          </div>
        ))}
      </div>

      {/* Items Skeleton */}
      <div 
        className="rounded-2xl border p-4"
        style={{ background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }}
      >
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl" style={{ background: shimmerBg }} />
          ))}
        </div>
      </div>
    </div>
  );
}