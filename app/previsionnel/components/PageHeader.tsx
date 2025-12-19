"use client";

import { useTheme } from '@/contexts/theme-context';

export default function PageHeader() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  return (
    <div className="text-center mb-4 animate-fadeIn">
      <h1 className="text-lg font-semibold" style={{ color: theme.colors.textPrimary }}>
        Prévisionnel
      </h1>
      <p className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
        Comparaison prévu vs réel
      </p>
    </div>
  );
}