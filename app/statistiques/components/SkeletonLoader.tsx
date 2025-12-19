'use client';

import { useTheme } from '@/contexts/theme-context';

export default function StatsSkeletonLoader() {
  const { theme } = useTheme();

  const shimmerStyle = {
    background: `linear-gradient(90deg, ${theme.colors.cardBackground} 25%, ${theme.colors.cardBorder}40 50%, ${theme.colors.cardBackground} 75%)`,
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite'
  };

  return (
    <div className="min-h-screen p-4" style={{ background: theme.colors.cardBackground }}>
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div 
          className="h-8 w-36 rounded-xl"
          style={shimmerStyle}
        />
        <div 
          className="h-8 w-20 rounded-xl"
          style={shimmerStyle}
        />
      </div>

      {/* Month selector skeleton */}
      <div 
        className="h-14 w-full rounded-2xl mb-4"
        style={shimmerStyle}
      />
      
      {/* Tabs skeleton */}
      <div className="flex gap-2 overflow-hidden mb-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div 
            key={i}
            className="h-8 w-20 rounded-full flex-shrink-0"
            style={{
              ...shimmerStyle,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>
      
      {/* Stats cards skeleton */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[1, 2, 3].map(i => (
          <div 
            key={i}
            className="h-24 rounded-2xl animate-pulse-slow"
            style={{
              ...shimmerStyle,
              animationDelay: `${i * 0.15}s`
            }}
          />
        ))}
      </div>
      
      {/* Alert skeleton */}
      <div 
        className="h-10 w-full rounded-xl mb-4"
        style={shimmerStyle}
      />

      {/* Chart skeleton */}
      <div 
        className="h-64 w-full rounded-2xl mb-4 relative overflow-hidden"
        style={shimmerStyle}
      >
        {/* Fake chart bars */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-around h-40">
          {[60, 80, 45, 90, 70].map((height, i) => (
            <div
              key={i}
              className="w-8 rounded-t-lg animate-pulse-slow"
              style={{
                height: `${height}%`,
                background: `${theme.colors.primary}30`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Second chart skeleton */}
      <div 
        className="h-56 w-full rounded-2xl mb-4 relative overflow-hidden"
        style={shimmerStyle}
      >
        {/* Fake pie chart */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-32 h-32 rounded-full animate-pulse-slow"
            style={{
              background: `conic-gradient(${theme.colors.primary}40 0% 33%, ${theme.colors.cardBorder}60 33% 66%, ${theme.colors.primary}20 66% 100%)`
            }}
          >
            <div 
              className="w-20 h-20 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              style={{ background: theme.colors.cardBackground }}
            />
          </div>
        </div>
      </div>

      {/* List skeleton */}
      <div 
        className="rounded-2xl p-4"
        style={{ background: `${theme.colors.cardBackground}80`, border: `1px solid ${theme.colors.cardBorder}` }}
      >
        <div 
          className="h-5 w-24 rounded-lg mb-4"
          style={shimmerStyle}
        />
        {[1, 2, 3, 4, 5].map(i => (
          <div 
            key={i}
            className="flex items-center gap-3 py-2"
            style={{
              borderBottom: i < 5 ? `1px solid ${theme.colors.cardBorder}30` : 'none'
            }}
          >
            <div 
              className="w-6 h-6 rounded-full"
              style={{
                ...shimmerStyle,
                animationDelay: `${i * 0.1}s`
              }}
            />
            <div className="flex-1 space-y-1">
              <div 
                className="h-3 w-24 rounded"
                style={{
                  ...shimmerStyle,
                  animationDelay: `${i * 0.1 + 0.05}s`
                }}
              />
              <div 
                className="h-2 w-16 rounded"
                style={{
                  ...shimmerStyle,
                  animationDelay: `${i * 0.1 + 0.1}s`
                }}
              />
            </div>
            <div 
              className="h-4 w-16 rounded"
              style={{
                ...shimmerStyle,
                animationDelay: `${i * 0.1 + 0.15}s`
              }}
            />
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      <div className="flex items-center justify-center mt-6 gap-2">
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                background: theme.colors.primary,
                animation: 'pulse-slow 1s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
        <span className="text-xs" style={{ color: theme.colors.textSecondary }}>
          Chargement des statistiques...
        </span>
      </div>
    </div>
  );
}