'use client';

import { TrendingUp, TrendingDown, ArrowRight, Edit2, Trash2 } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { useMemo, useState, useCallback } from 'react';
import EmptyState from './EmptyState';

interface Transaction {
  id?: number;
  type: string;
  categorie: string;
  montant: string;
  date: string;
  compte?: string;
  compteVers?: string;
}

interface MensuelTabProps {
  transactions: Transaction[];
  selectedYear: number;
  selectedMonth: number;
  devise: string;
  onAddClick?: () => void;
  onEditClick?: (transaction: Transaction) => void;
  onDeleteClick?: (transaction: Transaction) => void;
}

const ITEMS_PER_PAGE = 20;

export default function MensuelTab({ 
  transactions, 
  selectedYear, 
  selectedMonth, 
  devise,
  onAddClick,
  onEditClick,
  onDeleteClick
}: MensuelTabProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  const cardStyle = useMemo(() => ({ 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  }), [theme.colors.cardBackground, theme.colors.cardBorder]);

  const getMonthKey = () => `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}`;

  const epargnesTransactions = useMemo(() => 
    transactions
      .filter(t => t.date?.startsWith(getMonthKey()) && (t.type === 'Épargnes' || t.type === "Reprise d'épargne"))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [transactions, selectedYear, selectedMonth]
  );

  const stats = useMemo(() => {
    const totalEpargne = epargnesTransactions
      .filter(t => t.type === 'Épargnes')
      .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    
    const totalReprise = epargnesTransactions
      .filter(t => t.type === "Reprise d'épargne")
      .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    
    return { totalEpargne, totalReprise, net: totalEpargne - totalReprise };
  }, [epargnesTransactions]);

  const displayedTransactions = useMemo(() => 
    epargnesTransactions.slice(0, displayCount),
    [epargnesTransactions, displayCount]
  );

  const hasMore = displayCount < epargnesTransactions.length;

  const loadMore = useCallback(() => {
    setDisplayCount(prev => prev + ITEMS_PER_PAGE);
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  if (epargnesTransactions.length === 0) {
    return <EmptyState message="Aucun mouvement ce mois" subMessage="Les épargnes et reprises apparaîtront ici" onAddClick={onAddClick} />;
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Résumé du mois */}
      <div 
        className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border"
        style={cardStyle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(34, 197, 94, 0.15)' }}
            >
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs" style={{ color: theme.colors.textSecondary }}>Épargné</p>
              <p className="text-sm font-bold text-green-500">+{stats.totalEpargne.toFixed(2)} {devise}</p>
            </div>
          </div>
          
          <ArrowRight className="w-4 h-4" style={{ color: theme.colors.textSecondary }} />
          
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs text-right" style={{ color: theme.colors.textSecondary }}>Repris</p>
              <p className="text-sm font-bold text-red-500">-{stats.totalReprise.toFixed(2)} {devise}</p>
            </div>
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(239, 68, 68, 0.15)' }}
            >
              <TrendingDown className="w-5 h-5 text-red-500" />
            </div>
          </div>
        </div>
        
        <div 
          className="mt-3 pt-3 text-center"
          style={{ borderTopWidth: 1, borderColor: theme.colors.cardBorder }}
        >
          <p className="text-xs" style={{ color: theme.colors.textSecondary }}>Solde net</p>
          <p className={`text-lg font-bold ${stats.net >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {stats.net >= 0 ? '+' : ''}{stats.net.toFixed(2)} {devise}
          </p>
        </div>
      </div>

      {/* Liste des mouvements */}
      <div 
        className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border"
        style={cardStyle}
      >
        <h3 className="text-sm font-semibold mb-3" style={{ color: theme.colors.textPrimary }}>
          Mouvements ({epargnesTransactions.length})
        </h3>
        
        <div className="space-y-2">
          {displayedTransactions.map((t, index) => {
            const isEpargne = t.type === 'Épargnes';
            
            return (
              <div 
                key={t.id || index}
                className="flex items-center justify-between py-3 px-3 rounded-xl transition-all duration-200 hover:scale-[1.01] animate-fadeIn group"
                style={{ 
                  background: `${theme.colors.primary}05`,
                  animationDelay: `${0.03 * index}s`
                }}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: isEpargne ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)' }}
                  >
                    {isEpargne 
                      ? <TrendingUp className="w-4 h-4 text-green-500" />
                      : <TrendingDown className="w-4 h-4 text-red-500" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: theme.colors.textPrimary }}>
                      {t.categorie || 'Épargne'}
                    </p>
                    <p className="text-[10px]" style={{ color: theme.colors.textSecondary }}>
                      {formatDate(t.date)} • {t.compteVers || t.compte || 'Compte'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-bold ${isEpargne ? 'text-green-500' : 'text-red-500'}`}>
                    {isEpargne ? '+' : '-'}{parseFloat(t.montant).toFixed(2)} {devise}
                  </p>
                  
                  {/* Boutons modifier/supprimer */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {onEditClick && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditClick(t);
                        }}
                        className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
                        style={{ background: `${theme.colors.primary}20` }}
                        title="Modifier"
                      >
                        <Edit2 className="w-3.5 h-3.5" style={{ color: theme.colors.primary }} />
                      </button>
                    )}
                    {onDeleteClick && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteClick(t);
                        }}
                        className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
                        style={{ background: 'rgba(239, 68, 68, 0.2)' }}
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {hasMore && (
          <button 
            onClick={loadMore}
            className="w-full mt-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
            style={{ 
              background: `${theme.colors.primary}15`,
              color: theme.colors.primary
            }}
          >
            Voir plus ({epargnesTransactions.length - displayCount} restants)
          </button>
        )}
      </div>
    </div>
  );
}
