"use client";

import { useTheme } from '@/contexts/theme-context';
import TransactionItem from './TransactionItem';
import EmptyState from './EmptyState';
import SkeletonTransactions from './SkeletonTransactions';

interface Transaction {
  id: number;
  date: string;
  montant: string;
  type: string;
  categorie: string;
  depuis?: string;
  vers?: string;
  moyenPaiement?: string;
  memo?: string;
  isCredit?: boolean;
}

interface TransactionListProps {
  transactions: Transaction[];
  displayedTransactions: Transaction[];
  devise: string;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  remainingCount: number;
  isLoading?: boolean;
  onAddNew: () => void;
}

export default function TransactionList({
  transactions,
  displayedTransactions,
  devise,
  onEdit,
  onDelete,
  onLoadMore,
  hasMore,
  remainingCount,
  isLoading = false,
  onAddNew
}: TransactionListProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };

  // Afficher le skeleton pendant le chargement
  if (isLoading) {
    return <SkeletonTransactions count={5} />;
  }

  return (
    <div 
      className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4 animate-fadeIn"
      style={{ ...cardStyle, animationDelay: '300ms' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold" style={textPrimary}>
            Historique
          </h3>
          {transactions.length > 0 && (
            <p className="text-[10px] mt-0.5" style={textSecondary}>
              {displayedTransactions.length} sur {transactions.length} transaction{transactions.length > 1 ? 's' : ''}
            </p>
          )}
        </div>
        
        {transactions.length > 0 && (
          <div className="flex items-center gap-2">
            <span 
              className="px-2 py-1 rounded-full text-[10px] font-medium transition-all duration-300 hover:scale-105"
              style={{ background: theme.colors.primary + '20', color: theme.colors.primary }}
            >
              {transactions.length} total
            </span>
          </div>
        )}
      </div>

      {/* Liste des transactions ou Empty State */}
      {displayedTransactions.length > 0 ? (
        <div className="space-y-2">
          {displayedTransactions.map((transaction, index) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              devise={devise}
              onEdit={onEdit}
              onDelete={onDelete}
              index={index}
            />
          ))}

          {/* Bouton "Voir plus" */}
          {hasMore && (
            <button 
              onClick={onLoadMore} 
              className="w-full py-3 mt-3 border-2 border-dashed rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/5 hover:scale-[1.01] hover:border-solid active:scale-[0.99]"
              style={{ borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary }}
            >
              Voir plus ({remainingCount} restante{remainingCount > 1 ? 's' : ''})
            </button>
          )}
        </div>
      ) : (
        <EmptyState onAddNew={onAddNew} />
      )}
    </div>
  );
}
