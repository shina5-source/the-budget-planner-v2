'use client';

import { Download } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface StatsHeaderProps {
  onExport: () => void;
}

export default function StatsHeader({ onExport }: StatsHeaderProps) {
  const { theme } = useTheme();
  
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 
        className="text-xl font-bold"
        style={{ color: theme.colors.textPrimary }}
      >
        📊 Statistiques
      </h1>
      
      <button
        onClick={onExport}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
        style={{ 
          background: `${theme.colors.primary}20`,
          color: theme.colors.primary 
        }}
      >
        <Download size={14} />
        Export
      </button>
    </div>
  );
}