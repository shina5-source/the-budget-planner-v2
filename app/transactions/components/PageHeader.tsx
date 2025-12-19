"use client";

import { useTheme } from '@/contexts/theme-context';

interface PageHeaderProps {
  transactionCount: number;
}

export default function PageHeader({ transactionCount }: PageHeaderProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };

  return (
    <div className="text-center mb-4 animate-fadeIn">
      <h1 className="text-xl font-bold" style={textPrimary}>
        Transactions
      </h1>
      <p className="text-xs mt-1" style={textSecondary}>
        {transactionCount} transaction{transactionCount !== 1 ? 's' : ''} enregistrée{transactionCount !== 1 ? 's' : ''}
      </p>
    </div>
  );
}