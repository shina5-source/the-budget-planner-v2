"use client";

import { useTheme } from '@/contexts/theme-context';

export default function SkeletonPrevisionnel() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };
  const skeletonBg = { background: theme.colors.cardBackgroundLight };

  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="text-center mb-4">
        <div className="h-5 w-32 rounded mx-auto animate-pulse" style={skeletonBg} />
        <div className="h-3 w-40 rounded mx-auto mt-2 animate-pulse" style={{ ...skeletonBg, animationDelay: '100ms' }} />
      </div>

      {/* Month selector skeleton */}
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-pulse" style={cardStyle}>
        <div className="flex items-center justify-between mb-4">
          <div className="w-8 h-8 rounded-xl" style={skeletonBg} />
          <div className="h-6 w-40 rounded" style={skeletonBg} />
          <div className="w-8 h-8 rounded-xl" style={skeletonBg} />
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-10 h-7 rounded-full" style={{ ...skeletonBg, animationDelay: `${i * 50}ms` }} />
          ))}
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="backdrop-blur-sm rounded-2xl p-1 shadow-sm border flex gap-1 animate-pulse" style={cardStyle}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex-1 h-9 rounded-xl" style={{ ...skeletonBg, animationDelay: `${i * 50}ms` }} />
        ))}
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div 
            key={i} 
            className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-pulse"
            style={{ ...cardStyle, animationDelay: `${i * 100}ms` }}
          >
            <div className="flex justify-between mb-3">
              <div>
                <div className="h-3 w-16 rounded" style={skeletonBg} />
                <div className="h-6 w-24 rounded mt-2" style={skeletonBg} />
              </div>
              <div className="w-10 h-10 rounded-full" style={skeletonBg} />
            </div>
            <div className="space-y-2">
              <div className="h-2 w-full rounded" style={skeletonBg} />
              <div className="h-2 w-full rounded-full" style={skeletonBg} />
            </div>
          </div>
        ))}
      </div>

      {/* Solde skeleton */}
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-pulse" style={cardStyle}>
        <div className="h-3 w-24 rounded mx-auto mb-3" style={skeletonBg} />
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="h-2 w-12 rounded mx-auto mb-2" style={skeletonBg} />
            <div className="h-6 w-20 rounded mx-auto" style={skeletonBg} />
          </div>
          <div className="text-center">
            <div className="h-2 w-12 rounded mx-auto mb-2" style={skeletonBg} />
            <div className="h-6 w-20 rounded mx-auto" style={skeletonBg} />
          </div>
        </div>
      </div>
    </div>
  );
}