"use client";

import { Plus } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface AddButtonProps {
  onClick: () => void;
}

export default function AddButton({ onClick }: AddButtonProps) {
  const { theme } = useTheme();

  return (
    <>
      <style jsx global>{`
        @keyframes button-pulse-obj {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          }
          50% { 
            transform: scale(1.02);
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
          }
        }
        @keyframes button-shine-obj {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-button-pulse-obj {
          animation: button-pulse-obj 2.5s ease-in-out infinite;
        }
        .button-shine-obj {
          position: relative;
          overflow: hidden;
        }
        .button-shine-obj::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          background-size: 200% 100%;
          animation: button-shine-obj 3s ease-in-out infinite;
        }
      `}</style>

      <button 
        onClick={onClick} 
        className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg animate-fadeIn animate-button-pulse-obj button-shine-obj"
        style={{ 
          background: theme.colors.primary, 
          color: theme.colors.textOnPrimary,
          boxShadow: `0 4px 20px ${theme.colors.primary}50`,
          animationDelay: '250ms'
        }}
      >
        <Plus className="w-5 h-5" />
        Nouvel objectif
      </button>
    </>
  );
}