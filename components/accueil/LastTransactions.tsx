'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface Transaction {
  id: number;
  date: string;
  montant: string;
  type: string;
  categorie: string;
}

interface LastTransactionsProps {
  transactions: Transaction[];
  devise: string;
  onNavigate: (page: string) => void;
}

export default function LastTransactions({ transactions, devise, onNavigate }: LastTransactionsProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const [showDetails, setShowDetails] = useState(false);

  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };

  if (transactions.length === 0) return null;

  const getColor = (type: string) => {
    switch (type) {
      case 'Revenus': return '#4CAF50';
      case 'Factures': return '#F44336';
      case 'Épargnes': return '#9C27B0';
      default: return '#FF9800';
    }
  };

  return (
    <div 
      className="backdrop-blur-sm rounded-2xl shadow-sm border overflow-hidden animate-fade-in-up opacity-0" 
      style={{ ...cardStyle, animationDelay: '0.5s', animationFillMode: 'forwards' }}
    >
      <button 
        onClick={() => setShowDetails(!showDetails)} 
        className="w-full flex items-center justify-between p-3 transition-colors hover:opacity-80"
      >
        <span className="text-xs font-semibold" style={textPrimary}>Dernières transactions</span>
        <div className="flex items-center gap-2">
          <span 
            className="text-[10px] px-2 py-0.5 rounded-full" 
            style={{ background: `${theme.colors.primary}20`, color: theme.colors.textSecondary }}
          >
            {transactions.length}
          </span>
          {showDetails 
            ? <ChevronUp className="w-4 h-4" style={textSecondary} /> 
            : <ChevronDown className="w-4 h-4" style={textSecondary} />
          }
        </div>
      </button>
      
      {showDetails && (
        <div className="px-3 pb-3 space-y-2 animate-fade-in">
          {transactions.map((t, idx) => {
            const isRevenu = t.type === 'Revenus';
            const color = getColor(t.type);
            
            return (
              <div 
                key={t.id} 
                className="flex items-center justify-between py-2 transition-colors" 
                style={{ 
                  borderTopWidth: idx === 0 ? 1 : 0, 
                  borderColor: `${theme.colors.cardBorder}30` 
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  <div>
                    <p className="text-xs" style={textPrimary}>{t.categorie}</p>
                    <p className="text-[9px]" style={textSecondary}>
                      {new Date(t.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-medium" style={{ color }}>
                  {isRevenu ? '+' : '-'}{parseFloat(t.montant || '0').toFixed(0)}{devise}
                </span>
              </div>
            );
          })}
          
          <button 
            onClick={() => onNavigate('transactions')} 
            className="w-full text-center text-[10px] py-2 rounded-lg transition-all hover:scale-[1.02] font-medium" 
            style={{ color: theme.colors.textOnPrimary, background: theme.colors.primary }}
          >
            Voir tout →
          </button>
        </div>
      )}
    </div>
  );
}