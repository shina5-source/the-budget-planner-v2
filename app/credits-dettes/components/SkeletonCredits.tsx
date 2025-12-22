"use client";

import { useTheme } from '@/contexts/theme-context';

export default function SkeletonCredits() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const skeletonBg = theme.colors.cardBackgroundLight;
  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };

  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 text-center">
          <div className="h-5 rounded-lg mx-auto mb-2 w-32" style={{ background: skeletonBg }} />
          <div className="h-3 rounded-lg mx-auto w-48" style={{ background: skeletonBg }} />
        </div>
        <div className="w-10 h-10 rounded-xl" style={{ background: skeletonBg }} />
      </div>

      {/* Endettement Total skeleton */}
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4" style={cardStyle}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-9 h-9 rounded-lg" style={{ background: skeletonBg }} />
          <div className="h-3 rounded w-28" style={{ background: skeletonBg }} />
        </div>
        <div className="h-7 rounded-lg mx-auto w-36 mb-1" style={{ background: skeletonBg }} />
        <div className="h-2 rounded mx-auto w-24" style={{ background: skeletonBg }} />
      </div>

      {/* Taux Endettement skeleton */}
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4" style={cardStyle}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-lg" style={{ background: skeletonBg }} />
          <div className="h-3 rounded w-32" style={{ background: skeletonBg }} />
        </div>
        <div className="w-24 h-24 rounded-full mx-auto" style={{ background: skeletonBg }} />
        <div className="h-3 rounded mx-auto w-40 mt-3" style={{ background: skeletonBg }} />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[1, 2].map((i) => (
          <div key={i} className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border" style={cardStyle}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-4 h-4 rounded" style={{ background: skeletonBg }} />
              <div className="h-2 rounded w-20" style={{ background: skeletonBg }} />
            </div>
            <div className="h-5 rounded mx-auto w-24" style={{ background: skeletonBg }} />
          </div>
        ))}
      </div>

      {/* Counter skeleton */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border" style={cardStyle}>
            <div className="h-2 rounded mx-auto w-10 mb-2" style={{ background: skeletonBg }} />
            <div className="h-6 rounded mx-auto w-8 mb-1" style={{ background: skeletonBg }} />
            <div className="h-2 rounded mx-auto w-14" style={{ background: skeletonBg }} />
          </div>
        ))}
      </div>

      {/* Credit items skeleton */}
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded" style={{ background: skeletonBg }} />
                <div className="h-4 rounded w-28" style={{ background: skeletonBg }} />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 rounded-full w-12" style={{ background: skeletonBg }} />
                <div className="w-5 h-5 rounded" style={{ background: skeletonBg }} />
              </div>
            </div>
            <div className="h-2 rounded-full w-full mb-2" style={{ background: skeletonBg }} />
            <div className="flex justify-between">
              <div className="h-2 rounded w-24" style={{ background: skeletonBg }} />
              <div className="h-2 rounded w-20" style={{ background: skeletonBg }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}