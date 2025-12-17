'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface Transaction {
  id: number;
  date: string;
  montant: string;
  type: string;
  categorie: string;
}

interface AccordionSectionProps {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  transactions: Transaction[];
  total: number;
  isExpense?: boolean;
  isOpen: boolean;
  onToggle: () => void;
  color: string;
}

export function AccordionSection({ 
  title, 
  icon: Icon, 
  transactions, 
  total, 
  isExpense = true, 
  isOpen, 
  onToggle, 
  color 
}: AccordionSectionProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  
  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  
  const prefix = isExpense ? '-' : '+';
  const count = transactions.length;

  return (
    <div className="backdrop-blur-sm rounded-2xl shadow-sm border overflow-hidden" style={cardStyle}>
      <button 
        onClick={onToggle} 
        className="w-full flex items-center justify-between p-4 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <div className="text-left">
            <span className="text-sm font-medium" style={textPrimary}>{title}</span>
            <span className="text-[10px] block" style={textSecondary}>
              {count} élément{count > 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold" style={{ color }}>
            {prefix} {total.toFixed(2)} €
          </span>
          {isOpen ? <ChevronUp className="w-5 h-5" style={textPrimary} /> : <ChevronDown className="w-5 h-5" style={textPrimary} />}
        </div>
      </button>

      {isOpen && (
        <div className="animate-fade-in" style={{ borderTopWidth: 1, borderColor: theme.colors.cardBorder }}>
          {transactions.length === 0 ? (
            <p className="text-[10px] text-center py-4" style={textSecondary}>Aucun élément ce mois</p>
          ) : (
            <div>
              {transactions.map((t, i) => (
                <div 
                  key={i} 
                  className="flex justify-between items-center px-4 py-2" 
                  style={{ 
                    borderBottomWidth: i < transactions.length - 1 ? 1 : 0, 
                    borderColor: theme.colors.cardBorder 
                  }}
                >
                  <span className="text-xs" style={textSecondary}>{t.categorie}</span>
                  <span className="text-xs font-medium" style={{ color }}>
                    {prefix} {parseFloat(t.montant).toFixed(2)} €
                  </span>
                </div>
              ))}
            </div>
          )}
          <div 
            className="px-4 py-3 flex justify-between items-center" 
            style={{ background: theme.colors.cardBackgroundLight }}
          >
            <span className="text-sm font-medium" style={textPrimary}>Total</span>
            <span className="text-sm font-bold" style={{ color }}>{prefix} {total.toFixed(2)} €</span>
          </div>
        </div>
      )}
    </div>
  );
}