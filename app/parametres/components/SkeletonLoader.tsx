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
      </div>

      {/* Skeleton Section Général */}
      <div className="rounded-2xl p-4 border mb-4" style={cardStyle}>
        <div className="flex items-center gap-2 mb-3">
          <div 
            className="w-5 h-5 rounded skeleton-shimmer"
            style={{ backgroundColor: `${theme.colors.cardBorder}30` }}
          />
          <div 
            className="h-4 w-20 rounded skeleton-shimmer"
            style={{ backgroundColor: `${theme.colors.cardBorder}30` }}
          />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div 
                className="h-3 w-16 rounded mb-1 skeleton-shimmer"
                style={{ backgroundColor: `${theme.colors.cardBorder}20` }}
              />
              <div 
                className="h-10 w-full rounded-xl skeleton-shimmer"
                style={{ backgroundColor: `${theme.colors.cardBorder}15` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Skeleton Sections catégories */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div 
          key={i}
          className="rounded-2xl p-4 border mb-3"
          style={cardStyle}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-5 h-5 rounded skeleton-shimmer"
                style={{ backgroundColor: `${theme.colors.cardBorder}30` }}
              />
              <div 
                className="h-4 w-32 rounded skeleton-shimmer"
                style={{ backgroundColor: `${theme.colors.cardBorder}30` }}
              />
              <div 
                className="h-3 w-8 rounded skeleton-shimmer"
                style={{ backgroundColor: `${theme.colors.cardBorder}20` }}
              />
            </div>
            <div 
              className="w-5 h-5 rounded skeleton-shimmer"
              style={{ backgroundColor: `${theme.colors.cardBorder}20` }}
            />
          </div>
        </div>
      ))}

      {/* Skeleton Section Données */}
      <div className="rounded-2xl p-4 border mb-4" style={cardStyle}>
        <div className="flex items-center gap-2 mb-3">
          <div 
            className="w-5 h-5 rounded skeleton-shimmer"
            style={{ backgroundColor: `${theme.colors.cardBorder}30` }}
          />
          <div 
            className="h-4 w-20 rounded skeleton-shimmer"
            style={{ backgroundColor: `${theme.colors.cardBorder}30` }}
          />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className="h-12 w-full rounded-xl skeleton-shimmer"
              style={{ backgroundColor: `${theme.colors.cardBorder}15` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}