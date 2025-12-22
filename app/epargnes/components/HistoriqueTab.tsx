'use client';

import { TrendingUp, TrendingDown, History } from 'lucide-react';
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

interface HistoriqueTabProps {
  transactions: Transaction[];
  selectedYear: number;
  devise: string;
}

const ITEMS_PER_PAGE = 50;

export default function HistoriqueTab({ transactions, selectedYear, devise }: HistoriqueTabProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  const cardStyle = useMemo(() => ({ 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  }), [theme.colors.cardBackground, theme.colors.cardBorder]);

  const transactionsAnnuelles = useMemo(() => 
    transactions
      .filter(t => 
        t.date?.startsWith(`${selectedYear}`) && 
        (t.type === 'Épargnes' || t.type === "Reprise d'épargne")
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [transactions, selectedYear]
  );

  const stats = useMemo(() => {
    const totalEpargne = transactionsAnnuelles
      .filter(t => t.type === 'Épargnes')
      .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    
    const totalReprise = transactionsAnnuelles
      .filter(t => t.type === "Reprise d'épargne")
      .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    
    return { totalEpargne, totalReprise, net: totalEpargne - totalReprise };
  }, [transactionsAnnuelles]);

  const displayedTransactions = useMemo(() => 
    transactionsAnnuelles.slice(0, displayCount),
    [transactionsAnnuelles, displayCount]
  );

  const hasMore = displayCount < transactionsAnnuelles.length;

  const loadMore = useCallback(() => {
    setDisplayCount(prev => prev + ITEMS_PER_PAGE);
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const groupedByMonth = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    
    displayedTransactions.forEach(t => {
      const monthKey = t.date.substring(0, 7);
      if (!groups[monthKey]) groups[monthKey] = [];
      groups[monthKey].push(t);
    });
    
    return groups;
  }, [displayedTransactions]);

  const getMonthName = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  if (transactionsAnnuelles.length === 0) {
    return <EmptyState message={`Aucune épargne en ${selectedYear}`} subMessage="L'historique apparaîtra ici" />;
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Résumé annuel */}
      <div 
        className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border"
        style={cardStyle}
      >
        <div className="flex items-center gap-2 mb-3">
          <div 
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: `${theme.colors.primary}15` }}
          >
            <History className="w-4 h-4" style={{ color: theme.colors.primary }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: theme.colors.textPrimary }}>
              Historique {selectedYear}
            </h3>
            <p className="text-[10px]" style={{ color: theme.colors.textSecondary }}>
              {transactionsAnnuelles.length} mouvements
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 rounded-xl" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
            <p className="text-[10px]" style={{ color: theme.colors.textSecondary }}>Épargné</p>
            <p className="text-xs font-bold text-green-500">+{stats.totalEpargne.toFixed(0)}</p>
          </div>
          <div className="text-center p-2 rounded-xl" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
            <p className="text-[10px]" style={{ color: theme.colors.textSecondary }}>Repris</p>
            <p className="text-xs font-bold text-red-500">-{stats.totalReprise.toFixed(0)}</p>
          </div>
          <div className="text-center p-2 rounded-xl" style={{ background: `${theme.colors.primary}10` }}>
            <p className="text-[10px]" style={{ color: theme.colors.textSecondary }}>Net</p>
            <p className={`text-xs font-bold ${stats.net >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stats.net >= 0 ? '+' : ''}{stats.net.toFixed(0)}
            </p>
          </div>
        </div>
      </div>

      {/* Liste groupée par mois */}
      {Object.entries(groupedByMonth).map(([monthKey, monthTransactions], groupIndex) => {
        const monthTotal = monthTransactions.reduce((sum, t) => {
          const amount = parseFloat(t.montant || '0');
          return sum + (t.type === 'Épargnes' ? amount : -amount);
        }, 0);

        return (
          <div 
            key={monthKey}
            className="backdrop-blur-sm rounded-2xl shadow-sm border overflow-hidden animate-fadeIn"
            style={{ ...cardStyle, animationDelay: `${0.1 * groupIndex}s` }}
          >
            <div 
              className="p-3 flex items-center justify-between"
              style={{ background: `${theme.colors.primary}08` }}
            >
              <span className="text-sm font-semibold" style={{ color: theme.colors.textPrimary }}>
                {getMonthName(monthKey)}
              </span>
              <span className={`text-xs font-bold ${monthTotal >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {monthTotal >= 0 ? '+' : ''}{monthTotal.toFixed(2)} {devise}
              </span>
            </div>
            
            <div className="p-3 space-y-2">
              {monthTransactions.map((t, index) => {
                const isEpargne = t.type === 'Épargnes';
                
                return (
                  <div 
                    key={t.id || index}
                    className="flex items-center justify-between py-2 px-3 rounded-xl transition-all duration-200 hover:scale-[1.01]"
                    style={{ background: `${theme.colors.primary}05` }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: isEpargne ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)' }}
                      >
                        {isEpargne 
                          ? <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                          : <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                        }
                      </div>
                      <div>
                        <p className="text-xs font-medium" style={{ color: theme.colors.textPrimary }}>
                          {t.categorie || 'Épargne'}
                        </p>
                        <p className="text-[10px]" style={{ color: theme.colors.textSecondary }}>
                          {formatDate(t.date)}
                        </p>
                      </div>
                    </div>
                    
                    <p className={`text-xs font-bold ${isEpargne ? 'text-green-500' : 'text-red-500'}`}>
                      {isEpargne ? '+' : '-'}{parseFloat(t.montant).toFixed(2)} {devise}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {hasMore && (
        <button 
          onClick={loadMore}
          className="w-full py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] border-2 border-dashed"
          style={{ 
            borderColor: theme.colors.cardBorder,
            color: theme.colors.textPrimary
          }}
        >
          Voir plus ({transactionsAnnuelles.length - displayCount} restants)
        </button>
      )}
    </div>
  );
}