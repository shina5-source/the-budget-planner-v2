'use client';

import { useTheme } from '@/contexts/theme-context';

export default function SkeletonLoader() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const cardStyle = {
    background: theme.colors.cardBackground,
    borderColor: theme.colors.cardBorder
  };

  // Animation CSS inline au lieu de style jsx
  const shimmerAnimation = `
    @keyframes shimmer {
      0% { opacity: 0.5; }
      50% { opacity: 1; }
      100% { opacity: 0.5; }
    }
  `;

  const skeletonStyle = {
    background: theme.colors.cardBackgroundLight,
    animation: 'shimmer 1.5s ease-in-out infinite'
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: shimmerAnimation }} />
      <div className="space-y-4">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border"
              style={cardStyle}
            >
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-8 h-8 rounded-xl"
                  style={skeletonStyle}
                />
                <div 
                  className="h-3 w-16 rounded"
                  style={skeletonStyle}
                />
              </div>
              <div 
                className="h-6 w-24 rounded"
                style={skeletonStyle}
              />
            </div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div 
          className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border"
          style={cardStyle}
        >
          <div 
            className="h-4 w-32 rounded mb-4"
            style={skeletonStyle}
          />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div 
                  className="h-4 w-24 rounded"
                  style={skeletonStyle}
                />
                <div 
                  className="h-4 w-16 rounded"
                  style={skeletonStyle}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}