"use client";

import { useTheme } from '@/contexts/theme-context';

interface SkeletonTransactionsProps {
  count?: number;
}

// Largeurs prédéfinies pour éviter l'erreur d'hydratation (pas de Math.random())
const SKELETON_WIDTHS = [
  { main: '75%', secondary: '60%', third: '40%' },
  { main: '65%', secondary: '70%', third: '35%' },
  { main: '80%', secondary: '55%', third: '45%' },
  { main: '70%', secondary: '65%', third: '30%' },
  { main: '85%', secondary: '50%', third: '50%' },
];

export default function SkeletonTransactions({ count = 5 }: SkeletonTransactionsProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  
  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };

  return (
    <div 
      className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4"
      style={cardStyle}
    >
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div 
            className="h-4 w-20 rounded animate-pulse"
            style={{ background: theme.colors.cardBackgroundLight }}
          />
          <div 
            className="h-3 w-32 rounded mt-1.5 animate-pulse"
            style={{ background: theme.colors.cardBackgroundLight, animationDelay: '100ms' }}
          />
        </div>
        <div 
          className="h-6 w-16 rounded-full animate-pulse"
          style={{ background: theme.colors.cardBackgroundLight }}
        />
      </div>

      {/* Transaction skeletons */}
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, index) => {
          // Utiliser des largeurs prédéfinies basées sur l'index (déterministe)
          const widths = SKELETON_WIDTHS[index % SKELETON_WIDTHS.length];
          
          return (
            <div 
              key={index}
              className="p-3 rounded-xl border animate-pulse"
              style={{ 
                background: theme.colors.cardBackgroundLight, 
                borderColor: theme.colors.cardBorder,
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="flex items-start gap-3">
                {/* Icon skeleton */}
                <div 
                  className="w-10 h-10 rounded-xl flex-shrink-0"
                  style={{ background: theme.colors.cardBackground }}
                />

                {/* Content skeleton */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div 
                      className="h-4 rounded"
                      style={{ 
                        background: theme.colors.cardBackground,
                        width: widths.main
                      }}
                    />
                  </div>
                  <div 
                    className="h-3 rounded"
                    style={{ 
                      background: theme.colors.cardBackground,
                      width: widths.secondary
                    }}
                  />
                  <div 
                    className="h-2 rounded mt-1.5"
                    style={{ 
                      background: theme.colors.cardBackground,
                      width: widths.third
                    }}
                  />
                </div>

                {/* Amount skeleton */}
                <div className="text-right">
                  <div 
                    className="h-5 w-20 rounded"
                    style={{ background: theme.colors.cardBackground }}
                  />
                  <div 
                    className="h-8 w-16 rounded mt-2"
                    style={{ background: theme.colors.cardBackground }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
