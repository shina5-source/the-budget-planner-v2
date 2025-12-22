'use client';

import { PiggyBank } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

export default function PageHeader() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  return (
    <div className="text-center mb-4 animate-fadeIn">
      <div className="flex items-center justify-center gap-2 mb-1">
        <div 
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: `${theme.colors.primary}20` }}
        >
          <PiggyBank className="w-4 h-4" style={{ color: theme.colors.primary }} />
        </div>
        <h1 className="text-lg font-semibold" style={{ color: theme.colors.textPrimary }}>
          Épargnes
        </h1>
      </div>
      <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
        Suivi de votre épargne
      </p>
    </div>
  );
}