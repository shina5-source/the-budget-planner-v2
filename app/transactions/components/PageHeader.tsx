"use client";

import { useTheme } from '@/contexts/theme-context';
import { PageTitle } from '@/components';

interface PageHeaderProps {
  transactionCount: number;
}

export default function PageHeader({ transactionCount }: PageHeaderProps) {
  return (
    <PageTitle 
      page="transactions" 
      customSubtitle={`${transactionCount} transaction${transactionCount !== 1 ? 's' : ''} enregistrée${transactionCount !== 1 ? 's' : ''}`}
    />
  );
}