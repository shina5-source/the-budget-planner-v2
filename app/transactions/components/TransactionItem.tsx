"use client";

import { Edit3, Trash2 } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

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

interface TransactionItemProps {
  transaction: Transaction;
  devise: string;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
  index: number;
}

export default function TransactionItem({ 
  transaction, 
  devise, 
  onEdit, 
  onDelete,
  index 
}: TransactionItemProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Revenus': return 'text-green-400';
      case 'Factures': return 'text-red-400';
      case 'Dépenses': return 'text-orange-400';
      case 'Épargnes': return 'text-violet-400';
      case 'Reprise d\'épargne': return 'text-purple-400';
      case 'Remboursement': return 'text-teal-400';
      case 'Transfert de fond': return 'text-yellow-400';
      default: return '';
    }
  };

  const getTypeBgColor = (type: string) => {
    switch (type) {
      case 'Revenus': return 'bg-green-500/10';
      case 'Factures': return 'bg-red-500/10';
      case 'Dépenses': return 'bg-orange-500/10';
      case 'Épargnes': return 'bg-violet-500/10';
      case 'Reprise d\'épargne': return 'bg-purple-500/10';
      case 'Remboursement': return 'bg-teal-500/10';
      case 'Transfert de fond': return 'bg-yellow-500/10';
      default: return 'bg-gray-500/10';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  return (
    <div 
      className="p-3 rounded-xl border transition-all duration-300 hover:scale-[1.01] hover:shadow-lg animate-fadeIn group"
      style={{ 
        background: theme.colors.cardBackgroundLight, 
        borderColor: theme.colors.cardBorder,
        animationDelay: `${Math.min(index * 50, 500)}ms`
      }}
    >
      <div className="flex items-start gap-3">
        {/* Icône type */}
        <div className={`w-10 h-10 rounded-xl ${getTypeBgColor(transaction.type)} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
          <span className={`text-lg ${getTypeColor(transaction.type)}`}>
            {transaction.type === 'Revenus' ? '↓' : 
             transaction.type === 'Épargnes' ? '💰' :
             transaction.type === 'Transfert de fond' ? '↔' : '↑'}
          </span>
        </div>

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-medium truncate" style={textPrimary}>
              {transaction.categorie}
            </p>
            {transaction.isCredit && (
              <span className="px-1.5 py-0.5 bg-purple-500/30 text-purple-300 rounded text-[9px] font-medium">
                Crédit
              </span>
            )}
            {transaction.memo?.includes('🔄') && (
              <span className="px-1.5 py-0.5 bg-indigo-500/30 text-indigo-300 rounded text-[9px] font-medium">
                Auto
              </span>
            )}
          </div>
          
          <p className="text-[10px] flex items-center gap-1 flex-wrap" style={textSecondary}>
            <span>{formatDate(transaction.date)}</span>
            <span>•</span>
            <span className={`${getTypeColor(transaction.type)} font-medium`}>{transaction.type}</span>
            {transaction.moyenPaiement && (
              <>
                <span>•</span>
                <span>{transaction.moyenPaiement}</span>
              </>
            )}
          </p>
          
          {transaction.depuis && (
            <p className="text-[10px] mt-0.5" style={textSecondary}>
              {transaction.depuis} → {transaction.vers || '-'}
            </p>
          )}
          
          {transaction.memo && (
            <p className="text-[10px] italic mt-1.5 opacity-70" style={textSecondary}>
              &quot;{transaction.memo}&quot;
            </p>
          )}
        </div>

        {/* Montant + Actions */}
        <div className="text-right flex flex-col items-end">
          <p className={`text-base font-bold tabular-nums ${getTypeColor(transaction.type)}`}>
            {transaction.type === 'Revenus' ? '+' : '-'}
            {parseFloat(transaction.montant).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
            <span className="text-xs ml-0.5">{devise}</span>
          </p>
          
          {/* Boutons - Toujours visibles en mobile, hover en desktop */}
          <div className="flex gap-1 mt-2 transition-all duration-300 ease-out 
            opacity-100 
            md:opacity-0 md:translate-y-2 md:scale-95 
            md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-hover:scale-100"
          >
            <button 
              onClick={() => onEdit(transaction)} 
              className="p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
              style={{ 
                background: theme.colors.primary + '20',
                color: theme.colors.primary
              }}
              title="Modifier"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onDelete(transaction.id)} 
              className="p-2 rounded-lg bg-red-500/20 text-red-400 transition-all duration-200 hover:bg-red-500/30 hover:scale-110 active:scale-95"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
