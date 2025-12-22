'use client';

import { useTheme } from '@/contexts/theme-context';

export default function Footer() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  return (
    <>
      <style jsx global>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.3); }
          35% { transform: scale(1); }
          45% { transform: scale(1.2); }
          55% { transform: scale(1); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .heartbeat-footer {
          animation: heartbeat 1.5s ease-in-out infinite;
          display: inline-block;
        }
        .gradient-text-footer {
          background: linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6, #ec4899);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 3s ease infinite;
        }
      `}</style>

      <div 
        className="backdrop-blur-sm rounded-2xl p-4 mt-4 text-center border animate-fade-in-up"
        style={{ 
          background: theme.colors.cardBackground, 
          borderColor: theme.colors.cardBorder,
          animationDelay: '0.5s'
        }}
      >
        <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
          The Budget Planner
        </p>
        <p className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
          Créé avec{' '}
          <span className="text-red-400 text-sm heartbeat-footer">❤️</span>
          {' '}by{' '}
          <span className="gradient-text-footer font-semibold">Shina5</span>
        </p>
      </div>
    </>
  );
}