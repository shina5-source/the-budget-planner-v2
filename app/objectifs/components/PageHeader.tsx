"use client";

import { useTheme } from '@/contexts/theme-context';

export default function PageHeader() {
  const { theme } = useTheme();

  return (
    <div className="text-center mb-4 animate-fadeIn">
      <h1 className="text-lg font-semibold" style={{ color: theme.colors.textPrimary }}>
        Objectifs
      </h1>
      <p className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
        Vos objectifs financiers
      </p>
    </div>
  );
}