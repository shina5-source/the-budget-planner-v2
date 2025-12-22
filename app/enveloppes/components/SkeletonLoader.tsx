'use client';

import { useTheme } from '@/contexts/theme-context';
import { animationStyles } from './constants';

export default function SkeletonLoader() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };

  return (
    <div className="pb-4">
      <style>{animationStyles}</style>
      
      {/* Skeleton Titre */}
      <div className="flex flex-col items-center gap-2 mb-4">
        <div 
          className="w-10 h-10 rounded-xl skeleton-shimmer"
          style={{ backgroundColor: `${theme.colors.cardBorder}30` }}
        />
        <div 
          className="h-5 w-28 rounded skeleton-shimmer"
          style={{ backgroundColor: `${theme.colors.cardBorder}30` }}
        />
        <div 
          className="h-3 w-36 rounded skeleton-shimmer"
          style={{ backgroundColor: `${theme.colors.cardBorder}20` }}
        />
      </div>

      {/* Skeleton Month Selector */}
      <div 
        className="rounded-2xl p-4 border mb-4"
        style={cardStyle}
      >
        <div className="flex items-center justify-between mb-4">
          <div 
            className="w-8 h-8 rounded-lg skeleton-shimmer"
            style={{ backgroundColor: `${theme.colors.cardBorder}30` }}
          />
          <div className="flex items-center gap-2">
            <div 
              className="h-6 w-24 rounded skeleton-shimmer"
              style={{ backgroundColor: `${theme.colors.cardBorder}30` }}
            />
            <div 
              className="h-6 w-16 rounded skeleton-shimmer"
              style={{ backgroundColor: `${theme.colors.cardBorder}30` }}
            />
          </div>
          <div 
            className="w-8 h-8 rounded-lg skeleton-shimmer"
            style={{ backgroundColor: `${theme.colors.cardBorder}30` }}
          />
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={i}
              className="w-10 h-8 rounded-full skeleton-shimmer"
              style={{ backgroundColor: `${theme.colors.cardBorder}20` }}
            />
          ))}
        </div>
      </div>

      {/* Skeleton Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className="rounded-2xl p-3 border"
            style={cardStyle}
          >
            <div 
              className="h-3 w-12 rounded mx-auto mb-2 skeleton-shimmer"
              style={{ backgroundColor: `${theme.colors.cardBorder}20` }}
            />
            <div 
              className="h-4 w-16 rounded mx-auto skeleton-shimmer"
              style={{ backgroundColor: `${theme.colors.cardBorder}30` }}
            />
          </div>
        ))}
      </div>

      {/* Skeleton Buttons */}
      <div className="flex gap-2 mb-4">
        <div 
          className="flex-1 h-12 rounded-xl skeleton-shimmer"
          style={{ backgroundColor: `${theme.colors.primary}30` }}
        />
        <div 
          className="w-28 h-12 rounded-xl skeleton-shimmer"
          style={{ backgroundColor: `${theme.colors.cardBorder}20` }}
        />
      </div>

      {/* Skeleton Enveloppes */}
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className="rounded-2xl p-4 border"
            style={{ 
              ...cardStyle,
              backgroundColor: `${theme.colors.cardBorder}10`
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-xl skeleton-shimmer"
                style={{ backgroundColor: `${theme.colors.cardBorder}30` }}
              />
              <div className="flex-1">
                <div 
                  className="h-4 w-24 rounded mb-1 skeleton-shimmer"
                  style={{ backgroundColor: `${theme.colors.cardBorder}30` }}
                />
                <div 
                  className="h-3 w-16 rounded skeleton-shimmer"
                  style={{ backgroundColor: `${theme.colors.cardBorder}20` }}
                />
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((j) => (
                  <div 
                    key={j}
                    className="w-7 h-7 rounded-lg skeleton-shimmer"
                    style={{ backgroundColor: `${theme.colors.cardBorder}20` }}
                  />
                ))}
              </div>
            </div>
            <div 
              className="h-3 rounded-full mb-2 skeleton-shimmer"
              style={{ backgroundColor: `${theme.colors.cardBorder}30` }}
            />
            <div className="flex justify-between">
              {[1, 2, 3].map((j) => (
                <div key={j} className="text-center">
                  <div 
                    className="h-2 w-10 rounded mb-1 mx-auto skeleton-shimmer"
                    style={{ backgroundColor: `${theme.colors.cardBorder}20` }}
                  />
                  <div 
                    className="h-3 w-12 rounded mx-auto skeleton-shimmer"
                    style={{ backgroundColor: `${theme.colors.cardBorder}30` }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}