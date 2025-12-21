"use client";

import { useTheme } from '@/contexts/theme-context';

export default function SkeletonObjectifs() {
  const { theme } = useTheme();

  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };
  const skeletonBg = { background: theme.colors.cardBackgroundLight };

  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="text-center mb-4">
        <div className="h-5 w-24 rounded mx-auto animate-pulse" style={skeletonBg} />
        <div className="h-3 w-36 rounded mx-auto mt-2 animate-pulse" style={{ ...skeletonBg, animationDelay: '100ms' }} />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div 
            key={i}
            className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border animate-pulse"
            style={{ ...cardStyle, animationDelay: `${i * 50}ms` }}
          >
            <div className="h-2 w-16 rounded mx-auto mb-2" style={skeletonBg} />
            <div className="h-4 w-12 rounded mx-auto" style={skeletonBg} />
          </div>
        ))}
      </div>

      {/* Global progress skeleton */}
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4 animate-pulse" style={cardStyle}>
        <div className="h-2 w-28 rounded mx-auto mb-2" style={skeletonBg} />
        <div className="h-3 w-full rounded-full" style={skeletonBg} />
        <div className="flex justify-center gap-4 mt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-2 w-20 rounded" style={skeletonBg} />
          ))}
        </div>
      </div>

      {/* Filter tabs skeleton */}
      <div className="flex gap-2 mb-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div 
            key={i}
            className="flex-1 h-10 rounded-xl animate-pulse"
            style={{ ...skeletonBg, animationDelay: `${i * 50}ms` }}
          />
        ))}
      </div>

      {/* Add button skeleton */}
      <div className="h-12 w-full rounded-xl mb-4 animate-pulse" style={skeletonBg} />

      {/* Objectif cards skeleton */}
      {Array.from({ length: 2 }).map((_, i) => (
        <div 
          key={i}
          className="rounded-2xl p-4 shadow-sm border animate-pulse"
          style={{ ...cardStyle, animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl" style={skeletonBg} />
            <div className="flex-1">
              <div className="h-4 w-32 rounded mb-1" style={skeletonBg} />
              <div className="flex gap-1">
                <div className="h-4 w-14 rounded-full" style={skeletonBg} />
                <div className="h-4 w-14 rounded-full" style={skeletonBg} />
              </div>
            </div>
          </div>
          <div className="h-3 w-full rounded-full mb-2" style={skeletonBg} />
          <div className="flex justify-between">
            <div className="flex gap-4">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j}>
                  <div className="h-2 w-10 rounded mb-1" style={skeletonBg} />
                  <div className="h-3 w-12 rounded" style={skeletonBg} />
                </div>
              ))}
            </div>
            <div className="h-6 w-16 rounded-full" style={skeletonBg} />
          </div>
        </div>
      ))}
    </div>
  );
}